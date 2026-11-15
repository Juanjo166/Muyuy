// Muyuy: envía una alerta por WhatsApp (CallMeBot) o, si no hay API key, por SMS (Twilio).
// La app llama: POST /.netlify/functions/sms  con  {"to":"+51987654321","body":"texto","apikey":"opcional"}
// Si no viene "apikey", se busca en la variable de entorno CALLMEBOT_KEYS. Ver netlify/lib/enviar.mjs.
import { enviar } from '../lib/enviar.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Usa POST' }, 405);

  let data;
  try { data = await req.json(); } catch { return json({ error: 'JSON inválido' }, 400); }

  const r = await enviar({ to: data.to, body: data.body, apikey: data.apikey });
  if (!r.ok) return json({ error: r.error, canal: r.canal }, r.canal ? 502 : 400);
  return json({ ok: true, canal: r.canal });
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
