// Yachiraq: corre la revisión de alertas en este momento (para el demo frente al jurado).
// Abre: https://TU-SITIO.netlify.app/.netlify/functions/alertas-ahora?clave=TU_CLAVE
// Variable de entorno en Netlify: DEMO_KEY (inventa una clave, ej. chiara2026)
import revisar from './alertas-diarias.mjs';

export default async (req) => {
  const clave = new URL(req.url).searchParams.get('clave');
  if (!process.env.DEMO_KEY || clave !== process.env.DEMO_KEY)
    return new Response('Clave incorrecta', { status: 401 });
  return revisar();
};
