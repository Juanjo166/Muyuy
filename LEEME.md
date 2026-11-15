# Muyuy: cómo dejarlo funcionando

> **Empieza por `PASO-A-PASO.md`:** es la lista de pendientes con casillas, en orden, con el reparto de tareas y la solución a los problemas comunes.

Alertas de helada, lluvia y sequía para las parcelas de Chiara (Ayacucho), con datos de la NASA.

## Qué hay en esta carpeta

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa. |
| `suscriptores.json` | Parcelas y celulares que reciben la alerta automática diaria. |
| `netlify/functions/sms.mjs` | Envía un SMS con Twilio (la app lo usa al tocar "Enviarme SMS"). |
| `netlify/functions/alertas-diarias.mjs` | Todos los días a las 5 a. m. (hora de Lima) revisa el pronóstico y envía SMS si viene helada o lluvia fuerte. |
| `netlify/functions/alertas-ahora.mjs` | Lo mismo, pero en el momento: para mostrarlo en el demo. |
| `gee_anomalia_chiara.js` | Script de Google Earth Engine: calcula la anomalía de lluvia (GPM IMERG) y de humedad del suelo (SMAP). |
| `netlify.toml` | Configuración de Netlify. |
| `PASO-A-PASO.md` | Lista de pendientes para dejarlo funcional y entregarlo. |

## Qué ya funciona sin hacer nada
- Mapa 3D real de Chiara (relieve SRTM e imagen satelital).
- Medición de cada parcela: área, altura, piso y pendiente (SRTM).
- Clima del lugar (NASA POWER, en vivo).
- Pronóstico de 7 días por parcela, ajustado a su altura (Open-Meteo, en vivo).

Basta con abrir `index.html` en Chrome con internet.

## Paso 1: anomalía de lluvia y suelo (15 min)
1. Entra a https://code.earthengine.google.com con una cuenta aprobada de Earth Engine.
2. Pega el contenido de `gee_anomalia_chiara.js` y presiona **Run**.
3. En la consola aparece una línea que empieza con `const ANOM_CONFIG=`. Cópiala.
4. En `index.html`, busca la línea `const ANOM_CONFIG=` y reemplázala por la que copiaste.

Si Earth Engine dice que un ID de colección no existe, busca "IMERG" o "SMAP L3 9 km" en su catálogo y reemplaza el ID en el script (pídele a Claude que lo ajuste con el mensaje de error).

## Paso 2: publicar en Netlify (15 min)
Las funciones (SMS y alertas) **no funcionan con "arrastrar y soltar"**: hay que publicar desde GitHub.
1. Crea un repositorio en GitHub y sube esta carpeta completa.
2. En Netlify: **Add new site → Import an existing project → GitHub** y elige el repositorio. No hay que configurar nada más: `netlify.toml` ya lo indica.
3. Netlify te da un enlace `https://algo.netlify.app`. Ábrelo en el celular.

## Paso 3: SMS reales con Twilio (20 min)
1. Crea una cuenta de prueba en https://www.twilio.com y consigue un número de Twilio.
2. En la cuenta de prueba, **verifica los celulares** del equipo (solo a esos llegan los SMS de prueba).
3. En Netlify: **Site configuration → Environment variables** y agrega:
   - `TWILIO_SID`: el Account SID
   - `TWILIO_TOKEN`: el Auth Token
   - `TWILIO_FROM`: el número de Twilio (ej. `+15551234567`)
   - `DEMO_KEY`: una clave que inventes (ej. `chiara2026`)
4. Vuelve a publicar (**Deploys → Trigger deploy**).
5. En `suscriptores.json`, cambia `+51900000000` por los celulares verificados y vuelve a subir a GitHub.

La app detecta sola que está en Netlify y envía los SMS por la función. Fuera de Netlify, en un celular, el botón abre la app de mensajes con el texto escrito.

## WhatsApp con CallMeBot (canal principal) y SMS de respaldo
Las alertas salen por **WhatsApp (CallMeBot, gratis)**. Si un número no tiene API key, salen por **SMS con Twilio** (si está configurado). Todo el envío está en `netlify/lib/enviar.mjs`.

**Activar a cada persona (una vez, la hace cada dueño del celular):** sigue las instrucciones de https://www.callmebot.com/blog/free-api-whatsapp-messages/ (agregar el contacto de CallMeBot y enviarle el mensaje de activación). CallMeBot responde por WhatsApp con la **API key** de ese número.

**Poner las keys en Netlify (no en el repo, que es público):** **Site configuration → Environment variables**:

| Nombre | Valor |
|---|---|
| `CALLMEBOT_KEYS` | `{"51943038635":"KEY1","519XXXXXXXX":"KEY2"}`: teléfono sin `+` y su key |
| `CANAL` | *(opcional)* `auto` (por defecto), `whatsapp` o `sms` |

Después: **Deploys → Trigger deploy**. En `suscriptores.json` los teléfonos van como `519XXXXXXXX`, **sin keys**.

En la app, el campo "API key de CallMeBot" es opcional: sirve para números que no están en `CALLMEBOT_KEYS`.

## En el demo
- **Alerta automática en vivo:** abre `https://algo.netlify.app/.netlify/functions/alertas-ahora?clave=TU_CLAVE`. Si el pronóstico trae helada o lluvia fuerte, el SMS llega a los celulares de `suscriptores.json`. La respuesta muestra qué se envió o la temperatura mínima si no hubo alerta.
- **Si el pronóstico real no trae helada esa semana:** abre la app con `?demo` al final del enlace (`https://algo.netlify.app/?demo`) para ver las alertas con valores de ejemplo. Díganlo así en el pitch: "esta semana no hay helada; así se ve cuando la hay".

## Fuentes de datos
NASA: SRTM/NASADEM, NASA POWER, GPM IMERG, SMAP. Otras: Open-Meteo (pronóstico), FAO GAEZ (aptitud por piso), INIA (tiempos de cultivo, por validar). Herramientas: Google Earth Engine, MapLibre GL JS, AWS Terrain Tiles, Esri World Imagery, Twilio, Netlify.

## Lo que falta para un producto en operación
- Conectar el pronóstico oficial del SENAMHI.
- Recalcular la anomalía cada día de forma automática (cuenta de servicio de Earth Engine).
- Cuentas de usuario y base de datos, para que cada agricultor se suscriba desde la app y el técnico vea las parcelas de su comunidad.
- Validar con INIA los tiempos y las ventanas de siembra de cada cultivo.
- Audio en quechua.
