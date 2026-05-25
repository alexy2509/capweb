/**
 * CapWeb · Worker Cloudflare — proxy IA sécurisé.
 *
 * Reçoit les messages du ChatBot frontend, appelle l'API Anthropic Claude
 * en cachant la clé API, applique rate-limit + filtres anti-abus.
 *
 * Variables d'environnement à configurer dans Cloudflare :
 *   - ANTHROPIC_API_KEY  : la clé API Claude (Secret)
 *   - ALLOWED_ORIGINS    : "https://capweb.pro,https://www.capweb.pro" (var)
 *
 * Bindings KV à attacher :
 *   - RATE_LIMIT : namespace KV pour stocker les compteurs par IP
 */

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de CapWeb, une agence de création de sites internet basée à Quimper, dans le Finistère, en Bretagne. Tu réponds aux visiteurs du site capweb.pro de façon claire, professionnelle et chaleureuse.

CONSIGNES STRICTES :
- Réponds en français, en 2 à 4 phrases maximum.
- Reste toujours dans le cadre des services CapWeb. Si on te demande de l'aide non liée (devoirs, code, blagues, conseils non-web), redirige poliment vers les sujets pertinents.
- Si tu ne connais pas la réponse précise, propose au visiteur d'écrire à contact@capweb.pro ou de remplir le formulaire /contact.
- Ne donne jamais de prix ou de délai précis si la question est vague — demande des détails ou donne une fourchette.
- N'invente jamais de fonctionnalité, partenaire, ou service qui n'est pas listé ci-dessous.

INFOS CAPWEB :

🧑‍💼 ENTREPRISE
- Fondateur : Alexy Beauvarlet (micro-entreprise)
- Basé à Quimper (29000), Finistère, Bretagne
- Intervient en Bretagne et partout en France (échanges en visio possibles)
- Contact : contact@capweb.pro, +33 7 81 82 28 21
- Réponse aux demandes sous 48h, support 5j/7

💼 SERVICES
- Site vitrine sur-mesure (à partir de 499€ HT)
- Site e-commerce / boutique en ligne (à partir de 999€ HT)
- Refonte de site existant (à partir de 399€ HT)
- Référencement SEO local (sur devis)

⏱️ DÉLAIS (après signature du devis et acompte)
- Site vitrine : ~1 semaine
- E-commerce : ~2 semaines
- Refonte : ~1 semaine
- SEO : 1 à 2 semaines pour la mise en place initiale

💸 PAIEMENT
- Acompte 40% à la signature du devis (obligatoire)
- Solde libre : en une fois à la livraison ou échéancier convenu
- Échéance max : 60 jours nets après facture finale
- Virement bancaire uniquement, pas d'escompte

🛠️ CE QUI EST INCLUS
- Design unique adapté à l'identité du client
- Responsive mobile-first
- SEO local intégré (ville, département)
- Google Business Profile configuré
- Formation à l'administration du site
- 1 mois de suivi offert après mise en ligne
- Hébergement et nom de domaine non inclus (à la charge du client, conseil offert)

❌ CE QUE CAPWEB NE FAIT PAS
- Applications mobiles natives (iOS, Android)
- Logiciels sur-mesure
- Marketing payant (Google Ads, Meta Ads)
- Rédaction de contenu long (blog complet) sans accompagnement client

🌍 ZONE
Toute la France à distance, présentiel possible en Bretagne (Quimper et alentours).`;

const BLOCKED_PATTERNS = [
  /\b(fais|écris|écrit|write|generate|génère)\s+(mes|mon|un|une)\s+(devoir|disserta|code|programme|script|essay|email|courrier)/i,
  /\b(résous|résout|solve)\s+(cet|ce|une|mon)\s+(exercice|problème|équation)/i,
  /\b(comment\s+(pirater|hacker|cracker))/i,
  /(jailbreak|ignore.+(instruction|consigne)|prompt\s+injection|you are now)/i,
];

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_LENGTH = 6; // 3 paires user/assistant max
const RATE_LIMIT_PER_HOUR = 10;

// --------------------------------------------------------------------------

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });

const corsHeaders = (origin, allowed) => {
  const ok = allowed.split(',').map((o) => o.trim()).includes(origin);
  return {
    'access-control-allow-origin': ok ? origin : 'null',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'Origin',
  };
};

const hashIp = async (ip, salt) => {
  const data = new TextEncoder().encode(`${ip}:${salt}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
};

const isAbuse = (text) => BLOCKED_PATTERNS.some((re) => re.test(text));

// --------------------------------------------------------------------------

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') || '';
    const cors = corsHeaders(origin, env.ALLOWED_ORIGINS || '');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Méthode non autorisée' }, 405, cors);
    }

    if (!cors['access-control-allow-origin'] || cors['access-control-allow-origin'] === 'null') {
      return json({ error: 'Origine non autorisée' }, 403, cors);
    }

    // Lecture du body
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'JSON invalide' }, 400, cors);
    }

    const message = String(body.message || '').trim();
    const history = Array.isArray(body.history) ? body.history : [];

    // 1. Validation longueur
    if (!message) return json({ error: 'Message vide' }, 400, cors);
    if (message.length > MAX_MESSAGE_LENGTH) {
      return json({ error: `Message trop long (max ${MAX_MESSAGE_LENGTH} caractères)` }, 400, cors);
    }

    // 2. Filtre anti-abus
    if (isAbuse(message)) {
      return json({
        reply: "Je ne peux répondre qu'aux questions concernant CapWeb (création de sites internet, services, tarifs, délais, contact). Que puis-je vous dire à ce sujet ?",
      }, 200, cors);
    }

    // 3. Rate-limit par IP (10 messages/heure)
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    const ipKey = await hashIp(ip, env.RATE_LIMIT_SALT || 'capweb');
    const hourBucket = Math.floor(Date.now() / 3600000);
    const rlKey = `rl:${ipKey}:${hourBucket}`;
    const current = parseInt((await env.RATE_LIMIT.get(rlKey)) || '0', 10);
    if (current >= RATE_LIMIT_PER_HOUR) {
      return json({
        reply: "Vous avez beaucoup de questions ! Pour ne pas saturer l'assistant, contactez-nous directement à contact@capweb.pro ou via /contact — réponse sous 48h.",
      }, 200, cors);
    }
    // Incrémente le compteur, TTL 3700s pour expiration auto
    await env.RATE_LIMIT.put(rlKey, String(current + 1), { expirationTtl: 3700 });

    // 4. Préparation des messages (on tronque l'historique)
    const messages = history
      .slice(-MAX_HISTORY_LENGTH)
      .filter((m) => m && typeof m.role === 'string' && typeof m.content === 'string')
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: String(m.content).slice(0, MAX_MESSAGE_LENGTH),
      }));
    messages.push({ role: 'user', content: message });

    // 5. Appel API Claude
    try {
      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages,
        }),
      });

      if (!upstream.ok) {
        const errText = await upstream.text();
        console.error('Anthropic error:', upstream.status, errText);
        return json({
          reply: "Désolé, l'assistant est momentanément indisponible. Vous pouvez nous écrire à contact@capweb.pro.",
        }, 200, cors);
      }

      const data = await upstream.json();
      const reply = (data.content || []).map((c) => c.text || '').join('').trim();

      return json({ reply: reply || "Je n'ai pas de réponse à vous donner. Contactez-nous à contact@capweb.pro." }, 200, cors);
    } catch (e) {
      console.error('Worker error:', e);
      return json({
        reply: "Désolé, l'assistant rencontre un souci technique. Vous pouvez nous écrire à contact@capweb.pro.",
      }, 200, cors);
    }
  },
};
