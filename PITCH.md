# Muyuy: material para la entrega de NASA Space Apps 2026

Reto: **Field Shift: Adapting Farms with NASA Data**. Este archivo tiene el texto para la página del proyecto, el guion del video, las diapositivas y las respuestas para el jurado. Primero en español y después en inglés (la nominación global se evalúa en inglés).

> Antes de enviar: reemplacen `https://TU-SITIO.netlify.app` por el enlace real y revisen los números del demo (cambian con los datos en vivo).

---

## Español

### Resumen (página del proyecto, ~150 palabras)
Muyuy ayuda a familias campesinas de Chiara (Ayacucho, Perú, 3,300 a 4,000 m) a decidir qué rotación de cultivos sembrar en los próximos 3 años, parcela por parcela. El agricultor dibuja su parcela en un mapa 3D y responde 5 preguntas. Muyuy mide la altura y la pendiente con SRTM, el clima con NASA POWER, la lluvia y la humedad del suelo recientes con GPM IMERG y SMAP, el verdor de la vegetación con MODIS NDVI y el suelo con SoilGrids. Con eso compara 3 rotaciones: la que ya hace, una para cuidar el suelo y otra para ahorrar agua y vender. Simula 36 meses mes por mes y muestra cuándo queda el suelo descubierto en época de lluvia. Para cada rotación explica por qué se sugiere, en qué datos se basa, qué beneficios y riesgos tiene, qué no sabemos y qué debe revisar un técnico. El agricultor elige sus prioridades y la recomendación cambia. También avisa por WhatsApp antes de una helada.

### Cómo responde al reto
| El reto pide | Muyuy |
|---|---|
| Usar datos de observación de la Tierra de la NASA | SRTM/NASADEM, NASA POWER, GPM IMERG, SMAP y MODIS NDVI |
| Combinarlos con suelo, cultivos y prioridades | SoilGrids, datos de 12 cultivos andinos y 5 prioridades del agricultor |
| Comparar al menos 3 rotaciones, incluida la actual | 3 rotaciones de 3 años, lado a lado, con la actual como base |
| Explicar por qué, evidencia, beneficios, vacíos y riesgos | Cada rotación tiene esas 5 secciones y un nivel de confianza |
| Meses con suelo descubierto y cultivos vulnerables | Línea de tiempo de 36 meses con meses descubiertos y meses de lluvia fuerte; alerta si florece con helada |
| Combinar datos de distinta resolución | Todo se lleva a un valor por parcela y por mes; el clima se ajusta a la altura de la parcela |
| Satélite frente a estación en tierra | Corrección de sesgo: el cuadro de POWER en Chiara marca noches ~5 °C más frías que la referencia local; sin corregir diría que hiela 284 noches al año |
| Explicar incertidumbre | Confianza por rotación según cuántas fuentes llegaron en vivo; lista de lo que no sabemos |
| Fácil para agricultores sin experiencia técnica | Español sencillo, íconos, voz en lectura, funciona en el celular |
| Apoyar, no reemplazar, al agricultor | Aviso en cada pantalla de rotación y en "Cómo funciona" |

### Datos usados
- **NASA:** SRTM/NASADEM (altura y pendiente, 30 m), NASA POWER (clima de largo plazo), GPM IMERG (lluvia reciente), SMAP (humedad del suelo), MODIS MOD13Q1 NDVI (verdor, 250 m, vía ORNL DAAC).
- **Otros:** SoilGrids de ISRIC (suelo), Open-Meteo (pronóstico de 7 días), FAO e INIA (datos de cultivos), factor C de la ecuación USLE (cobertura del suelo).
- **Herramientas:** Google Earth Engine, MapLibre GL JS, AWS Terrain Tiles, Esri World Imagery, Netlify, Green-API y Twilio.

### Uso de inteligencia artificial
Usamos Claude (Anthropic) como asistente de programación y redacción. El modelo de la app no es IA: son reglas transparentes que cualquiera puede leer y corregir, porque no hay datos de cosechas de Chiara para entrenar un modelo confiable.

### Guion del video (30 segundos)
1. **(0–5 s)** Doña Rosa en su parcela, a 3,800 m. *"Cada año siembro papa y cebada. Pero llueve distinto y la tierra se cansa."*
2. **(5–12 s)** Pantalla: dibuja su parcela en el mapa 3D. *"Muyuy mide mi parcela con satélites de la NASA: altura, pendiente, clima, lluvia, humedad y verdor."*
3. **(12–22 s)** Pantalla: la comparación de 3 rotaciones, toca "Cuidar el suelo" y cambia la mejor opción. *"Me compara 3 rotaciones para los próximos 3 años y me dice cuál cuida mejor mi suelo y mi agua, y por qué."*
4. **(22–27 s)** Pantalla: alerta de helada por WhatsApp. *"Y me avisa antes de la helada."*
5. **(27–30 s)** Logo. *"Muyuy: datos de la NASA para decidir con tu experiencia."*

