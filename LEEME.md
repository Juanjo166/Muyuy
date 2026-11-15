# Yachiraq: guía técnica

Herramienta para decidir **qué rotación de cultivos** conviene en cada parcela de Chiara (Ayacucho, Perú) en los próximos 3 años, cuidando el suelo y el agua, con datos de satélites de la NASA. También avisa por WhatsApp antes de una helada o lluvia fuerte.

- **App:** https://yachiraq.netlify.app (español) · https://yachiraq.netlify.app/?lang=en (inglés)
- **Descripción del proyecto y fuentes de datos:** [PITCH.md](PITCH.md)
- Proyecto para NASA Space Apps Challenge 2026, reto *Field Shift: Adapting Farms with NASA Data*.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa (interfaz, mapa 3D, modelo de rotaciones y alertas). |
| `i18n.js` | Traducción al inglés de lo que se ve en pantalla. |
| `suscriptores.json` | Parcelas y celulares que reciben la alerta automática diaria. |
| `netlify/lib/enviar.mjs` | Envío de alertas: WhatsApp con Green-API y, de respaldo, SMS con Twilio. |
| `netlify/functions/sms.mjs` | Envía una alerta al tocar "Enviarme WhatsApp" en la app. |
| `netlify/functions/alertas-diarias.mjs` | Todos los días a las 5 a. m. (hora de Lima) revisa el pronóstico de cada parcela suscrita y avisa si viene helada o lluvia fuerte. |
| `netlify/functions/alertas-ahora.mjs` | Lo mismo que la anterior, pero al momento (protegida con `DEMO_KEY`). |
| `gee_anomalia_chiara.js` | Script de Google Earth Engine: anomalía de lluvia (GPM IMERG) y de humedad del suelo (SMAP). |
| `netlify.toml` | Configuración de Netlify. |

## Qué hace la app
- Mapa 3D real de Chiara (relieve SRTM e imagen satelital), con la zona del piloto marcada.
- Medición de cada parcela: área, altura, piso altitudinal y pendiente (SRTM).
- Clima del lugar (NASA POWER, en vivo), ajustado a la altura de la parcela y con corrección de sesgo frente a una referencia local.
- **Comparación de 3 rotaciones de 3 años** por parcela: la actual, una para cuidar el suelo y otra para ahorrar agua y vender. Cada una con línea de tiempo de 36 meses, puntos por criterio, prioridades del agricultor, evidencia, vacíos de información, riesgos y nivel de confianza.
- Verdor de la vegetación (MODIS NDVI, en vivo; la consulta tarda unos 30 s).
- Suelo: materia orgánica, textura y pH (SoilGrids, en vivo; si no responde, valores típicos de la zona).
- Pronóstico de 7 días por parcela, ajustado a su altura (Open-Meteo), y alertas de helada y lluvia fuerte por WhatsApp.
- Español e inglés. El perfil (nombre, parcelas y contactos) se guarda solo en el celular; "Salir" lo borra.

Para usarla localmente basta un servidor estático (por ejemplo `python -m http.server`) y conexión a internet. Las funciones de envío solo corren en Netlify.

## Configuración

### 1. Anomalía de lluvia y suelo (Google Earth Engine)
1. Entra a https://code.earthengine.google.com con una cuenta de Earth Engine aprobada.
2. Pega el contenido de `gee_anomalia_chiara.js` y presiona **Run**.
3. En la consola aparece una línea que empieza con `const ANOM_CONFIG=`. Cópiala.
4. En `index.html`, reemplaza la línea `const ANOM_CONFIG=` por la que copiaste. Debe terminar en `live:true};`.

El valor queda fijo con la fecha en que se calculó. Conviene volver a calcularlo cada una o dos semanas.

### 2. Publicación (Netlify)
Las funciones de envío **no se publican con "arrastrar y soltar"**: el sitio se publica desde GitHub.
1. En Netlify: **Add new site → Import an existing project → GitHub** y elige este repositorio. `netlify.toml` ya indica todo lo demás.
2. Cada cambio en la rama `main` se publica solo.

