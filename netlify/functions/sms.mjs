// Muyuy: envía un SMS con Twilio.
// Variables de entorno en Netlify: TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM (número de Twilio, ej. +15551234567)
// La app llama: POST /.netlify/functions/sms  con  {"to":"+51987654321","body":"texto"}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Usa POST' }, 405);

  let data;
  try { data = await req.json(); } catch { return json({ error: 'JSON inválido' }, 400); }

  const to = String(data.to || '').replace(/\s/g, '');
  const body = String(data.body || '').slice(0, 320);

  // Solo celulares de Perú (+51 y 9 dígitos que empiezan con 9)
  if (!/^\+519\d{8}$/.test(to)) return json({ error: 'Número no válido. Usa +51 y 9 dígitos.' }, 400);
  if (!body) return json({ error: 'Mensaje vacío' }, 400);

  const { TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM } = process.env;
  if (!TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) return json({ error: 'Falta configurar Twilio en Netlify' }, 500);

  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: to, From: TWILIO_FROM, Body: body }),
  });
  const out = await r.json().catch(() => ({}));
  if (!r.ok) return json({ error: out.message || 'Twilio rechazó el envío' }, 502);
  return json({ ok: true, sid: out.sid });
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