### Diapositivas (7)
1. **Muyuy.** Rotaciones que cuidan tu suelo y tu agua. Chiara, Ayacucho.
2. **El problema.** Repetir cultivos cansa el suelo y trae plagas. Lluvias menos predecibles, heladas y laderas que se erosionan. Pocas estaciones en la sierra.
3. **La solución.** Dibujas tu parcela, respondes 5 preguntas y comparas 3 rotaciones de 3 años con datos de satélite.
4. **Los datos de la NASA.** SRTM, POWER, GPM, SMAP y MODIS, todo llevado a un valor por parcela y por mes. Ejemplo de la corrección de sesgo de POWER.
5. **Cómo decide.** Simulación de 36 meses y puntos por criterio (suelo, erosión, agua, frío, plagas, venta, forraje). Las prioridades del agricultor pesan más. Reglas transparentes, no caja negra.
6. **Demo.** Doña Rosa: "Seguir como ahora" frente a "Cuidar el suelo": 21 frente a 18 meses descubiertos y 0 frente a 2 leguminosas.
7. **Qué sigue.** Validar con el INIA y técnicos de Chiara, conectar el SENAMHI, audio en quechua, precios de mercado y calibrar con datos de campo.

### Demo en vivo (2 minutos)
1. Abrir el enlace: se ve el splash y la bienvenida.
2. "Ver el ejemplo de Doña Rosa" → abrir "Pampa de arriba".
3. Pestaña **Hoy**: lluvia y humedad del suelo frente a lo normal (GPM y SMAP) y verdor (MODIS).
4. Pestaña **Rotación**: tabla comparativa → tocar "Ahorrar agua" y ver cómo cambia la mejor opción → abrir "Por qué, en qué datos se basa y qué revisar".
5. Pestaña **Datos**: suelo y clima con corrección de sesgo → "Cómo funciona Muyuy".
6. Pestaña **Alertas**: enviar la alerta por WhatsApp al celular del equipo.

### Preguntas probables del jurado
- **¿Qué datos son de la NASA?** Altura y pendiente (SRTM), clima (POWER), lluvia (GPM IMERG), humedad del suelo (SMAP) y verdor (MODIS). El suelo es de SoilGrids y el pronóstico de Open-Meteo.
- **¿Por qué no usan IA?** No hay datos de cosechas locales para entrenarla y validarla. Las reglas se pueden revisar con técnicos. Con datos de campo se pueden calibrar.
- **¿Qué tan exacto es?** Cada rotación muestra su confianza y lo que no sabemos. Los datos de cultivos son referencias de la FAO y el INIA y deben validarse localmente.
- **¿Funciona en otros lugares?** El método sí: los datos de la NASA son globales. Habría que adaptar la lista de cultivos, los pisos de altura y la referencia climática local.

---

## English

### Summary (~150 words)
Muyuy helps smallholder families in Chiara (Ayacucho, Peru, 3,300–4,000 m) decide which crop rotation to plant over the next 3 years, field by field. The farmer draws the field on a 3D map and answers 5 questions. Muyuy measures elevation and slope with SRTM, long-term climate with NASA POWER, recent rainfall and soil moisture with GPM IMERG and SMAP, vegetation greenness with MODIS NDVI, and soil with SoilGrids. It then compares 3 rotations: the current one, a soil-building one and a water-saving, market-oriented one. It simulates 36 months and shows when the soil is left bare during heavy-rain months. For each rotation it explains why it was suggested, what evidence supports it, its benefits and risks, the information gaps, and what a local expert should review. Farmers pick their priorities and the ranking updates. It also sends WhatsApp frost alerts.

### How it addresses the challenge
- **NASA Earth observations:** SRTM/NASADEM, NASA POWER, GPM IMERG, SMAP, MODIS NDVI.
- **Local soil, crop traits and farmer priorities:** SoilGrids, 12 Andean crops (water need, frost tolerance, nitrogen fixing, soil cover, organic matter, market value), 5 farmer priorities.
- **At least 3 rotation strategies including the current one,** compared side by side, each with why, evidence, benefits, information gaps, risks and a confidence level.
- **Bare-field periods and vulnerable seasons:** 36-month timeline; frost-at-flowering checks.
- **Data fusion across resolutions:** everything aggregated to one value per field per month; climate lapse-rate adjusted to field elevation; mean-bias correction of NASA POWER temperature against a local reference (the POWER cell over Chiara reads nights ~5 °C colder; uncorrected, it would report frost on 284 nights a year).
- **Farmer-centered:** plain Spanish, icons, text-to-speech, mobile first, and a clear reminder that the tool supports, and does not replace, farmer judgment.

### Data and tools
NASA: SRTM/NASADEM, NASA POWER, GPM IMERG, SMAP, MODIS MOD13Q1 (via ORNL DAAC). Other: ISRIC SoilGrids, Open-Meteo, FAO and INIA crop references, USLE cover factor. Tools: Google Earth Engine, MapLibre GL JS, AWS Terrain Tiles, Esri World Imagery, Netlify, Green-API, Twilio.

### Use of AI
We used Claude (Anthropic) as a coding and writing assistant. The decision model in the app is not AI: it is a transparent rule-based scoring model, because there is no local yield data to train and validate a trustworthy ML model. The rules can be read, discussed and corrected with agronomists and farmers.

### 30-second video script
1. **(0–5 s)** Doña Rosa in her field at 3,800 m: *"Every year I plant potato and barley. But the rain has changed and the soil is tired."*
2. **(5–12 s)** She draws her field on the 3D map: *"Muyuy measures my field with NASA satellites: elevation, slope, climate, rain, soil moisture and greenness."*
3. **(12–22 s)** The comparison of 3 rotations; she taps "Protect the soil" and the best option changes: *"It compares 3 rotations for the next 3 years and tells me which one protects my soil and water, and why."*
4. **(22–27 s)** WhatsApp frost alert: *"And it warns me before the frost."*
5. **(27–30 s)** Logo: *"Muyuy: NASA data to decide with your own experience."*
