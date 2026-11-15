# Muyuy: lista de pendientes para dejarlo funcional

Marca cada casilla al terminar. Tiempo total: **1 h 45 min** aprox. con 3 personas en paralelo.

| Persona | Bloques |
|---|---|
| Persona 1 (datos) | A1, A3, B, H |
| Persona 2 (publicación) | A2, A4, C, D, E, F, G |
| Persona 3 (presentación) | J, y prepara el pitch desde el inicio |
| Todos | I, K |

> **Dos reglas:** nunca pongan las claves de Twilio dentro de `index.html` (quedarían públicas), y no publiquen con "arrastrar y soltar" en Netlify (las funciones de SMS no se publican así).

---

## A. Crear las cuentas (10 min, en paralelo)

- [ ] **A1. Google Earth Engine:** entra a https://code.earthengine.google.com con una cuenta de Google y registra un proyecto para **uso no comercial** (investigación o educación). *La aprobación puede tardar: háganlo primero.*
- [ ] **A2. GitHub:** crea una cuenta en https://github.com (si no tienen).
- [ ] **A3. Netlify:** entra a https://app.netlify.com con **"Sign up with GitHub"**.
- [ ] **A4. Twilio:** crea una cuenta de prueba en https://www.twilio.com/try-twilio y verifica tu correo y tu celular.

---

## B. Anomalía de lluvia y suelo con Earth Engine (15 min)

- [ ] **B1.** Abre https://code.earthengine.google.com y crea un script nuevo (**New → File**).
- [ ] **B2.** Copia todo el contenido de `gee_anomalia_chiara.js`, pégalo y presiona **Run**.
- [ ] **B3.** En la pestaña **Console** (derecha) aparecen 4 líneas. La última empieza con `const ANOM_CONFIG=`. **Cópiala completa.**
- [ ] **B4.** Abre `index.html` con un editor de texto (VS Code o Bloc de notas), busca `const ANOM_CONFIG=` y **reemplaza esa línea** por la que copiaste. Guarda.
- [ ] **B5. Verifica:** la línea nueva termina en `live:true};`.

**Si aparece un error** como "ImageCollection not found": copien el mensaje completo y pídanle a Claude que corrija el ID en el script.

---

## C. Probar en la computadora (5 min)

- [ ] **C1.** Abre `index.html` con Chrome (doble clic) y con internet.
- [ ] **C2.** Se ve el mapa 3D de Chiara con imagen satelital.
- [ ] **C3.** Escribe un nombre, toca **Empezar** y luego **Ver el ejemplo de Doña Rosa**.
- [ ] **C4.** Abre una parcela, ve a la pestaña **Alertas** y revisa la nota del final: debe decir **"Pronóstico: Open-Meteo, actualizado hoy"** y, si hiciste el bloque B, **"Anomalía: GPM IMERG y SMAP (fechas)"**.

---

## D. Subir a GitHub (10 min)

- [ ] **D1.** En GitHub: **New repository** → nombre `muyuy` → **Public** → **Create repository**.
- [ ] **D2.** Toca **"uploading an existing file"**.
- [ ] **D3.** Arrastra **todo el contenido** de la carpeta `muyuy` (incluida la carpeta `netlify` completa, no solo los archivos sueltos).
- [ ] **D4.** Escribe un mensaje (ej. "Muyuy hackathon") y toca **Commit changes**.
- [ ] **D5. Verifica:** en el repositorio se ven `index.html`, `netlify.toml`, `suscriptores.json` y la carpeta `netlify/functions` con 3 archivos `.mjs`.

---

## E. Publicar en Netlify (10 min)

- [ ] **E1.** En Netlify: **Add new site → Import an existing project → GitHub**.
- [ ] **E2.** Autoriza a Netlify y elige el repositorio `muyuy`.
- [ ] **E3.** No cambies nada (el archivo `netlify.toml` ya configura todo). Toca **Deploy**.
- [ ] **E4.** Cuando diga **Published**, copia el enlace (`https://algo.netlify.app`).
- [ ] **E5.** *(Opcional)* Ponle un nombre fácil: **Site configuration → Change site name** → `muyuy-chiara`.
- [ ] **E6. Verifica:** en **Functions** aparecen `sms`, `alertas-diarias` (con horario programado) y `alertas-ahora`.

---

## F. Configurar Twilio (20 min)

- [ ] **F1.** En la consola de Twilio, consigue un número: **Get a trial phone number**. Anótalo (ej. `+15551234567`).
- [ ] **F2.** Verifica los celulares del equipo y del jurado, si es posible. En la prueba, **solo esos números reciben SMS**: **Phone Numbers → Verified Caller IDs → Add** y escribe `+51` y el celular.
- [ ] **F3.** Activa el envío a Perú: **Messaging → Settings → Geo permissions** → marca **Peru** → **Save**.
- [ ] **F4.** En la página principal de la consola copia el **Account SID** y el **Auth Token**.

*Los SMS de la cuenta de prueba llegan con el texto "Sent from your Twilio trial account". Es normal.*

---

## G. Poner las claves en Netlify (5 min)

- [ ] **G1.** En Netlify: **Site configuration → Environment variables → Add a variable**. Agrega estas 4:

| Nombre | Valor |
|---|---|
| `TWILIO_SID` | Account SID de Twilio (empieza con `AC`) |
| `TWILIO_TOKEN` | Auth Token de Twilio |
| `TWILIO_FROM` | Número de Twilio con `+` (ej. `+15551234567`) |
| `DEMO_KEY` | Una clave que inventen (ej. `chiara2026`) |