### 3. Alertas por WhatsApp (Green-API) y SMS de respaldo (Twilio)
1. En https://green-api.com crea una instancia del plan Developer, escanea el QR con el WhatsApp que enviará los mensajes y copia el `idInstance` y el `apiTokenInstance`.
2. En Netlify, **Site configuration → Environment variables**, agrega:

| Nombre | Valor |
|---|---|
| `GREEN_ID_INSTANCE` | el `idInstance` de la instancia |
| `GREEN_API_TOKEN` | el `apiTokenInstance` |
| `GREEN_API_URL` | *(opcional)* host de la instancia, si no es `https://api.green-api.com` |
| `DEMO_KEY` | una clave para `alertas-ahora` |
| `CANAL` | *(opcional)* `auto` (por defecto), `whatsapp` o `sms` |
| `TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_FROM` | *(opcional)* respaldo por SMS |

3. Vuelve a publicar: **Deploys → Trigger deploy**.
4. En `suscriptores.json`, pon los teléfonos que reciben alertas, en formato `519XXXXXXXX` (sin `+`). El plan gratuito de Green-API admite **3 números**.

**Seguridad:** las claves van solo en las variables de Netlify, nunca en el repositorio. La función `sms` solo envía a los números de `suscriptores.json` y limita los envíos por minuto.

### 4. Probar las alertas
- **Alerta automática en el momento:** `https://yachiraq.netlify.app/.netlify/functions/alertas-ahora?clave=<DEMO_KEY>`. Si el pronóstico trae helada (0 °C o menos) o lluvia fuerte (15 mm o más), llega el WhatsApp; si no, la respuesta muestra `"sinAlertas": true` con la mínima del pronóstico.
- **Modo de ejemplo:** agrega `?demo` al enlace (`https://yachiraq.netlify.app/?demo`) para ver las alertas con valores de ejemplo cuando el pronóstico real no trae helada.

## Traducción al inglés
El selector **ES · EN · QU** está arriba a la derecha; también se puede abrir con `?lang=en`. La traducción está en `i18n.js`: un diccionario hecho a mano, frase por frase, que traduce solo lo que se ve en pantalla, sin cambiar la lógica de la app (las claves internas siguen en español).

**Si agregas un texto nuevo en `index.html`**, agrégalo también en `i18n.js` (en `EX` si es fijo, en `PAT` si lleva números o fechas). Para ver qué falta, abre la app con `?lang=en&i18n=debug`: la consola lista los textos que siguen en español.

## Problemas comunes

| Problema | Solución |
|---|---|
| El mapa sale en blanco | Revisa la conexión. Algunos bloqueadores de anuncios bloquean el mapa. |
| La alerta dice "valores de ejemplo" | El pronóstico no respondió o se abrió el enlace con `?demo`. |
| "Este número no está habilitado en la demo" | El número no está en `suscriptores.json`. |
| `alertas-ahora` responde "Clave incorrecta" | La clave no coincide con `DEMO_KEY`, o falta volver a publicar. |
| Las funciones no aparecen en Netlify | El sitio se publicó con "arrastrar y soltar". Publícalo desde GitHub. |
| Desaparecieron las parcelas | Se guardan en cada navegador. En otro celular hay que crearlas de nuevo o cargar el ejemplo de Doña Rosa. |
| Earth Engine dice que una colección no existe | Busca "IMERG" o "SMAP L3 9 km" en su catálogo y reemplaza el ID en el script. |

## Lo que falta para un producto en operación
- Conectar el pronóstico oficial del SENAMHI.
- Recalcular la anomalía cada día de forma automática (cuenta de servicio de Earth Engine).
- Cuentas de usuario y base de datos, para que cada agricultor se suscriba desde la app y el técnico vea las parcelas de su comunidad.
- Un canal de mensajes sin límite de números (WhatsApp Business oficial o SMS).
- Validar con el INIA los tiempos y las ventanas de siembra de cada cultivo, y con agrónomos los valores de cobertura, agua y materia orgánica de cada cultivo (`TR` en `index.html`).
- Validar la referencia local de temperatura con la estación del SENAMHI más cercana.
- Agregar precios de mercado para el criterio "para vender".
- Audio en quechua.
