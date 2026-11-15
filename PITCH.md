# Yachiraq: NASA Space Apps Challenge 2026

Challenge: **Field Shift: Adapting Farms with NASA Data**.

- **Live app:** https://yachiraq.netlify.app/?lang=en (English) · https://yachiraq.netlify.app (español)
- **Code:** this repository. Technical setup in [LEEME.md](LEEME.md).

---

## English

### Summary
Yachiraq helps smallholder families in Chiara (Ayacucho, Peru, 3,300–4,000 m) decide which crop rotation to plant over the next 3 years, field by field. The farmer draws the field on a 3D map and answers 5 questions. Yachiraq measures elevation and slope with SRTM, long-term climate with NASA POWER, recent rainfall and soil moisture with GPM IMERG and SMAP, vegetation greenness with MODIS NDVI, and soil with SoilGrids. It then compares 3 rotations: the current one, a soil-building one and a water-saving, market-oriented one. It simulates 36 months and shows when the soil is left bare during heavy-rain months. For each rotation it explains why it was suggested, what evidence supports it, its benefits and risks, the information gaps, and what a local expert should review. Farmers pick their priorities and the ranking updates. It also sends WhatsApp frost and heavy-rain alerts.

### How it addresses the challenge
- **NASA Earth observations:** SRTM/NASADEM, NASA POWER, GPM IMERG, SMAP, MODIS NDVI.
- **Local soil, crop traits and farmer priorities:** SoilGrids, 12 Andean crops (water need, frost tolerance, nitrogen fixing, soil cover, organic matter, market value), 5 farmer priorities.
- **At least 3 rotation strategies including the current one,** compared side by side, each with why, evidence, benefits, information gaps, risks and a confidence level.
- **Bare-field periods and vulnerable seasons:** 36-month timeline with bare-soil months and heavy-rain months; frost-at-flowering checks.
- **Data fusion across resolutions:** everything aggregated to one value per field per month; climate lapse-rate adjusted to field elevation; mean-bias correction of NASA POWER temperature against a local reference (the POWER grid cell over Chiara reads nights several degrees colder than the valley; uncorrected, it would report frost on almost every night of the year).
- **Uncertainty:** each rotation shows a confidence level based on how many data sources loaded live, plus a list of what we do not know.
- **Farmer-centered:** plain Spanish and English, icons, text-to-speech, mobile first, and a clear reminder that the tool supports, and does not replace, farmer judgment.

### Data and tools
- **NASA:** SRTM/NASADEM (elevation and slope, 30 m), NASA POWER (long-term climate), GPM IMERG (recent rainfall), SMAP (soil moisture), MODIS MOD13Q1 NDVI (greenness, 250 m, via ORNL DAAC).
- **Other:** ISRIC SoilGrids (soil), Open-Meteo (7-day forecast), FAO and INIA crop references, USLE cover factor.
- **Tools:** Google Earth Engine, MapLibre GL JS, AWS Terrain Tiles, Esri World Imagery, Netlify, Green-API (WhatsApp), Twilio (SMS backup).

### Use of AI
We used Claude (Anthropic) as a coding and writing assistant. The decision model in the app is not AI: it is a transparent rule-based scoring model, because there is no local yield data to train and validate a trustworthy ML model. The rules can be read, discussed and corrected with agronomists and farmers.

### Next steps
Validate crop timings and rules with INIA and local extension agents, connect the official SENAMHI forecast, recompute the rainfall and soil anomaly automatically every day, add market prices, add Quechua audio, and calibrate the scores with field data.

---

## Español

### Resumen
Yachiraq ayuda a familias campesinas de Chiara (Ayacucho, Perú, 3,300 a 4,000 m) a decidir qué rotación de cultivos sembrar en los próximos 3 años, parcela por parcela. El agricultor dibuja su parcela en un mapa 3D y responde 5 preguntas. Yachiraq mide la altura y la pendiente con SRTM, el clima con NASA POWER, la lluvia y la humedad del suelo recientes con GPM IMERG y SMAP, el verdor de la vegetación con MODIS NDVI y el suelo con SoilGrids. Con eso compara 3 rotaciones: la que ya hace, una para cuidar el suelo y otra para ahorrar agua y vender. Simula 36 meses mes por mes y muestra cuándo queda el suelo descubierto en época de lluvia. Para cada rotación explica por qué se sugiere, en qué datos se basa, qué beneficios y riesgos tiene, qué no sabemos y qué debe revisar un técnico. El agricultor elige sus prioridades y la recomendación cambia. También avisa por WhatsApp antes de una helada o lluvia fuerte.

### Cómo responde al reto
| El reto pide | Yachiraq |
|---|---|
| Usar datos de observación de la Tierra de la NASA | SRTM/NASADEM, NASA POWER, GPM IMERG, SMAP y MODIS NDVI |
| Combinarlos con suelo, cultivos y prioridades | SoilGrids, datos de 12 cultivos andinos y 5 prioridades del agricultor |
| Comparar al menos 3 rotaciones, incluida la actual | 3 rotaciones de 3 años, lado a lado, con la actual como base |
| Explicar por qué, evidencia, beneficios, vacíos y riesgos | Cada rotación tiene esas 5 secciones y un nivel de confianza |
| Meses con suelo descubierto y cultivos vulnerables | Línea de tiempo de 36 meses con meses descubiertos y meses de lluvia fuerte; alerta si florece con helada |
| Combinar datos de distinta resolución | Todo se lleva a un valor por parcela y por mes; el clima se ajusta a la altura de la parcela |
| Satélite frente a estación en tierra | Corrección de sesgo: el cuadro de POWER sobre Chiara marca noches varios grados más frías que la referencia local; sin corregir diría que hiela casi todas las noches del año |
| Explicar incertidumbre | Confianza por rotación según cuántas fuentes llegaron en vivo; lista de lo que no sabemos |
| Fácil para agricultores sin experiencia técnica | Español e inglés sencillos, íconos, lectura en voz alta, funciona en el celular |
| Apoyar, no reemplazar, al agricultor | Aviso en cada pantalla de rotación y en "Cómo funciona" |

### Datos y herramientas
- **NASA:** SRTM/NASADEM (altura y pendiente, 30 m), NASA POWER (clima de largo plazo), GPM IMERG (lluvia reciente), SMAP (humedad del suelo), MODIS MOD13Q1 NDVI (verdor, 250 m, vía ORNL DAAC).
- **Otros:** SoilGrids de ISRIC (suelo), Open-Meteo (pronóstico de 7 días), FAO e INIA (datos de cultivos), factor C de la ecuación USLE (cobertura del suelo).
- **Herramientas:** Google Earth Engine, MapLibre GL JS, AWS Terrain Tiles, Esri World Imagery, Netlify, Green-API (WhatsApp) y Twilio (SMS de respaldo).

### Uso de inteligencia artificial
Usamos Claude (Anthropic) como asistente de programación y redacción. El modelo de la app no es IA: son reglas transparentes que cualquiera puede leer y corregir, porque no hay datos de cosechas de Chiara para entrenar un modelo confiable.

### Qué sigue
Validar los tiempos de cultivo y las reglas con el INIA y técnicos de Chiara, conectar el pronóstico oficial del SENAMHI, recalcular cada día la anomalía de lluvia y suelo, agregar precios de mercado, audio en quechua y calibrar los puntos con datos de campo.
