// Yachiraq: envía una alerta por WhatsApp (Green-API) o, si falla, por SMS (Twilio).
// La app llama: POST /.netlify/functions/sms  con  {"to":"+51987654321","body":"texto"}
//
// Protección (el endpoint es público, así que no puede depender de una clave en el frontend):
//  1. Solo envía a los números de suscriptores.json (los del equipo). Un número ajeno recibe 403.
//     Excepción: llamadas manuales con {"clave":"<DEMO_KEY>"} pueden escribir a cualquier número.
//  2. Límite de envíos por minuto (por IP y por número), en memoria de la instancia.
import { enviar, normalizar } from '../lib/enviar.mjs';

const POR_IP = 8, POR_NUMERO = 4, VENTANA_MS = 60_000;
const golpes = new Map(); // clave -> [timestamps]
function limitado(clave, max) {
  const ahora = Date.now();
  const lista = (golpes.get(clave) || []).filter((t) => ahora - t < VENTANA_MS);
  if (lista.length >= max) { golpes.set(clave, lista); return true; }
  lista.push(ahora); golpes.set(clave, lista);
  if (golpes.size > 500) for (const [k, v] of golpes) if (!v.some((t) => ahora - t < VENTANA_MS)) golpes.delete(k);
  return false;
}

let cache = { t: 0, set: null };
async function permitidos() {
  if (cache.set && Date.now() - cache.t < 5 * 60_000) return cache.set;
  try {
    const subs = await (await fetch(`${process.env.URL}/suscriptores.json`)).json();
    cache = { t: Date.now(), set: new Set(subs.flatMap((s) => s.telefonos).map(normalizar).filter(Boolean)) };
    return cache.set;
  } catch { return new Set(); } // si no se puede leer la lista, no se envía a nadie
}

export default async (req, context) => {
  if (req.method !== 'POST') return json({ error: 'Usa POST' }, 405);

  let data;
  try { data = await req.json(); } catch { return json({ error: 'JSON inválido' }, 400); }

  const tel = normalizar(data.to);
  if (!tel) return json({ error: 'Número no válido. Usa 9 dígitos que empiecen con 9.' }, 400);

  const maestra = !!process.env.DEMO_KEY && data.clave === process.env.DEMO_KEY;
  if (!maestra && !(await permitidos()).has(tel))
    return json({ error: 'Este número no está habilitado en la demo', canal: null }, 403);

  const ip = (context && context.ip) || req.headers.get('x-nf-client-connection-ip') || 'anon';
  if (limitado('ip:' + ip, POR_IP) || limitado('tel:' + tel, POR_NUMERO))
    return json({ error: 'Demasiados envíos seguidos. Espera un minuto.' }, 429);

  const r = await enviar({ to: tel, body: data.body });
  if (!r.ok) return json({ error: r.error, canal: r.canal }, r.canal ? 502 : 400);
  return json({ ok: true, canal: r.canal });
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
