// Muyuy: envío de alertas. Canal principal: WhatsApp con CallMeBot. Respaldo: SMS con Twilio.
//
// Variables de entorno en Netlify:
//   CALLMEBOT_KEYS  JSON con la API key de cada teléfono, ej. {"51943038635":"123456","51967079790":"654321"}
//                   (las keys NO van en suscriptores.json porque ese archivo es público)
//   CANAL           "auto" (por defecto: WhatsApp si hay key, si no SMS) | "whatsapp" | "sms"
//   TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM   respaldo por SMS (opcional)

// Acepta "+51 943 038 635", "943038635" o "51943038635" y devuelve "51943038635" (o null si no es válido).
export function normalizar(tel) {
  let d = String(tel || '').replace(/\D/g, '');
  if (d.length === 9) d = '51' + d;
  return /^519\d{8}$/.test(d) ? d : null;
}

function keysDelEquipo() {
  try { return JSON.parse(process.env.CALLMEBOT_KEYS || '{}'); } catch { return {}; }
}

// Envía un mensaje. Devuelve { ok, canal, error? }. Nunca lanza.
export async function enviar({ to, body, apikey, canal }) {
  const tel = normalizar(to);
  const texto = String(body || '').trim().slice(0, 600);
  if (!tel) return { ok: false, error: 'Número no válido. Usa 9 dígitos que empiecen con 9.' };
  if (!texto) return { ok: false, error: 'Mensaje vacío' };

  const modo = canal || process.env.CANAL || 'auto';
  const key = String(apikey || keysDelEquipo()[tel] || '').replace(/[^\w-]/g, '');

  if (modo !== 'sms' && key) {
    const r = await porWhatsApp(tel, texto, key);
    if (r.ok || modo === 'whatsapp') return r;
    // en modo auto, si WhatsApp falla se intenta por SMS
    const s = await porSms(tel, texto);
    return s.ok ? s : { ...r, respaldo: s.error };
  }
  if (modo === 'whatsapp') return { ok: false, canal: 'whatsapp', error: 'Falta la API key de CallMeBot para este número' };
  return porSms(tel, texto);
}

async function porWhatsApp(tel, texto, apikey) {
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${tel}&text=${encodeURIComponent(texto)}&apikey=${apikey}`;
    const r = await fetch(url);
    const out = (await r.text()).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    // CallMeBot responde 200 aun con error: hay que leer el texto.
    if (r.ok && /queued|sent/i.test(out) && !/error/i.test(out)) return { ok: true, canal: 'whatsapp' };
    return { ok: false, canal: 'whatsapp', error: out.slice(0, 200) || `CallMeBot respondió ${r.status}` };
  } catch (e) {
    return { ok: false, canal: 'whatsapp', error: 'No se pudo contactar a CallMeBot' };
  }
}

async function porSms(tel, texto) {
  const { TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM } = process.env;
  if (!TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) return { ok: false, canal: 'sms', error: 'Sin API key de WhatsApp y Twilio no está configurado' };
  try {
    const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: '+' + tel, From: TWILIO_FROM, Body: texto.slice(0, 320) }),
    });
    const out = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, canal: 'sms', error: out.message || 'Twilio rechazó el envío' };
    return { ok: true, canal: 'sms' };
  } catch (e) {
    return { ok: false, canal: 'sms', error: 'No se pudo contactar a Twilio' };
  }
}
