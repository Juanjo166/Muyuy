// Muyuy: revisa cada mañana el pronóstico de cada parcela suscrita y envía SMS si viene helada o lluvia fuerte.
// Corre sola todos los días a las 5:00 a. m. hora de Lima (10:00 UTC).
// Para probarla en el demo: en Netlify > Functions > alertas-diarias > "Run now".
// Parcelas y teléfonos: archivo suscriptores.json en la raíz del sitio.

const FROST_C = 0;   // avisar si la mínima es 0 °C o menos
const RAIN_MM = 15;  // avisar si llueven 15 mm o más en un día

export default async () => {
  const site = process.env.URL;
  const subs = await (await fetch(`${site}/suscriptores.json`)).json();
  const results = [];

  for (const s of subs) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${s.lat}&longitude=${s.lng}&elevation=${s.alt}` +
      `&daily=temperature_2m_min,precipitation_sum&timezone=America%2FLima&forecast_days=3`;
    const f = await (await fetch(url)).json();
    const days = f.daily.time.map((t, i) => ({ t, tmin: f.daily.temperature_2m_min[i], rain: f.daily.precipitation_sum[i] }));

    const msgs = [];
    const cold = days.reduce((a, b) => (b.tmin < a.tmin ? b : a));
    if (cold.tmin <= FROST_C)
      msgs.push(`MUYUY: Helada el ${dia(cold.t)} (${Math.round(cold.tmin)}C) en ${s.parcela}. Cubre con paja y prende humo antes del amanecer.`);
    const wet = days.reduce((a, b) => (b.rain > a.rain ? b : a));
    if (wet.rain >= RAIN_MM)
      msgs.push(`MUYUY: Lluvia fuerte el ${dia(wet.t)} (${Math.round(wet.rain)}mm) en ${s.parcela}. Limpia zanjas y canales.`);

    for (const body of msgs)
      for (const to of s.telefonos) {
        const r = await fetch(`${site}/.netlify/functions/sms`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to, body }),
        });
        results.push({ parcela: s.parcela, to, ok: r.ok });
      }
    if (!msgs.length) results.push({ parcela: s.parcela, sinAlertas: true, minima: cold.tmin, lluviaMax: wet.rain });
  }

  console.log(JSON.stringify(results));
  return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
};

const DIAS = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
function dia(iso) { const [y, m, d] = iso.split('-').map(Number); const t = new Date(Date.UTC(y, m - 1, d)); return `${DIAS[t.getUTCDay()]} ${d}`; }

export const config = { schedule: '0 10 * * *' };
