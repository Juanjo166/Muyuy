// Muyuy: envío de alertas. Canal principal: WhatsApp con Green-API (instancia vinculada por QR). Respaldo: SMS con Twilio.
//
// Variables de entorno en Netlify:
//   GREEN_ID_INSTANCE, GREEN_API_TOKEN   credenciales de la instancia de Green-API
//   GREEN_API_URL                        (opcional) host de la instancia si no es el clásico, ej. https://7103.api.greenapi.com
//   CANAL                                "auto" (por defecto: WhatsApp y, si falla, SMS) | "whatsapp" | "sms"
//   TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM   respaldo por SMS (opcional)

// Acepta "+51 943 038 635", "943038635" o "51943038635" y devuelve "51943038635" (o null si no es válido).
export function normalizar(tel) {
  let d = String(tel || '').replace(/\D/g, '');
  if (d.length === 9) d = '51' + d;
  return /^519\d{8}$/.test(d) ? d : null;
}

// Envía un mensaje. Devuelve { ok, canal, error? }. Nunca lanza.
export async function enviar({ to, body, canal }) {
  const tel = normalizar(to);
  const texto = String(body || '').trim().slice(0, 600);
  if (!tel) return { ok: false, error: 'Número no válido. Usa 9 dígitos que empiecen con 9.' };
  if (!texto) return { ok: false, error: 'Mensaje vacío' };

  const modo = canal || process.env.CANAL || 'auto';
  const hayGreen = !!(process.env.GREEN_ID_INSTANCE && process.env.GREEN_API_TOKEN);

  if (modo !== 'sms' && hayGreen) {
    const r = await porWhatsApp(tel, texto);
    if (r.ok || modo === 'whatsapp') return r;
    // en modo auto, si WhatsApp falla se intenta por SMS
    const s = await porSms(tel, texto);
    return s.ok ? s : { ...r, respaldo: s.error };
  }
  if (modo === 'whatsapp') return { ok: false, canal: 'whatsapp', error: 'Falta configurar Green-API en Netlify' };
  return porSms(tel, texto);
}

async function porWhatsApp(tel, texto) {
  const { GREEN_ID_INSTANCE, GREEN_API_TOKEN } = process.env;
  const host = (process.env.GREEN_API_URL || 'https://api.green-api.com').replace(/\/+$/, '');
  try {
    const r = await fetch(`${host}/waInstance${GREEN_ID_INSTANCE}/sendMessage/${GREEN_API_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: `${tel}@c.us`, message: texto }),
    });
    const out = await r.json().catch(() => ({}));
    if (r.ok && out.idMessage) return { ok: true, canal: 'whatsapp' };
    const motivo = out.message || out.error || `Green-API respondió ${r.status}`;
    return { ok: false, canal: 'whatsapp', error: String(motivo).slice(0, 200) };
  } catch (e) {
    return { ok: false, canal: 'whatsapp', error: 'No se pudo contactar a Green-API' };
  }
}

async function porSms(tel, texto) {
  const { TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM } = process.env;
  if (!TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) return { ok: false, canal: 'sms', error: 'WhatsApp no disponible y Twilio no está configurado' };
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