- [ ] **G2.** Vuelve a publicar para que tome las claves: **Deploys → Trigger deploy → Deploy site**.

---

## H. Parcelas y celulares de la alerta automática (5 min)

- [ ] **H1.** En GitHub abre `suscriptores.json` y toca el lápiz (**Edit**).
- [ ] **H2.** Cambia `+51900000000` por celulares **verificados en Twilio** (formato `+519XXXXXXXX`). Pueden poner varios: `["+51911111111", "+51922222222"]`.
- [ ] **H3.** *(Opcional)* Cambia `lat`, `lng` y `alt` por los de una parcela real.
- [ ] **H4.** **Commit changes.** Netlify vuelve a publicar solo, en un minuto.

---

## I. Pruebas finales en el celular (15 min)

- [ ] **I1.** Abre el enlace de Netlify en el celular.
- [ ] **I2.** Carga el ejemplo de Doña Rosa, abre "Pampa de arriba" y ve a **Alertas**.
- [ ] **I3.** Más abajo, escribe tu número en **Mi número** y toca **Enviarme SMS** en una alerta. **El SMS llega al celular.**
- [ ] **I4.** Agrega un contacto verificado y toca **Avisar a mi comunidad**. Llega a ambos.
- [ ] **I5.** Prueba la alerta automática: abre `https://TU-SITIO.netlify.app/.netlify/functions/alertas-ahora?clave=TU_CLAVE`.
  - Si el pronóstico trae helada (0 °C o menos) o lluvia fuerte (15 mm o más), **llegan los SMS**.
  - Si no, la página muestra `"sinAlertas": true` con la mínima del pronóstico. Funciona bien: simplemente esa semana no hay alerta.
- [ ] **I6.** Prueba el modo de ejemplo: `https://TU-SITIO.netlify.app/?demo` muestra las alertas con valores de ejemplo.
- [ ] **I7.** Prueba **Agregar parcela → Estoy en mi parcela** (GPS) y dibuja una parcela tocando el mapa. Mueve un punto arrastrándolo.

---

## J. Entrega en Space Apps (20 min)

- [ ] **J1. Demo** (obligatorio): video corto o diapositivas. Muestren el flujo: Mis parcelas → alerta de helada en la parcela de arriba (y ninguna en la de abajo) → qué hacer → SMS que llega al celular → próxima siembra (maíz arriba: "No recomendado", y la alternativa).
- [ ] **J2.** En la página del proyecto pongan:
  - Enlace a la app (Netlify).
  - Enlace al repositorio (GitHub).
  - Enlace al demo (video o diapositivas).
- [ ] **J3. Recursos usados:**
  - **NASA:** SRTM/NASADEM, NASA POWER, GPM IMERG, SMAP.
  - **Otros:** Open-Meteo (pronóstico), FAO GAEZ (aptitud por piso), INIA (tiempos de cultivo, por validar).
  - **Herramientas:** Google Earth Engine, MapLibre GL JS, AWS Terrain Tiles, Esri World Imagery, Twilio, Netlify.
- [ ] **J4.** Si el formulario lo pide, declaren el **uso de IA** (prototipado de interfaz y código).
- [ ] **J5.** Confirmen que no usaron material con derechos de autor: los íconos e ilustraciones son propios.
- [ ] **J6.** Revisen la hora de cierre de la entrega y envíen **con al menos 30 minutos de margen**.

---

## K. Ensayo (10 min)

- [ ] **K1.** Ensayen el demo completo una vez, con el celular en la mano para el SMS.
- [ ] **K2.** Preparen la respuesta a: *"¿Qué pasa si esta semana no hay helada?"* → abren `?demo` y explican que la alerta aparece sola cuando el pronóstico la trae.
- [ ] **K3.** Preparen la respuesta a: *"¿Qué datos son de la NASA y cuáles no?"* → NASA: altura (SRTM), clima (POWER), lluvia (IMERG), suelo (SMAP). Pronóstico: Open-Meteo (en producción, SENAMHI).

---

## Problemas comunes

| Problema | Solución |
|---|---|
| El mapa sale en blanco o dice "necesita internet" | Revisen la conexión. Algunos bloqueadores de anuncios bloquean el mapa: desactívenlos para el sitio. |
| La alerta dice "valores de ejemplo" | El pronóstico no respondió (sin internet) o abrieron el enlace con `?demo`. |
| Al enviar SMS sale "Falta configurar Twilio en Netlify" | Faltan variables del bloque G, o no volvieron a publicar (G2). |
| Twilio da error **21608** | El número de destino no está verificado (F2). En la cuenta de prueba solo se envía a números verificados. |
| Twilio da error **21408** | Falta activar Perú en Geo permissions (F3). |
| `alertas-ahora` dice "Clave incorrecta" | La clave del enlace no coincide con `DEMO_KEY`, o falta volver a publicar. |
| Las funciones no aparecen en Netlify | Se publicó con "arrastrar y soltar". Publiquen desde GitHub (bloques D y E). |
| Desaparecieron las parcelas | Se guardan en cada navegador. En otro celular o navegador hay que crearlas de nuevo (o cargar el ejemplo de Doña Rosa). |
| Error en Earth Engine | Copien el mensaje completo y pídanle a Claude que corrija el script. |
