# Worker IA pour le ChatBot CapWeb

Mini-serveur qui cache la clé API Anthropic et applique rate-limit + filtres anti-abus.

## ⚙️ Déploiement (~10 min, une seule fois)

### 1 · Crée ta clé API Anthropic

1. Va sur **https://console.anthropic.com**
2. Crée un compte (gratuit, 5 € de crédits offerts)
3. **Settings → API Keys → Create Key**
4. Copie la clé qui commence par `sk-ant-…`. **Garde-la précieusement, elle ne sera plus jamais affichée.**

### 2 · Crée ton compte Cloudflare

1. Va sur **https://dash.cloudflare.com/sign-up**
2. Crée un compte (gratuit, sans CB)

### 3 · Installe et configure Wrangler (l'outil Cloudflare)

Dans un terminal, depuis ce dossier `infra/worker/` :

```bash
npm install
npx wrangler login
```

Une fenêtre Cloudflare s'ouvre, autorise l'accès.

### 4 · Crée le namespace KV (pour le rate-limit)

```bash
npx wrangler kv namespace create RATE_LIMIT
```

La commande affiche un bloc style :
```
[[kv_namespaces]]
binding = "RATE_LIMIT"
id = "abc123def456..."
```

**Copie l'`id`** et colle-le dans `wrangler.toml` à la place de `REPLACE_WITH_YOUR_KV_NAMESPACE_ID`.

### 5 · Stocke ta clé API en secret

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

Colle ta clé `sk-ant-…` quand demandé, puis Entrée. Elle est chiffrée et n'apparaîtra jamais en clair.

(Optionnel mais recommandé) un sel pour le hashage des IP :
```bash
npx wrangler secret put RATE_LIMIT_SALT
```
Entre n'importe quelle chaîne aléatoire (ex : `kerho29capweb29`).

### 6 · Déploie

```bash
npx wrangler deploy
```

À la fin, Cloudflare affiche l'URL publique de ton worker, du genre :
```
https://capweb-chatbot.alexy.workers.dev
```

**Copie cette URL.**

### 7 · Branche le frontend du site

Édite `src/components/ChatBot.astro` à la ligne `const AI_ENDPOINT = '...';` et remplace par ton URL :
```js
const AI_ENDPOINT = 'https://capweb-chatbot.alexy.workers.dev';
```

Commit + push, et le chat passera automatiquement à l'IA dès la prochaine visite.

---

## 💰 Coûts

| Service | Quota gratuit | Au-delà |
|---|---|---|
| Cloudflare Workers | 100 000 requêtes/jour | $5 / 10M req |
| Cloudflare KV | 100K reads, 1K writes/jour | $0,50 / M |
| Anthropic Claude Haiku 4.5 | 5 € offerts | ~1 € / 1000 conv |

Pour 30 conversations/jour (cible réaliste), tu restes **gratuit ou à quelques centimes/mois**.

## 🔒 Sécurité

- ✅ Clé API jamais exposée au navigateur (Worker = proxy)
- ✅ CORS strict : seul capweb.pro peut appeler le worker
- ✅ Rate-limit 10 messages/IP/heure (KV avec TTL 1h)
- ✅ Filtres anti-abus (devoirs, code, jailbreaks)
- ✅ Hash IP avec sel (RGPD : pas d'IP brute stockée)
- ✅ Messages max 500 caractères

## 🧪 Test rapide

```bash
curl -X POST https://TON-WORKER.workers.dev \
  -H "Content-Type: application/json" \
  -H "Origin: https://capweb.pro" \
  -d '{"message": "Combien coûte un site vitrine ?"}'
```

Réponse attendue :
```json
{"reply":"Nos sites vitrines démarrent à 499 € HT…"}
```

## 🔄 Mettre à jour

Modifie `src/index.js` (system prompt, infos business, blocages…) puis :
```bash
npx wrangler deploy
```

C'est appliqué en quelques secondes, le frontend ne change pas.
