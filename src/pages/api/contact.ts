import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const TO_EMAIL   = 'alexy.beauvarlet@gmail.com';
const FROM_EMAIL = 'CapWeb <onboarding@resend.dev>'; // Remplacer par 'contact@capweb.fr' une fois le domaine vérifié sur Resend

const escapeHtml = (s: string) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const serviceLabels: Record<string, string> = {
  vitrine:     'Site vitrine',
  ecommerce:   'E-commerce',
  refonte:     'Refonte de site',
  seo:         'Référencement (SEO)',
  maintenance: 'Maintenance',
  autre:       'Autre',
};

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json().catch(() => null);

  if (!data || !data.name || !data.email || !data.message || !data.projectType) {
    return new Response(JSON.stringify({ error: 'Champs obligatoires manquants' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return new Response(JSON.stringify({ error: 'Adresse email invalide' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY manquant — impossible d\'envoyer l\'email.');
    return new Response(JSON.stringify({ error: 'Service email non configuré' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resend = new Resend(apiKey);

  const name        = escapeHtml(data.name);
  const company     = escapeHtml(data.company || '—');
  const email       = escapeHtml(data.email);
  const phone       = escapeHtml(data.phone || '—');
  const projectType = serviceLabels[data.projectType] || escapeHtml(data.projectType);
  const pack        = escapeHtml(data.pack || '—');
  const messageHtml = escapeHtml(data.message).replace(/\n/g, '<br />');

  const html = `
    <div style="font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; max-width: 640px; margin: 0 auto;">
      <h2 style="color: #1A0E0A; border-bottom: 2px solid #FF6B2C; padding-bottom: 8px;">Nouvelle demande de contact — CapWeb</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px 0; color: #6b6b6b; width: 180px;">Nom complet</td><td style="padding: 8px 0;"><strong>${name}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #6b6b6b;">Entreprise</td><td style="padding: 8px 0;">${company}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b6b6b;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #1A0E0A;">${email}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #6b6b6b;">Téléphone</td><td style="padding: 8px 0;">${phone}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b6b6b;">Type de projet</td><td style="padding: 8px 0;">${projectType}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b6b6b;">Pack demandé</td><td style="padding: 8px 0;">${pack}</td></tr>
      </table>
      <div style="background: #f5f5f5; border-left: 4px solid #FF6B2C; padding: 16px; border-radius: 4px;">
        <p style="color: #6b6b6b; margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em;">Message</p>
        <div style="color: #1a1a1a; line-height: 1.6;">${messageHtml}</div>
      </div>
      <p style="margin-top: 24px; font-size: 12px; color: #6b6b6b;">
        Envoyé depuis le formulaire de contact de capweb.fr
      </p>
    </div>
  `.trim();

  const text = [
    'Nouvelle demande de contact — CapWeb',
    '',
    `Nom complet    : ${data.name}`,
    `Entreprise     : ${data.company || '—'}`,
    `Email          : ${data.email}`,
    `Téléphone      : ${data.phone || '—'}`,
    `Type de projet : ${projectType}`,
    `Pack demandé   : ${data.pack || '—'}`,
    '',
    'Message :',
    data.message,
  ].join('\n');

  try {
    const { error } = await resend.emails.send({
      from:     FROM_EMAIL,
      to:       [TO_EMAIL],
      replyTo:  data.email,
      subject:  `Nouveau contact CapWeb — ${data.name}${data.company ? ` (${data.company})` : ''}`,
      html,
      text,
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      return new Response(JSON.stringify({ error: 'Échec de l\'envoi' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[contact] Exception:', err);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
