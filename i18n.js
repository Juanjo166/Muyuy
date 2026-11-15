/* Yachiraq: traducción al inglés (para el jurado de NASA Space Apps).
   Cómo funciona: la app sigue generando todo en español (las claves internas como 'Papa' o 'Maíz' no cambian).
   Esta capa traduce SOLO lo que se ve en pantalla, frase por frase, con un diccionario hecho a mano.
   No se traduce palabra por palabra: así "papa" es siempre "potato" (nunca "pope").
   Si agregan un texto nuevo en index.html, agréguenlo aquí. Para ver qué falta: abran la app con ?lang=en&i18n=debug
   y la consola lista los textos que siguen en español. */
(function () {
  'use strict';
  const noAcc = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const up = s => s ? s[0].toUpperCase() + s.slice(1) : s;

  /* ---------- Vocabulario controlado ---------- */
  const CROPS = { // minúsculas, sin tildes -> inglés en minúsculas
    'papa': 'potato', 'papa nativa': 'native potato', 'papa amarga': 'bitter potato', 'maiz': 'maize',
    'haba': 'fava bean', 'quinua': 'quinoa', 'tarwi': 'tarwi', 'cebada': 'barley', 'avena': 'oats',
    'avena + vicia': 'oats + vetch', 'avena con vicia': 'oats with vetch', 'oca': 'oca', 'pastos': 'pasture',
    'descanso': 'fallow', 'maiz con haba': 'maize with fava beans', 'avena forrajera': 'forage oats'
  };
  const crop = s => {
    const v = CROPS[noAcc(String(s).trim().toLowerCase())];
    if (!v) return s;
    return /^[A-ZÁÉÍÓÚ]/.test(String(s).trim()) ? up(v) : v;
  };
  const list = s => { // "papa, maíz y haba" -> "potato, maize and fava bean"
    const parts = String(s).split(/, | y /).map(x => crop(x.trim()));
    return parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts[0];
  };
  const yourCrop = c => { const e = crop(c); return /with|\+/.test(e) ? 'your ' + e : 'your ' + e + ' crop'; };
  const STAGE = { brotando: 'sprouting', creciendo: 'growing', floreciendo: 'flowering', madurando: 'ripening', 'lista para cosechar': 'ready to harvest' };
  const stage = s => STAGE[String(s).toLowerCase()] || s;
  const NAMES = { 'Pampa de arriba': 'Upper Pampa', 'Ladera de abajo': 'Lower Slope' };
  const name = s => { s = String(s); if (NAMES[s]) return NAMES[s]; const m = s.match(/^Parcela (\d+)$/); return m ? 'Field ' + m[1] : s; };
  const ZONE = { quechua: 'Quechua', suni: 'Suni', puna: 'Puna' };
  const zone = s => ZONE[String(s).toLowerCase()] || s;
  const SOILST = { 'más seca de lo normal': 'drier than normal', 'más húmeda de lo normal': 'wetter than normal', 'con humedad normal': 'at normal moisture' };
  const soilSt = s => SOILST[s] || s;
  const STRAT = { 'seguir como ahora': 'keep as now', 'cuidar el suelo': 'protect the soil', 'menos agua, más venta': 'less water, more sales' };
  const strat = s => STRAT[String(s).toLowerCase()] || s;
  const LVL = { bajo: 'low', medio: 'medium', alto: 'high', baja: 'low', media: 'medium', alta: 'high' };
  const lvl = s => LVL[String(s).toLowerCase()] || s;
  const TEX = { arenoso: 'sandy', arcilloso: 'clay', franco: 'loam' };
  const MON = { enero: 'January', febrero: 'February', marzo: 'March', abril: 'April', mayo: 'May', junio: 'June', julio: 'July', agosto: 'August', setiembre: 'September', septiembre: 'September', octubre: 'October', noviembre: 'November', diciembre: 'December' };
  const MAB = { ene: 'Jan', feb: 'Feb', mar: 'Mar', abr: 'Apr', may: 'May', jun: 'Jun', jul: 'Jul', ago: 'Aug', set: 'Sep', sep: 'Sep', oct: 'Oct', nov: 'Nov', dic: 'Dec' };
  const DAY = { domingo: 'Sunday', lunes: 'Monday', martes: 'Tuesday', 'miércoles': 'Wednesday', miercoles: 'Wednesday', jueves: 'Thursday', viernes: 'Friday', 'sábado': 'Saturday', sabado: 'Saturday' };
  const date = s => String(s).replace(/[A-Za-zÁÉÍÓÚáéíóúñ]+/g, w => { const l = w.toLowerCase(); return MON[l] || DAY[l] || MAB[l] || (l === 'al' ? 'to' : w); });
  const DATEW = '(?:' + Object.keys(MON).concat(Object.keys(MAB), Object.keys(DAY)).join('|') + ')';
  const pct = s => String(s).replace(/ %/g, '%');

  /* ---------- Frases fijas ---------- */
  const EX = {
    // Generales y mapa
    'Yachiraq, Rotaciones para cada parcela': 'Yachiraq, Crop rotations for every field',
    'Rotaciones que cuidan tu suelo y tu agua': 'Crop rotations that protect your soil and water',
    'Creado por': 'Created by',
    'Yachiraq, mis parcelas': 'Yachiraq, my fields',
    'Mapa 3D de Chiara': '3D map of Chiara',
    'El mapa 3D necesita internet': 'The 3D map needs an internet connection',
    'Conéctate para ver Chiara con imagen satelital y relieve real. La app sigue funcionando.': 'Connect to see Chiara with satellite imagery and real terrain. The rest of the app keeps working.',
    'Deshacer': 'Undo', 'Listo': 'Done', 'Cancelar': 'Cancel', 'Volver': 'Back', 'Elegir': 'Choose', 'Ver': 'View', 'Activar': 'Turn on',
    'Zona del piloto: Chiara (aprox.)': 'Pilot area: Chiara (approx.)',
    'Agregar un punto aquí': 'Add a point here',
    'Imagen © Esri, Maxar, Earthstar Geographics': 'Imagery © Esri, Maxar, Earthstar Geographics',
    'Relieve: SRTM/NASADEM (NASA) vía AWS Terrain Tiles': 'Terrain: SRTM/NASADEM (NASA) via AWS Terrain Tiles',
    'Chiara, Ayacucho, relieve real 3D': 'Chiara, Ayacucho, real 3D terrain',
    'Tus parcelas, toca una para abrirla': 'Your fields: tap one to open it',
    'Chiara, relieve real 3D': 'Chiara, real 3D terrain',
    'Estás aquí': 'You are here',
    'Busca tu parcela: arrastra y acerca el mapa': 'Find your field: drag and zoom the map',
    'Arrastra los puntos para ajustar. El «+» agrega un punto': 'Drag the points to adjust. The «+» adds a point',
    'Tu parcela en el tiempo': 'Your field over time',
    'Piso de altura': 'Altitude zone',
    'Escuchar': 'Listen', 'Invitado': 'Guest',
    'Ubicar': 'Locate', 'Preguntas': 'Questions',
    'Perfil de altura de Chiara con tus parcelas': 'Elevation profile of Chiara with your fields',
    'Chiara (pueblo)': 'Chiara (town)',
    // Cultivos (etiquetas)
    'Papa': 'Potato', 'Papa nativa': 'Native potato', 'Maíz': 'Maize', 'Haba': 'Fava bean', 'Quinua': 'Quinoa',
    'Tarwi': 'Tarwi (lupin)', 'Cebada': 'Barley', 'Avena': 'Oats', 'Avena + vicia': 'Oats + vetch', 'Oca': 'Oca (tuber)',
    'Pastos': 'Pasture', 'Descanso': 'Fallow', 'Maíz con haba': 'Maize with fava beans', 'Avena forrajera': 'Forage oats',
    'Nada (descanso)': 'Nothing (fallow)', 'En descanso': 'Fallow',
    // Etapas
    'Brotando': 'Sprouting', 'Creciendo': 'Growing', 'Floreciendo': 'Flowering', 'Madurando': 'Ripening', 'Lista para cosechar': 'Ready to harvest',
    'Brota': 'Sprout', 'Crece': 'Grow', 'Florece': 'Flower', 'Madura': 'Ripen', 'Hoy': 'Today',
    'etapa sensible a la helada': 'frost-sensitive stage',
    // Meses (botones y gráfico)
    'Ene': 'Jan', 'Abr': 'Apr', 'Ago': 'Aug', 'Set': 'Sep', 'Dic': 'Dec',
    // Pisos
    'hasta 3,500 m': 'up to 3,500 m', 'más de 4,000 m': 'above 4,000 m',
    'Valle templado: maíz, haba, papa y quinua crecen bien.': 'Temperate valley: maize, fava beans, potatoes and quinoa grow well.',
    'Zona fría: papa nativa, oca, quinua, tarwi y cebada.': 'Cold zone: native potatoes, oca, quinoa, tarwi and barley.',
    'Muy fría: pastos, papa amarga y ganado.': 'Very cold: pasture, bitter potatoes and livestock.',
    // Inicio
    'Piloto en Chiara, Ayacucho': 'Pilot in Chiara, Ayacucho',
    'Decide qué sembrar los próximos 3 años, cuidando tu suelo y tu agua': 'Decide what to plant over the next 3 years while protecting your soil and water',
    'Yachiraq compara rotaciones para cada parcela con datos de satélites de la NASA, y te avisa antes de una helada o lluvia fuerte.': 'Yachiraq compares crop rotations for each field using NASA satellite data, and warns you before a frost or heavy rain.',
    'Por ahora funciona solo para parcelas del distrito de Chiara.': 'For now it only works for fields in the Chiara district.',
    'Marca tus parcelas': 'Map your fields', 'Compara 3 rotaciones': 'Compare 3 rotations', 'Te avisamos de heladas': 'Get frost alerts',
    'Cómo funciona': 'How it works', 'Datos de la NASA y cómo decidimos': 'NASA data and how we decide',
    '¿Cómo te llamas?': 'What is your name?', 'Para saludarte. No necesitas cuenta.': 'So we can greet you. No account needed.',
    'Ej. Rosa': 'e.g. Rosa', 'Empezar': 'Get started',
    // Mis parcelas
    'Mis parcelas': 'My fields', 'Todavía no tienes parcelas': 'You have no fields yet',
    'Puedes tener varias: para tu casa o para vender, a distinta altura.': 'You can add several: for your household or for sale, at different altitudes.',
    'Ver el ejemplo de Doña Rosa': "See Doña Rosa's example", '2 parcelas en Chiara, a distinta altura': '2 fields in Chiara, at different altitudes',
    'Agregar mi primera parcela': 'Add my first field', 'Agregar parcela': 'Add field',
    'Parcela anterior': 'Previous field', 'Parcela siguiente': 'Next field',
    'Sin alertas esta semana': 'No alerts this week', 'Sin alertas esta semana.': 'No alerts this week.',
    'Alertas de esta semana': "This week's alerts",
    'Alertas por WhatsApp activas': 'WhatsApp alerts on', 'Recibir alertas por WhatsApp': 'Get alerts on WhatsApp',
    'Te avisamos antes de la helada, sin abrir la app': 'We warn you before a frost, without opening the app',
    // Ubicar y dibujar
    'Vamos a ubicar tu parcela. ¿Cómo prefieres hacerlo?': "Let's find your field. How would you like to do it?",
    'Nueva parcela, paso 1 de 2': 'New field, step 1 of 2', 'Nueva parcela, paso 2 de 2': 'New field, step 2 of 2',
    '¿Dónde está tu parcela?': 'Where is your field?',
    'Este es el relieve real de Chiara. Puedes girarlo y acercarlo.': "This is Chiara's real terrain. You can rotate and zoom it.",
    'Estoy en mi parcela': 'I am at my field', 'Uso la ubicación de mi celular y acerco el mapa': "Use my phone's location and zoom in",
    'Buscarla y dibujarla': 'Find it and draw it', 'Muevo el mapa y toco sus esquinas': 'Move the map and tap its corners',
    'Editar parcela': 'Edit field', 'Ajusta la forma': 'Adjust the shape', 'Dibuja tu parcela': 'Draw your field',
    'Puntos': 'Points', 'Tamaño': 'Size', 'Quitar punto': 'Remove point',
    'Esta parcela está fuera de Chiara.': 'This field is outside Chiara.',
    'Yachiraq solo tiene datos de cultivos y clima de Chiara, así que no podemos recomendarte una rotación aquí. Dibuja tu parcela dentro de la zona del piloto (la línea blanca del mapa).': "Yachiraq only has crop and climate data for Chiara, so we can't recommend a rotation here. Draw your field inside the pilot area (the white line on the map).",
    'Acerca el mapa con dos dedos o la rueda del mouse. Toca un punto para seleccionarlo.': 'Zoom in with two fingers or the mouse wheel. Tap a point to select it.',
    'Borrar todo': 'Clear all', 'Guardar forma': 'Save shape', 'Listo, siguiente': 'Done, next',
    'Midiendo tu parcela con los satélites de la NASA…': 'Measuring your field with NASA satellites…',
    'Tamaño de la parcela': 'Field size', 'Altura y piso (SRTM)': 'Altitude and zone (SRTM)',
    'Pendiente del terreno': 'Slope of the land', 'Clima del lugar (NASA POWER)': 'Local climate (NASA POWER)',
    // Preguntas
    'medido con SRTM': 'measured with SRTM', 'medida aproximada': 'approximate measurement',
    'Editar respuestas': 'Edit answers', 'Cuéntanos de esta parcela': 'Tell us about this field',
    'Nombre de la parcela': 'Field name', 'Ej. Ladera de abajo': 'e.g. Lower slope',
    '¿Qué tienes sembrado ahora?': 'What is planted right now?',
    'Elige varios si siembras juntos, por ejemplo maíz con haba': 'Pick several if you intercrop, for example maize with fava beans',
    '¿En qué mes lo sembraste?': 'Which month did you plant it?', 'Con esto sabemos en qué etapa está hoy': 'This tells us which growth stage it is in today',
    '¿Qué cosechaste antes en esta parcela?': 'What did you harvest before in this field?',
    'Lo último que sacaste antes de lo que tienes ahora. Puedes elegir varios': 'The last crop you harvested before the current one. You can pick several',
    '¿Qué piensas sembrar después?': 'What do you plan to plant next?',
    'Opcional. Te diremos si es buena idea para esta parcela': "Optional. We'll tell you if it's a good idea for this field",
    'Quitar, todavía no sé': "Clear it, I'm not sure yet", 'Todavía no sé': "I'm not sure yet",
    '¿Para qué es esta parcela?': 'What is this field for?', 'Mi casa': 'My household', 'Vender': 'Selling', 'Las dos': 'Both',
    '¿Tiene riego?': 'Is it irrigated?', 'Solo lluvia': 'Rain-fed only', 'Tiene riego': 'Irrigated',
    '¿Tienes animales que coman de aquí?': 'Do your animals graze here?', 'Sí': 'Yes', 'No': 'No',
    'Guardar parcela': 'Save field',
    'qué tienes sembrado': 'what is planted', 'el mes de siembra': 'the planting month', 'qué cosechaste antes': 'what you harvested before',
    // Cómo funciona
    'En vivo': 'Live', 'en vivo': 'live', 'Valor de referencia': 'Reference value', 'Medido en tu parcela': 'Measured on your field', 'Aproximado': 'Approximate',
    'Calculado en Earth Engine': 'Computed in Earth Engine', 'Ejemplo': 'Example', 'Valor típico': 'Typical value', 'Pronóstico': 'Forecast',
    'Altura y pendiente del terreno.': 'Elevation and slope of the land.',
    'Temperatura, lluvia y humedad, promedio de más de 30 años.': 'Temperature, rainfall and humidity, averaged over 30+ years.',
    'Lluvia caída en los últimos 30 días.': 'Rainfall over the last 30 days.',
    'Humedad del suelo.': 'Soil moisture.',
    'Verdor de la vegetación cada 16 días.': 'Vegetation greenness every 16 days.',
    'Materia orgánica, textura y pH del suelo.': 'Soil organic matter, texture and pH.',
    'Temperatura mínima y lluvia de los próximos 7 días.': 'Minimum temperature and rainfall for the next 7 days.',
    'Para: piso de altura (quechua, suni, puna) y riesgo de erosión.': 'Used for: altitude zone (Quechua, Suni, Puna) and erosion risk.',
    'Para: noches de helada por mes y meses de lluvia fuerte.': 'Used for: frost nights per month and heavy-rain months.',
    'Para: si este año está más seco que lo normal.': 'Used for: whether this year is drier than normal.',
    'Para: si el suelo está más seco que lo normal.': 'Used for: whether the soil is drier than normal.',
    'Para: si los cultivos y pastos están estresados.': 'Used for: whether crops and pastures are stressed.',
    'Para: cuánto necesita tu suelo leguminosas y cobertura.': 'Used for: how much your soil needs legumes and ground cover.',
    'Para: alertas de helada y lluvia fuerte.': 'Used for: frost and heavy-rain alerts.',
    'De los satélites a tu parcela': 'From satellites to your field',
    'Yachiraq junta datos de satélites de la NASA con lo que tú nos cuentas de tu parcela, y compara rotaciones con reglas claras que puedes revisar.': 'Yachiraq combines NASA satellite data with what you tell us about your field, and compares rotations using clear rules you can check.',
    'Datos que usamos': 'Data we use', 'Tamaño del cuadro que mide cada satélite': 'Grid-cell size of each dataset',
    'Datos de distinto tamaño, una sola escala': 'Different resolutions, one common scale',
    'Satélite y estación en tierra': 'Satellite vs. ground station',
    'Una estación mide el punto exacto donde está, pero en la sierra hay pocas y lejos. El satélite mide todos los lugares, pero da el promedio de un cuadro y a veces lo tapan las nubes. Lo mejor es juntarlos: el satélite para ver el patrón y la estación del SENAMHI o lo que observa el agricultor para confirmarlo.': "A weather station measures the exact spot where it stands, but in the highlands there are few of them and they are far apart. A satellite measures everywhere, but gives the average of a grid cell and is sometimes blocked by clouds. The best approach is to combine them: the satellite to see the pattern, and the SENAMHI station or the farmer's own observations to confirm it.",
    'Los valores de referencia local deben validarse con la estación del SENAMHI más cercana.': 'Local reference values should be validated against the nearest SENAMHI weather station.',
    'Cómo comparamos las rotaciones': 'How we compare rotations',
    'Armamos 3 rotaciones de 3 años:': 'We build three 3-year rotations:',
    'la que ya haces, una para cuidar el suelo y otra para ahorrar agua y vender.': 'the one you already follow, one to protect the soil, and one to save water and sell.',
    'Simulamos 36 meses, mes por mes:': 'We simulate 36 months, month by month:',
    'cuándo se siembra y cosecha cada cultivo según su época, y qué meses queda el suelo descubierto.': 'when each crop is planted and harvested according to its season, and which months the soil is left bare.',
    'Cruzamos con tu clima y tu tierra:': 'We cross-check with your climate and land:',
    'si florece con helada, si pide más agua de la que llueve, si deja la tierra descubierta cuando llueve fuerte en una ladera.': 'whether it would flower during frost, whether it needs more water than the rain provides, and whether it leaves a slope bare during heavy rain.',
    'Damos puntos por criterio': 'We score each criterion',
    '(suelo, erosión, agua, frío, plagas, venta, forraje). Lo que tú eliges como importante pesa más.': '(soil, erosion, water, cold, pests, sales, forage). What you mark as important counts more.',
    '¿Por qué reglas y no inteligencia artificial?': 'Why rules and not artificial intelligence?',
    'No hay todavía datos de cosechas de Chiara para entrenar un modelo. Un modelo de IA entrenado con otras regiones podría equivocarse aquí sin que nadie lo note. Las reglas se pueden leer, discutir y corregir con los técnicos y los agricultores. Cuando haya datos de campo (rendimientos, análisis de suelo), se pueden usar para calibrar los puntos o entrenar un modelo, comparándolo siempre con estas reglas.': "There is no harvest data from Chiara yet to train a model. An AI model trained on other regions could be wrong here without anyone noticing. Rules can be read, discussed and corrected with extension agents and farmers. Once field data exists (yields, soil tests), it can be used to calibrate the scores or train a model, always comparing it against these rules.",
    '¿Qué tan seguros estamos?': 'How confident are we?',
    'Cada rotación muestra su nivel de confianza según cuántas fuentes llegaron en vivo. Los datos de cultivos (cuánto tardan, cuánta agua piden) son referencias generales de la FAO y el INIA, y deben validarse con variedades locales. Lo que no sabemos, como el precio de venta o la semilla disponible, lo decimos en cada rotación.': "Each rotation shows its confidence level based on how many sources loaded live. Crop data (growing time, water needs) are general references from FAO and INIA (Peru's agricultural research institute) and must be validated with local varieties. What we don't know, such as selling prices or seed availability, is stated for each rotation.",
    '¿Dónde funciona?': 'Where does it work?',
    'Los datos de la NASA cubren todo el mundo. Lo que es de Chiara es:': 'NASA data covers the whole world. What is specific to Chiara is:',
    'los cultivos y sus épocas de siembra (calendario de lluvias de la sierra sur);': 'the crops and their planting seasons (rainfall calendar of the southern Peruvian highlands);',
    'los pisos de altura quechua, suni y puna;': 'the Quechua, Suni and Puna altitude zones;',
    'la referencia local de temperatura para corregir NASA POWER;': 'the local temperature reference used to correct NASA POWER;',
    'el cálculo de lluvia y humedad del suelo en Earth Engine.': 'the rainfall and soil-moisture calculation in Earth Engine.',
    'Para llevar Yachiraq a otra zona hay que cambiar esas 4 cosas, de preferencia con técnicos y agricultores del lugar.': 'To bring Yachiraq to another area, those 4 things must be adapted, ideally together with local extension agents and farmers.',
    'Palabras que usamos': 'Glossary',
    'Rotación': 'Rotation', 'Cambiar de cultivo en la misma parcela año tras año. Corta el ciclo de las plagas y cuida el suelo.': 'Changing crops on the same field year after year. It breaks pest cycles and protects the soil.',
    'Leguminosa': 'Legume', 'Plantas como la haba, el tarwi o la vicia. Toman nitrógeno del aire y lo dejan en el suelo como abono natural.': 'Plants such as fava beans, tarwi (Andean lupin) or vetch. They take nitrogen from the air and leave it in the soil as natural fertilizer.',
    'Anomalía': 'Anomaly', 'Cuánto se aleja un dato de lo normal. "−20 % de lluvia" significa que llovió una quinta parte menos que el promedio.': 'How far a value is from normal. "−20% rainfall" means it rained one fifth less than average.',
    'Índice de verdor que se calcula con la luz que reflejan las plantas. Una planta sana y con agua refleja más luz infrarroja.': 'A greenness index calculated from the light that plants reflect. A healthy, well-watered plant reflects more infrared light.',
    'Evapotranspiración': 'Evapotranspiration', 'El agua que sale del suelo y de las plantas hacia el aire. Cuando hace calor y viento, el cultivo pide más agua.': 'Water that moves from the soil and plants into the air. When it is hot and windy, the crop needs more water.',
    'Erosión': 'Erosion', 'Cuando la lluvia arrastra la tierra buena. Pasa más en laderas y con el suelo descubierto.': 'When rain washes away the fertile topsoil. It happens more on slopes and on bare soil.',
    'Helada': 'Frost', 'Noche en que la temperatura baja de 0 °C y puede quemar las hojas y las flores.': 'A night when the temperature drops below 0 °C and can burn leaves and flowers.',
    'Yachiraq no reemplaza tu experiencia.': 'Yachiraq does not replace your experience.',
    'Tú conoces tu tierra y tu comunidad. Usa estas ideas para conversar con tu familia, tu técnico o el INIA antes de decidir.': 'You know your land and your community. Use these ideas to talk with your family, your extension agent or INIA before deciding.',
    'Cómo funciona Yachiraq': 'How Yachiraq works', 'Qué datos de la NASA usamos y cómo decidimos': 'Which NASA data we use and how we decide',
    // Parcela
    'Datos': 'Data',
    'Alerta alta': 'High alert', 'Atención': 'Warning', 'Aviso': 'Notice',
    'Qué hacer': 'What to do', 'Enviarme WhatsApp': 'Send me a WhatsApp', 'Avisar a mi comunidad': 'Alert my community',
    'Ver todo lo que puedo hacer': 'See everything I can do',
    'Te avisaremos por WhatsApp si algo cambia.': "We'll message you on WhatsApp if anything changes.",
    'Tu cultivo hoy': 'Your crop today', 'Puedes planear tu próxima siembra': 'You can plan your next planting',
    'Referencia general, valida con INIA.': 'General reference; confirm with INIA.',
    'Lo que ven los satélites este mes': 'What satellites see this month',
    'de madrugada': 'before dawn',
    'No tienes cultivo ahora: protege tus almácigos y animales.': 'You have no crop right now: protect your seedbeds and animals.',
    'Riega ligero en la tarde: la tierra húmeda guarda el calor de noche.': 'Water lightly in the afternoon: moist soil holds heat overnight.',
    'Cubre los brotes con paja, rastrojo o mantas viejas antes de que oscurezca.': 'Cover the sprouts with straw, crop residue or old blankets before dark.',
    'Cubre las plantas más débiles y tus almácigos con paja o mantas.': 'Cover the weakest plants and your seedbeds with straw or blankets.',
    'Antes del amanecer, prende humo con rastrojo húmedo a favor del viento, como se hace tradicionalmente.': 'Before dawn, light smudge fires with damp crop residue so the wind carries the smoke over the field, as is traditionally done.',
    'Si ya está madura, adelanta la cosecha antes de la helada.': 'If the crop is already ripe, harvest it before the frost.',
    'Pronóstico Open-Meteo, ajustado a tu altura (SRTM)': 'Open-Meteo forecast, adjusted to your altitude (SRTM)',
    'Pronóstico de ejemplo + ajuste por altura (SRTM)': 'Example forecast + altitude adjustment (SRTM)',
    'Un día de lluvia intensa.': 'A day of intense rain.',
    'Tu parcela es casi plana: revisa que el agua pueda salir.': 'Your field is almost flat: make sure water can drain away.',
    'Limpia zanjas y canales antes de ese día.': 'Clear ditches and channels before that day.',
    'Abre o refuerza surcos en curva de nivel para frenar el agua.': 'Open or reinforce contour furrows to slow the water down.',
    'Abre una salida para que el agua no se empoce.': 'Open an outlet so water does not pool.',
    'No dejes tierra recién removida sin cubrir.': 'Do not leave freshly tilled soil uncovered.',
    'Pronóstico Open-Meteo + pendiente (SRTM)': 'Open-Meteo forecast + slope (SRTM)',
    'Pronóstico de ejemplo + pendiente (SRTM)': 'Example forecast + slope (SRTM)',
    'Buen momento para planear una siembra que necesite poca agua.': 'A good time to plan a crop that needs little water.',
    'Riega temprano en la mañana, cuando se pierde menos agua.': 'Water early in the morning, when less water is lost.',
    'Cubre el suelo con paja o rastrojo para guardar la humedad.': 'Cover the soil with straw or crop residue to keep it moist.',
    'Para tu próxima siembra, prefiere cultivos de poca agua: quinua, tarwi o cebada.': 'For your next planting, choose low-water crops: quinoa, tarwi or barley.',
    'Revisa la pestaña Siembra: ya ajustamos las opciones a este año más seco.': 'Check the Rotation tab: we already adjusted the options for this drier year.',
    'GPM IMERG (lluvia) + SMAP (humedad del suelo)': 'GPM IMERG (rainfall) + SMAP (soil moisture)',
    'Se acerca el tiempo de cosecha.': 'Harvest time is approaching.',
    'Prepara sacos y espacio seco para guardar.': 'Get sacks and a dry storage space ready.',
    'Si se anuncia helada, adelanta la cosecha.': 'If frost is forecast, harvest early.',
    'Calendario de tu cultivo': 'Your crop calendar',
    'Pronóstico: Open-Meteo, actualizado hoy.': 'Forecast: Open-Meteo, updated today.',
    'Sin conexión al pronóstico: se muestran valores de ejemplo.': 'No connection to the forecast: showing example values.',
    'Anomalía de lluvia y suelo: valores de ejemplo hasta correr el script de Earth Engine.': 'Rainfall and soil anomaly: example values until the Earth Engine script is run.',
    // WhatsApp
    'Alertas por WhatsApp': 'WhatsApp alerts', 'Vista previa': 'Preview', 'Enviado a ti': 'Sent to you',
    'Mi número': 'My number', 'Código de país': 'Country code',
    'Te llega por WhatsApp, sin abrir la app. Los mensajes van sin tildes para que lleguen bien.': 'It arrives on WhatsApp, with no need to open the app. Messages are sent without accents so they display correctly on any phone.',
    'Contactos que también reciben alertas': 'Contacts who also get alerts',
    'Tu familia, un vecino o el presidente de tu comunidad': 'Your family, a neighbor or your community president',
    'Todavía no agregas contactos.': 'You have not added any contacts yet.',
    'Nombre': 'Name', 'Celular': 'Mobile', 'Nombre del contacto': "Contact's name", 'Celular del contacto': "Contact's mobile", 'Relación': 'Relationship',
    'Familia': 'Family', 'Vecino': 'Neighbor', 'Comunidad': 'Community', 'Agregar contacto': 'Add contact',
    'Juan (hijo)': 'Juan (son)', 'Presidente comunal': 'Community president',
    // Rotación
    '¿Qué te importa más?': 'What matters most to you?', 'Elige hasta 2': 'Pick up to 2',
    'Cuidar el suelo': 'Protect the soil', 'Ahorrar agua': 'Save water', 'Vender más': 'Sell more', 'Forraje': 'Forage', 'Menos helada': 'Less frost risk',
    'Comparación': 'Comparison', 'Más puntos verdes = mejor. ★ = lo que elegiste': 'More green dots = better. ★ = what you chose',
    'Seguir como ahora': 'Keep as now', 'Menos agua, más venta': 'Less water, more sales',
    'Abona el suelo': 'Builds soil fertility', 'Protege de la erosión': 'Protects against erosion', 'Pide poca agua': 'Needs little water',
    'Aguanta el frío': 'Tolerates cold', 'Corta plagas': 'Breaks pest cycles', 'Para vender': 'For sale',
    'Meses sin cubrir': 'Months with bare soil', 'Para ti': 'Your score',
    'Bajo': 'Low', 'Medio': 'Medium', 'Alto': 'High', 'Baja': 'Low', 'Media': 'Medium', 'Alta': 'High', 'Poca': 'Low', 'Mucha': 'High',
    'Tu rotación actual': 'Your current rotation', 'Alternativa': 'Alternative', 'Mejor para ti': 'Best for you',
    'Avena con vicia cubre el suelo y lo abona; la papa nativa aprovecha ese abono; los pastos dejan la tierra descansar cubierta.': 'Oats with vetch cover and enrich the soil; native potatoes make use of that fertility; pasture lets the land rest while staying covered.',
    'Pastos y forraje piden poca agua y aguantan la helada de la puna.': 'Pasture and forage crops need little water and withstand the Puna frost.',
    'Quinua y tarwi piden poca agua y se venden bien; la cebada aguanta helada y deja paja para los animales.': 'Quinoa and tarwi need little water and sell well; barley withstands frost and leaves straw for the animals.',
    'Línea de tiempo de 36 meses: cultivos y meses con el suelo descubierto': '36-month timeline: crops and months with bare soil',
    'Suelo descubierto': 'Bare soil', 'Mes de lluvia fuerte': 'Heavy-rain month',
    'Leguminosas': 'Legumes', 'Agua': 'Water',
    'Por qué, en qué datos se basa y qué revisar': 'Why, what data it is based on, and what to check',
    'Beneficios': 'Benefits', 'Riesgos': 'Risks', 'En qué datos se basa': 'Data it is based on', 'Lo que no sabemos': 'What we do not know',
    'Revisa con un técnico o tu comunidad': 'Check with an extension agent or your community',
    'Aguanta bien las heladas.': 'Withstands frost well.',
    'Tubérculo después de tubérculo: más riesgo de gorgojo de los Andes.': 'Tuber after tuber: higher risk of Andean potato weevil.',
    'Devuelve abono natural (nitrógeno) a tu suelo.': 'Returns natural fertilizer (nitrogen) to your soil.',
    'Aprovecha el abono que dejó la leguminosa que sembraste antes.': 'Makes use of the nitrogen left by the legume you planted before.',
    'Necesita poca agua: buena opción si sigue seco.': 'Needs little water: a good option if it stays dry.',
    'Da forraje para tus animales.': 'Provides forage for your animals.',
    'Tiene mercado para vender.': 'Has a market for selling.',
    'Precio de venta de este año y acceso al mercado.': "This year's selling price and market access.",
    'Variedad de semilla disponible en Chiara.': 'Seed varieties available in Chiara.',
    'El suelo viene de un mapa mundial de 250 m, no de un análisis de tu parcela.': 'Soil data comes from a 250 m global map, not from a test of your field.',
    'La anomalía de lluvia y suelo es de ejemplo hasta correr el script de Earth Engine.': 'The rainfall and soil anomaly is an example until the Earth Engine script is run.',
    'El verdor (NDVI) es de ejemplo: sin conexión con MODIS.': 'Greenness (NDVI) is an example value: no connection to MODIS.',
    'Fecha exacta de siembra para tu variedad (INIA o tu técnico).': 'Exact planting date for your variety (INIA or your extension agent).',
    'El tarwi necesita desamargado antes de comerlo o venderlo.': 'Tarwi must be debittered (soaked and rinsed) before eating or selling it.',
    'Gorgojo de los Andes: revisa si hubo ataque en tu zona.': 'Andean potato weevil: check whether there were outbreaks in your area.',
    'Confirma que tienes comprador para la quinua o el tarwi antes de sembrar más.': 'Make sure you have a buyer for quinoa or tarwi before planting more.',
    'Elegiste esta rotación': 'You chose this rotation', 'Elegir esta rotación': 'Choose this rotation',
    'Esto es una ayuda, no una orden.': 'This is guidance, not an order.',
    'Tú conoces tu tierra. Antes de cambiar tu rotación, conversa con tu técnico, el INIA o tu comunidad.': 'You know your land. Before changing your rotation, talk with your extension agent, INIA or your community.',
    'Cómo calculamos esto': 'How we calculate this',
    'Tu próxima siembra': 'Your next planting', 'Te diré si es buena idea y cuándo': "I'll tell you if it's a good idea, and when",
    'Todavía no sé, recomiéndame': "I'm not sure yet, recommend something",
    'Tu idea': 'Your idea', 'No recomendado': 'Not recommended', 'Con cuidado': 'With caution', 'Bien': 'Good',
    'Cambiar mi idea': 'Change my idea',
    'Lo que mejor encaja en esta parcela, según la fecha de hoy, el clima de este año y lo que sembraste antes.': "What fits this field best, based on today's date, this year's climate and what you planted before.",
    'Otras buenas opciones': 'Other good options', 'Mejores opciones para esta parcela': 'Better options for this field', 'Lo que mejor encaja': 'Best fit',
    'Puedes sembrar ya': 'You can plant now',
    'Tus campañas': 'Your growing seasons', 'Ahora': 'Now', 'Recomendado': 'Recommended', 'Después': 'After that', 'Próxima': 'Next',
    'Cómo sembrarlos juntos:': 'How to intercrop them:', 'Valida con INIA.': 'Confirm with INIA.',
    'Siembra 1 surco de haba cada 2 surcos de maíz, o alterna golpes de maíz y haba en el mismo surco. La haba fija nitrógeno que aprovecha el maíz y su sombra ayuda a guardar humedad.': 'Plant 1 row of fava beans for every 2 rows of maize, or alternate maize and fava bean planting holes in the same row. Fava beans fix nitrogen that the maize uses, and their shade helps retain moisture.',
    'Mezcla la semilla: más o menos 3 partes de avena por 1 de vicia. La avena sirve de tutor a la vicia y juntas dan más forraje y abonan el suelo.': 'Mix the seed: roughly 3 parts oats to 1 part vetch. The oats support the climbing vetch, and together they produce more forage and enrich the soil.',
    'Tiempos de referencia general. Confirma la variedad con INIA o tu técnico.': 'General reference timings. Confirm the variety with INIA or your extension agent.',
    'Revisa con un técnico:': 'Check with an extension agent:', 'qué sembrar en esta parcela.': 'what to plant in this field.',
    'Enviar este plan a mi técnico': 'Send this plan to my extension agent',
    // Datos
    'Pendiente': 'Slope', 'Altura y pendiente: SRTM (NASA)': 'Altitude and slope: SRTM (NASA)', 'Medida aproximada': 'Approximate measurement',
    'Lo que tienes sembrado': 'What is planted now', 'perenne': 'perennial',
    'Tu suelo': 'Your soil', 'Primeros 15 cm, de un mapa mundial de suelos': 'Top 15 cm, from a global soil map',
    'Materia orgánica': 'Organic matter', 'Textura': 'Texture', 'Arenoso': 'Sandy', 'Arcilloso': 'Clay', 'Franco': 'Loam',
    'Tu suelo tiene poca materia orgánica: conviene rotar con leguminosas (haba, tarwi) y dejar rastrojo o abono.': 'Your soil is low in organic matter: rotate with legumes (fava beans, tarwi) and leave crop residue or manure.',
    'Materia orgánica media: las leguminosas y la avena con vicia ayudan a mantenerla.': 'Medium organic matter: legumes and oats with vetch help maintain it.',
    'Buena materia orgánica: cuídala evitando dejar el suelo descubierto en lluvias.': 'Good organic matter: protect it by not leaving the soil bare during the rains.',
    'valor típico de la zona': 'typical value for the area', 'valores de referencia': 'reference values', 'valores de ejemplo': 'example values', 'valor de ejemplo': 'example value', 'cargando…': 'loading…', 'ejemplo': 'example',
    'Es una estimación. Un análisis de suelo del INIA o la agencia agraria es más exacto.': 'This is an estimate. A soil test from INIA or the local agriculture agency is more accurate.',
    'El clima de tu parcela en el año': "Your field's climate through the year",
    'Promedio de muchos años, ajustado a tu altura. El mes actual está marcado': 'Long-term average, adjusted to your altitude. The current month is highlighted',
    'Lluvia, temperatura mínima y máxima, y humedad por mes': 'Monthly rainfall, minimum and maximum temperature, and humidity',
    'bajo 0 °C = helada': 'below 0 °C = frost',
    'Temp. máxima': 'Max temp.', 'Temp. mínima': 'Min temp.', 'Lluvia': 'Rainfall', '% Humedad': '% Humidity',
    'Noches de helada': 'Frost nights', 'Más frío': 'Coldest',
    '¿De dónde salen estos datos?': 'Where does this data come from?',
    'Temperatura, lluvia y humedad relativa son el promedio de muchos años de NASA POWER.': 'Temperature, rainfall and relative humidity are long-term averages from NASA POWER.',
    'Como su medición cubre una zona grande, ajustamos la temperatura a la altura exacta de tu parcela: cada 100 m más arriba, unos 0,65 °C más frío.': "Because each measurement covers a large area, we adjust the temperature to your field's exact altitude: about 0.65 °C colder for every 100 m higher.",
    'Editar forma': 'Edit shape', 'Toca otra vez para eliminar esta parcela': 'Tap again to delete this field', 'Eliminar parcela': 'Delete field',
    // Avisos (toasts)
    'Tu equipo no tiene GPS. Busca tu parcela en el mapa.': 'Your device has no GPS. Find your field on the map.',
    'Buscando tu ubicación…': 'Finding your location…',
    'Yachiraq por ahora funciona solo en Chiara: te llevamos al centro del distrito.': 'For now Yachiraq only works in Chiara: taking you to the center of the district.',
    'No pudimos usar tu ubicación. Búscala en el mapa.': "We couldn't use your location. Find it on the map.",
    'Sin mapa no se puede dibujar. Prueba el ejemplo de Doña Rosa.': "You can't draw without the map. Try Doña Rosa's example.",
    'Esta parcela está fuera de Chiara. Muévela dentro de la zona del piloto.': 'This field is outside Chiara. Move it inside the pilot area.',
    'Forma guardada. Volvimos a medir tu parcela.': 'Shape saved. We measured your field again.',
    'Respuestas guardadas': 'Answers saved', 'Parcela guardada': 'Field saved', 'Parcela eliminada': 'Field deleted',
    'Escribe el nombre del contacto.': "Enter the contact's name.", 'El celular debe tener 9 dígitos.': 'The mobile number must have 9 digits.',
    'Plan copiado. Pégalo en WhatsApp para tu técnico.': 'Plan copied. Paste it into WhatsApp for your extension agent.',
    'Plan listo para enviar.': 'Plan ready to send.', 'Mi plan Yachiraq': 'My Yachiraq plan',
    'Alertas por WhatsApp activadas': 'WhatsApp alerts turned on', 'Alertas por WhatsApp apagadas': 'WhatsApp alerts turned off',
    '¡Bien! Marcado como hecho': 'Great! Marked as done',
    'Escribe tu número de celular (9 dígitos) abajo.': 'Enter your mobile number (9 digits) below.',
    'Agrega contactos de tu comunidad abajo.': 'Add contacts from your community below.',
    'No se pudo enviar. Revisa la conexión.': "Couldn't send. Check your connection.",
    'Así llegará a tu celular.': 'This is how it will look on your phone.',
    'Tu navegador no puede leer en voz alta.': "Your browser can't read aloud.",
    'Este número no está habilitado en la demo': 'This number is not enabled for the demo',
    'Demasiados envíos seguidos. Espera un minuto.': 'Too many messages in a row. Wait a minute.',
    'Sin conexión': 'No connection', 'Revisa la configuración.': 'Check the configuration.',
    'Número no válido. Usa 9 dígitos que empiecen con 9.': 'Invalid number. Use 9 digits starting with 9.',
    'descanso': 'fallow', 'por definir': 'to be decided',
    // Tour corto para dibujar la parcela
    'Paso 1 de 2': 'Step 1 of 2', 'Paso 2 de 2': 'Step 2 of 2',
    'Toca en el mapa cada esquina de tu parcela.': 'Tap each corner of your field on the map.',
    'Una por una, dando la vuelta.': 'One at a time, all the way around.',
    'Cuando termines, toca aquí.': 'When you finish, tap here.',
    'Si un punto quedó mal, arrástralo.': 'If a point is off, drag it.',
    'Saltar': 'Skip', 'Entendido': 'Got it', '¿Cómo dibujo?': 'How do I draw?',
    // Menú de perfil
    'Mi perfil': 'My profile', 'Datos guardados solo en este celular': 'Data saved only on this phone',
    'Cambiar nombre': 'Change name', 'Tu nombre': 'Your name', 'Guardar': 'Save', 'Salir': 'Log out',
    'Toca otra vez para salir': 'Tap again to log out',
    'Se borrarán tus parcelas, tu número y tus contactos de este celular.': 'Your fields, phone number and contacts will be deleted from this phone.',
    'Saliste. Tus datos se borraron de este celular.': 'You logged out. Your data was deleted from this phone.',
    'Escribe un nombre.': 'Enter a name.', 'Nombre actualizado': 'Name updated'
  };
  for (const k of Object.keys(NAMES)) EX[k] = NAMES[k];
  const EXL = {};
  for (const k of Object.keys(EX)) EXL[k.toLowerCase()] = EX[k];

  /* ---------- Frases con datos (números, fechas, cultivos) ---------- */
  const P = (re, fn) => [re, fn];
  const PAT = [
    // Mensajes de WhatsApp (van sin tildes)
    P(/^YACHIRAQ: Helada el (.+?) \((-?\d+)C\) en (.+?)\.(?: Tu (.+) esta sensible\.)? Cubre con paja y prende humo antes del amanecer\.$/,
      (d, t, n, c) => `YACHIRAQ: Frost on ${date(d)} (${t}C) at ${name(n)}.${c ? ' ' + up(yourCrop(c)) + ' is at a sensitive stage.' : ''} Cover crops with straw and light smudge fires before dawn.`),
    P(/^YACHIRAQ: Aviso para la comunidad de Chiara\. Helada el (.+?) hasta (-?\d+)C en las partes altas\. Protejamos almacigos y chacras esa noche\.$/,
      (d, t) => `YACHIRAQ: Notice for the Chiara community. Frost on ${date(d)}, down to ${t}C in the upper areas. Let's protect seedbeds and fields that night.`),
    P(/^YACHIRAQ: Lluvia fuerte el (.+?) \((\d+)mm\) en (.+?)\. Limpia zanjas y canales para que no se lave la tierra\.$/,
      (d, mm, n) => `YACHIRAQ: Heavy rain on ${date(d)} (${mm}mm) at ${name(n)}. Clear ditches and channels so the soil does not wash away.`),
    P(/^YACHIRAQ: Aviso para la comunidad de Chiara\. Lluvia fuerte el (.+?)\. Limpiemos juntos canales y zanjas comunales\.$/,
      d => `YACHIRAQ: Notice for the Chiara community. Heavy rain on ${date(d)}. Let's clear the communal channels and ditches together.`),
    P(/^YACHIRAQ: Este mes llovio (\d+)% menos de lo normal en (.+?)\. Cubre el suelo con paja para guardar humedad\.$/,
      (p, n) => `YACHIRAQ: This month it rained ${p}% less than normal at ${name(n)}. Cover the soil with straw to keep it moist.`),
    P(/^YACHIRAQ: Aviso para la comunidad de Chiara\. Este mes llovio (\d+)% menos de lo normal\. Cuidemos el agua de riego\.$/,
      p => `YACHIRAQ: Notice for the Chiara community. This month it rained ${p}% less than normal. Let's use irrigation water carefully.`),
    P(/^YACHIRAQ: Se acerca la cosecha de (.+?) en (.+?)\.$/, (c, n) => `YACHIRAQ: Harvest time for ${crop(c)} is coming at ${name(n)}.`),
    P(/^YACHIRAQ: Sin alertas esta semana en (.+?)\.$/, n => `YACHIRAQ: No alerts this week at ${name(n)}.`),
    // Plan para compartir
    P(/^Plan Yachiraq, (.+) \((.+?), (.+?), piso (\w+)\)\.$/, (n, a, h, z) => `Yachiraq plan, ${name(n)} (${a}, ${h}, ${zone(z)} zone).`),
    P(/^Ahora: (.+?)(?: \((.+)\))?\.$/, (c, s) => `Now: ${c === 'descanso' ? 'fallow' : crop(c)}${s ? ' (' + stage(s) + ')' : ''}.`),
    P(/^Próxima siembra: (.+?) desde (.+)\.$/, (c, d) => `Next planting: ${crop(c)} from ${date(d)}.`),
    P(/^Próxima siembra: por definir\.$/, () => 'Next planting: to be decided.'),
    P(/^Rotación elegida: (.+) \((.+)\)\.$/, (r, s) => `Chosen rotation: ${EX[r] || r} (${list(s)}).`),
    // Mapa y encabezados
    P(/^Toca las esquinas de tu parcela \((\d+) de al menos 3\)$/, n => `Tap the corners of your field (${n} of at least 3)`),
    P(/^(Ahora|Próxima|Después): (.+)$/, (l, c) => `${EX[l]}: ${crop(c)}`),
    P(/^Punto (\d+)$/, n => `Point ${n}`),
    P(/^Punto (\d+) seleccionado$/, n => `Point ${n} selected`),
    P(/^piso (Quechua|Suni|Puna)$/i, z => `${zone(z)} zone`),
    P(/^Hola(?:,? (.+?))?\. Agrega tus parcelas: te mostraré qué rotación cuida mejor tu suelo y te avisaré antes de una helada o lluvia fuerte\.$/,
      u => `Hi${u ? ' ' + u : ''}. Add your fields: I'll show you which rotation best protects your soil and warn you before a frost or heavy rain.`),
    P(/^Hola(?:, (.+))?$/, u => `Hi${u ? ', ' + u : ''}`),
    P(/^(\d+) parcelas?, (.+) en total$/, (n, a) => `${n} ${n === '1' ? 'field' : 'fields'}, ${a} in total`),
    P(/^Este mes llovió (\d+) % menos de lo normal en Chiara$/, p => `This month it rained ${p}% less than normal in Chiara`),
    P(/^Satélites GPM y SMAP, (.+)$/, d => `GPM and SMAP satellites, ${date(d)}`),
    P(/^Ver (.+)$/, n => `View ${name(n)}`),
    P(/^Quitar a (.+)$/, n => `Remove ${n}`),
    P(/^Próxima siembra: ([^,]+), desde (.+)$/, (c, d) => `Next planting: ${crop(c)}, from ${date(d)}`),
    P(/^Próxima siembra: ([^,]+)$/, c => `Next planting: ${crop(c)}`),
    P(/^desde ([^,]+)$/i, d => `from ${date(d)}`),
    P(/^A tu número y (\d+) contactos?$/, n => `To your number and ${n} ${n === '1' ? 'contact' : 'contacts'}`),
    P(/^Piso (Quechua|Suni|Puna)$/, z => `${zone(z)} zone`),
    P(/^pendiente (\d+) %$/, n => `slope ${n}%`),
    P(/^Falta: (.+)$/, s => 'Missing: ' + s.split(', ').map(x => EX[x] || x).join(', ')),
    P(/^En vivo, (.+)$/, d => `Live, ${date(d)}`),
    P(/^Parcela (\d+) de (\d+), piso (\w+), (.+)$/, (i, n, z, h) => `Field ${i} of ${n}, ${zone(z)} zone, ${h}`),
    P(/^Parcela (\d+)$/, n => `Field ${n}`),
    P(/^Alertas(?: \((\d+)\))?$/, n => `Alerts${n ? ' (' + n + ')' : ''}`),
    // Alertas
    P(new RegExp('^(' + DATEW + ') (\\d+)$', 'i'), (d, n) => `${date(d)} ${n}`),
    P(new RegExp('^(' + DATEW + ') (\\d{4})$', 'i'), (m, y) => `${date(m)} ${y}`),
    P(/^Helada: hasta (-?\d+) °C$/, t => `Frost: down to ${t} °C`),
    P(/^Pronóstico ajustado a los (.+) de tu parcela\.$/, h => `Forecast adjusted to your field's altitude of ${h}.`),
    P(/^Tu (.+) está (.+?): es la etapa más sensible al frío\.$/, (c, s) => `${up(yourCrop(c))} is ${stage(s)}: the stage most sensitive to cold.`),
    P(/^Tu (.+) está ([^:]+)\.$/, (c, s) => `${up(yourCrop(c))} is ${stage(s)}.`),
    P(/^Lluvia fuerte: unos (\d+) mm$/, mm => `Heavy rain: about ${mm} mm`),
    P(/^Tu parcela tiene (\d+) % de pendiente: el agua puede llevarse la tierra\.$/, n => `Your field has a ${n}% slope: the water can wash the soil away.`),
    P(/^Este mes \((.+)\)$/i, m => `This month (${date(m)})`),
    P(/^Llovió (\d+) % menos de lo normal$/, p => `Rainfall ${p}% below normal`),
    P(/^Los satélites ven tu zona (.+) para (\w+)\.$/, (s, m) => `Satellites show your area is ${soilSt(s)} for ${date(m)}.`),
    P(/^Tu (.+) necesita agua constante: cuida la humedad\.$/, c => `${up(yourCrop(c))} needs steady moisture: keep the soil moist.`),
    P(/^Tu (.+) aguanta bien la falta de agua\.$/, c => `${up(yourCrop(c))} tolerates dry spells well.`),
    P(/^Cosecha de ([^,]+)$/, c => `${up(crop(c))} harvest`),
    // Hoy
    P(/^Sembrado en (.+)$/, d => `Planted in ${date(d)}`),
    P(/^Cosecha aprox\. (.+)$/, d => `Harvest approx. ${date(d)}`),
    P(/^Cómo sembrar (.+) juntos$/, c => `How to intercrop ${crop(c)}`),
    P(/^Lluvia normal en (\w+)$/, m => `Normal rainfall in ${date(m)}`),
    P(/^Lluvia de los (.+)$/, d => `Rainfall, ${date(d)}`),
    P(/^GPM IMERG \+ SMAP, (.+)$/, d => `GPM IMERG + SMAP, ${EX[d] || date(d)}`),
    P(/^MODIS NDVI, (.+)$/, d => `MODIS NDVI, ${EX[d] || date(d)}`),
    P(/^Mejor para ti: (.+) \((.+)\)$/, (r, s) => `Best for you: ${strat(r)} (${list(s)})`),
    P(/^Anomalía: GPM IMERG y SMAP \((.+)\)\.$/, d => `Anomaly: GPM IMERG and SMAP (${date(d)}).`),
    // WhatsApp
    P(/^Enviado a (\d+) personas$/, n => `Sent to ${n} people`),
    P(/^Enviado: (.+)$/, s => 'Sent: ' + s.replace(/ a (\d+)/g, ' to $1').replace(/ y /g, ' and ')),
    P(/^(?:Enviado: (.+?)\. )?No llegó a (\d+): (.+)$/, (ok, n, why) => `${ok ? 'Sent: ' + ok.replace(/ a (\d+)/g, ' to $1').replace(/ y /g, ' and ') + '. ' : ''}Not delivered to ${n}: ${EX[why] || why}`),
    P(/^Así llegará a (\d+) personas de tu comunidad\.$/, n => `This is how it will reach ${n} people in your community.`),
    P(/^(.+) recibirá las alertas$/, n => `${n} will receive the alerts`),
    P(/^(.+) ya no recibirá alertas$/, n => `${n} will no longer receive alerts`),
    // Rotación
    P(/^Repite lo que ya siembras(?: \((.+)\))?\. Sirve para comparar\.$/, s => `Repeats what you already plant${s ? ' (' + list(s) + ')' : ''}. Useful as a baseline for comparison.`),
    P(/^(La haba|El tarwi) devuelve abono natural \(nitrógeno\), la (.+?) lo aprovecha y la avena con vicia cubre el suelo en los meses de lluvia\.$/,
      (l, t) => `${l === 'La haba' ? 'Fava beans return' : 'Tarwi returns'} natural fertilizer (nitrogen) to the soil, the ${crop(t)} makes use of it, and oats with vetch cover the soil during the rainy months.`),
    P(/^(\d) de 3$/, n => `${n} of 3`),
    P(/^Confianza (Alta|Media|Baja): (\d) de 5 fuentes en vivo$/, (c, n) => `Confidence: ${lvl(c)} (${n} of 5 sources live)`),
    P(/^Suelo cubierto (\d+) de 36 meses\.$/, n => `Soil covered ${n} of 36 months.`),
    P(/^(\d+) (?:mes|meses) con el suelo descubierto en época de lluvia: riesgo de que la lluvia se lleve la tierra\.$/, n => `${n} ${n === '1' ? 'month' : 'months'} with bare soil in the rainy season: risk of rain washing the soil away.`),
    P(/^Sufre a (.+): el piso (\w+) es muy frío para este cultivo\.$/, (h, z) => `Struggles at ${h}: the ${zone(z)} zone is too cold for this crop.`),
    P(/^Crece bien en el piso (\w+)\.$/i, z => `Grows well in the ${zone(z)} zone.`),
    P(/^Florecería en (\w+), cuando hay unas (\d+) noches de helada\.$/i, (m, n) => `It would flower in ${date(m)}, when there are about ${n} frost nights.`),
    P(/^Florecería en (\w+) con heladas: siembra al inicio de la temporada\.$/i, m => `It would flower in ${date(m)}, during frosts: plant at the start of the season.`),
    P(/^Ya sembraste (.+) hace poco: repetir cansa el suelo y trae plagas\.$/i, c => `You planted ${crop(c)} recently: repeating it wears out the soil and attracts pests.`),
    P(/^Necesita mucha agua y este mes llovió (\d+) % menos de lo normal\.$/i, p => `Needs a lot of water, and this month it rained ${p}% less than normal.`),
    P(/^Pendiente de (\d+) % y altura de (.+) \(SRTM, NASA\)(, medida aproximada)?\.$/, (s, h, a) => `Slope of ${s}% and altitude of ${h} (SRTM, NASA)${a ? ', approximate measurement' : ''}.`),
    P(/^Unas (\d+) noches de helada al año y meses de lluvia fuerte \(NASA POWER(, valores de referencia)?\)\.$/, (n, r) => `About ${n} frost nights a year, plus heavy-rain months (NASA POWER${r ? ', reference values' : ''}).`),
    P(/^Lluvia del último mes ([+-]?\d+) % vs\. lo normal; suelo (.+) \(GPM IMERG y SMAP(, ejemplo)?\)\.$/, (p, s, e) => `Last month's rainfall ${p}% vs. normal; soil ${soilSt(s)} (GPM IMERG and SMAP${e ? ', example' : ''}).`),
    P(/^Verdor de la vegetación ([+-]?\d+) % vs\. los 3 años anteriores \(MODIS NDVI(?:, (.+))?\)\.$/, (p, d) => `Vegetation greenness ${p}% vs. the previous 3 years (MODIS NDVI${d ? ', ' + (d === 'ejemplo' ? 'example' : date(d)) : ''}).`),
    P(/^Carbono orgánico (.+) g\/kg \((bajo|medio|alto)\), suelo (arenoso|arcilloso|franco), pH (.+) \(SoilGrids(, valor típico de la zona)?\)\.$/,
      (c, l, t, ph, v) => `Organic carbon ${c} g/kg (${lvl(l)}), ${TEX[t]} soil, pH ${ph} (SoilGrids${v ? ', typical value for the area' : ''}).`),
    P(/^¿Qué piensas sembrar cuando coseches tu (.+)\?$/, c => `What do you plan to plant after harvesting your ${crop(c)}?`),
    P(/^¿Qué piensas sembrar después\?$/, () => 'What do you plan to plant next?'),
    P(/^Puedes sembrar ya, hasta (.+)\.$/, d => `You can plant now, until ${date(d)}.`),
    P(/^(Puedes sembrar ya|Desde (.+?)), (.+)$/, (a, d, r) => `${d ? 'From ' + date(d) : 'You can plant now'}, ${lower(tr(r) || r)}`),
    P(/^Campaña (.+)$/, c => `Season ${c}`),
    P(/^Sembrado (.+), cosecha (.+)$/, (a, b) => `Planted ${date(a)}, harvest ${date(b)}`),
    P(/^Siembra (.+?)(?: a (.+?))?, cosecha (.+)$/, (a, b, c) => `Plant ${date(a)}${b ? ' to ' + date(b) : ''}, harvest ${date(c)}`),
    P(/^fecha de siembra del (.+) para que no florezca con helada\.$/, c => `the planting date for ${crop(c)} so it does not flower during frost.`),
    P(/^semilla de (.+) adaptada a (.+)\.$/, (c, h) => `${up(crop(c))} seed adapted to ${h}.`),
    P(/^Revisamos tu idea: (.+)$/, c => `We checked your idea: ${crop(c)}`),
    P(/^Elegiste: (.+)\. Revisa tu próxima siembra abajo\.$/, r => `You chose: ${strat(r)}. Check your next planting below.`),
    // Datos
    P(/^Tarda (\d+) a (\d+) meses$/, (a, b) => `Takes ${a} to ${b} months`),
    P(/^Tarda perenne$/, () => 'Perennial'),
    P(/^Antes cosechaste: (.+)\.$/, s => `Previously harvested: ${list(s)}.`),
    P(/^Con pendiente de (\d+) %, el riesgo de erosión es (alto|medio|bajo)\.$/, (n, l) => `With a ${n}% slope, the erosion risk is ${lvl(l)}.`),
    P(/^(\d+) al año$/, n => `${n} a year`),
    P(/^También corregimos su sesgo: el cuadro de POWER \(a (.+)\) marca las noches (.+) °C más (frías|cálidas) que la referencia local, así que ajustamos el promedio y conservamos el patrón de cada mes\.$/,
      (h, d, w) => `We also correct its bias: the POWER grid cell (at ${h}) reads nights ${d} °C ${w === 'frías' ? 'colder' : 'warmer'} than the local reference, so we adjust the average and keep each month's pattern.`),
    P(/^Ejemplo real: el cuadro de NASA POWER sobre Chiara está a (.+) y marca las noches (.+) °C más (frías|cálidas) que la referencia local\. Sin corregir, la app diría que hiela casi todas las noches del año\. Corregimos ese sesgo y conservamos el patrón de cada mes\.$/,
      (h, d, w) => `Real example: the NASA POWER grid cell over Chiara sits at ${h} and reads nights ${d} °C ${w === 'frías' ? 'colder' : 'warmer'} than the local reference. Without correction, the app would say it freezes almost every night of the year. We correct that bias and keep each month's pattern.`)
  ];

  /* Bloques con negritas dentro de una frase (se traducen con su HTML) */
  const BLK = [
    P(/^Te encontré\. <b>Toca las esquinas de tu parcela<\/b> en el mapa\.$/, () => 'Found you. <b>Tap the corners of your field</b> on the map.'),
    P(/^Toca en el mapa <b>cada esquina<\/b> de tu parcela, una por una\.$/, () => 'Tap <b>each corner</b> of your field on the map, one at a time.'),
    P(/^¡Bien! <b>Arrastra los puntos<\/b> si quedaron mal\. El «\+» agrega un punto entre dos esquinas\.$/, () => 'Good! <b>Drag the points</b> if any are off. The «+» adds a point between two corners.'),
    P(/^Comparé 3 formas de rotar <b>(.+?)<\/b> en los próximos 3 años, con los datos de satélite de tu parcela\. Elige qué te importa más y te muestro cuál encaja mejor\.$/,
      n => `I compared 3 ways to rotate crops on <b>${name(n)}</b> over the next 3 years, using your field's satellite data. Choose what matters most to you and I'll show you which one fits best.`),
    P(/^Cada satélite mide en cuadros de distinto tamaño\. Yachiraq lleva todo a la misma escala: <b>un valor por parcela y por mes<\/b>\. La altura y la pendiente se miden en 50 puntos dentro de tu parcela\. El clima de NASA POWER cubre una zona grande, por eso lo ajustamos a la altura exacta de tu parcela: unos 0,65 °C más frío por cada 100 m\.$/,
      () => "Each satellite measures in grid cells of a different size. Yachiraq brings everything to the same scale: <b>one value per field per month</b>. Elevation and slope are measured at 50 points inside your field. NASA POWER climate data covers a large area, so we adjust it to your field's exact altitude: about 0.65 °C colder for every 100 m."),
    P(/^Yachiraq es un <b>piloto en el distrito de Chiara<\/b> \(Ayacucho\), entre 3,000 y 4,300 m: unos (\d+) km alrededor del pueblo, marcados en el mapa\. Fuera de esa zona no damos recomendaciones\.$/,
      km => `Yachiraq is a <b>pilot in the Chiara district</b> (Ayacucho, Peru), between 3,000 and 4,300 m: about ${km} km around the town, marked on the map. We do not give recommendations outside that area.`),
    P(/^Llovió <b>(\d+) % menos<\/b> de lo normal y el suelo está (.+)\.$/, (p, s) => `Rainfall was <b>${p}% below</b> normal and the soil is ${soilSt(s)}.`),
    P(/^Las plantas de tu zona están <b>(.+?)<\/b> que en esta fecha los 3 años anteriores\.( Puede ser falta de agua: revisa tus cultivos\.)?$/, (g, w) => {
      const m = g.match(/^(\d+) % (menos|más) verdes$/);
      const tail = w ? ' This may signal a lack of water: check your crops.' : '';
      if (!m) return `Vegetation in your area is <b>as green as usual</b> for this date, compared with the previous 3 years.${tail}`;
      return `Vegetation in your area is <b>${m[1]}% ${m[2] === 'menos' ? 'less' : 'more'} green</b> than on this date over the previous 3 years.${tail}`;
    }),
    P(/^Podrías sembrar desde <b>(.+?)<\/b>(?: hasta (.+?))?(?:, después de cosechar tu (.+?))?\. Cosecharías en (.+)\.$/,
      (a, b, c, h) => `You could plant from <b>${date(a)}</b>${b ? ' until ' + date(b) : ''}${c ? ', after harvesting your ' + crop(c) : ''}. You would harvest in ${date(h)}.`)
  ];

  /* ---------- Motor ---------- */
  const PROPER = /^(I|NASA|GPM|SMAP|MODIS|SRTM|INIA|FAO|SENAMHI|Open-Meteo|Chiara|Quechua|Suni|Puna|January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/;
  const lower = s => (/^[A-Z][a-z]/.test(s) && !PROPER.test(s)) ? s[0].toLowerCase() + s.slice(1) : s;
  const keepCase = (src, out) => (/^[a-zà-ü¿¡]/.test(src) ? lower(out) : out);
  function one(k) { // una frase completa
    if (Object.prototype.hasOwnProperty.call(EX, k)) return EX[k];
    const l = k.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(EXL, l)) return keepCase(k, EXL[l]);
    for (const [re, fn] of PAT) { const m = k.match(re); if (m) return keepCase(k, fn(...m.slice(1))); }
    return null;
  }
  function tr(k) { // frase completa, o por partes (oraciones, " | ", ", ")
    let r = one(k); if (r != null) return r;
    for (const sep of [/(?<=[.!?…])\s+/, / \| /, /, /]) {
      const parts = k.split(sep); if (parts.length < 2) continue;
      let hit = false;
      const out = parts.map(p => { const x = one(p) ?? (sep.source === ', ' ? null : tr(p)); if (x != null) { hit = true; return x; } return p; });
      if (hit) return out.join(sep.source === ' \\| ' ? ' | ' : sep.source === ', ' ? ', ' : ' ');
    }
    return null;
  }
  function t(s) {
    if (I18N.lang !== 'en' || s == null) return s;
    const str = String(s), k = str.trim(); if (!k) return s;
    if (!/[A-Za-zÁÉÍÓÚáéíóúñ¿¡]/.test(k)) return /\d %/.test(str) ? pct(str) : s;
    const r = tr(k); if (r == null) return s;
    return str.slice(0, str.indexOf(k[0])) + pct(r) + str.slice(str.lastIndexOf(k[k.length - 1]) + 1);
  }

  const touched = new Set(); // {node, kind, attr, orig} para poder volver al español
  const remember = (node, kind, orig, attr) => {
    if (touched.size > 4000) for (const e of touched) if (!e.node.isConnected) touched.delete(e);
    touched.add({ node, kind, orig, attr });
  };
  const INLINE = new Set(['B', 'I', 'EM', 'STRONG', 'BR']);
  function blockOf(el) {
    if (!el.childNodes.length || el.closest('svg')) return;
    let inl = false, txt = false;
    for (const c of el.childNodes) {
      if (c.nodeType === 3) { if (c.nodeValue.trim()) txt = true; }
      else if (c.nodeType === 1 && INLINE.has(c.tagName) && !c.children.length) inl = true;
      else return;
    }
    if (!inl || !txt) return;
    const key = el.innerHTML.replace(/\s+/g, ' ').trim();
    for (const [re, fn] of BLK) { const m = key.match(re); if (m) { remember(el, 'html', el.innerHTML); el.innerHTML = fn(...m.slice(1)); return; } }
  }
  function textNode(n) {
    const p = n.parentNode; if (!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) return;
    const v = n.nodeValue, r = t(v);
    if (r !== v) { remember(n, 'text', v); n.nodeValue = r; }
  }
  const ATTRS = ['aria-label', 'placeholder', 'title'];
  function attrs(el) {
    for (const a of ATTRS) { const v = el.getAttribute(a); if (v) { const r = t(v); if (r !== v) { remember(el, 'attr', v, a); el.setAttribute(a, r); } } }
  }
  function apply(root) {
    if (I18N.lang !== 'en' || !root) return;
    if (root.nodeType === 3) { textNode(root); return; }
    if (root.nodeType !== 1) return;
    const els = [root, ...root.querySelectorAll('*')];
    els.forEach(el => { if (el.isConnected || el === root) blockOf(el); });
    els.forEach(attrs);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); const ns = [];
    while (w.nextNode()) ns.push(w.currentNode);
    ns.forEach(textNode);
  }
  function restore() {
    for (const e of touched) {
      if (!e.node.isConnected) continue;
      if (e.kind === 'text') e.node.nodeValue = e.orig;
      else if (e.kind === 'html') e.node.innerHTML = e.orig;
      else e.node.setAttribute(e.attr, e.orig);
    }
    touched.clear();
  }

  let obs = null;
  function observe() {
    obs = new MutationObserver(recs => {
      if (I18N.lang !== 'en') return;
      for (const r of recs) {
        if (r.type === 'childList') r.addedNodes.forEach(n => { apply(n); if (n.nodeType === 3 && n.parentNode) blockOf(n.parentNode); });
        else if (r.type === 'characterData') textNode(r.target);
        else if (r.type === 'attributes') attrs(r.target);
      }
      obs.takeRecords(); // ignora los cambios que hicimos nosotros
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }

  const ORIG_TITLE = document.title;
  function setLang(l, opts) {
    if (l === 'qu') { note(I18N.lang === 'en' ? 'Runasimi (Quechua) is coming, with audio recorded in Chiara. For now the app is available in Spanish and English.' : 'El runasimi llegará con audios grabados en Chiara. Por ahora, la app está en español e inglés.'); return; }
    I18N.lang = l === 'en' ? 'en' : 'es';
    try { localStorage.setItem('yachiraq.lang', I18N.lang); } catch (e) { }
    document.documentElement.lang = I18N.lang;
    document.title = I18N.lang === 'en' ? (EX[ORIG_TITLE] || ORIG_TITLE) : ORIG_TITLE;
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === I18N.lang));
    if (I18N.lang === 'es') restore();
    if (!(opts && opts.boot) && window.__yachiraqRender) window.__yachiraqRender();
    if (I18N.lang === 'en') apply(document.body);
  }
  let noteT = null;
  function note(m) { const el = document.getElementById('toast'); if (!el) return; el.textContent = m; el.classList.add('show'); clearTimeout(noteT); noteT = setTimeout(() => el.classList.remove('show'), 3500); }

  /* Herramienta para revisar: ?i18n=debug lista en la consola los textos que siguen en español */
  function missing() {
    const out = new Set(), es = /[áéíóúñ¿¡]|\b(de|del|la|las|los|el|tu|tus|para|con|que|una|por|sin|más|hoy|está|parcela|siembra|lluvia|helada|suelo|desde|hasta|papa|haba|maíz|cosecha|mes|meses|ya|agua|tierra|cultivo|ahora|después|y|o|es|son|al|lo|se|su|sus)\b/i;
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) { const n = w.currentNode, v = n.nodeValue.trim(); if (v && es.test(v) && !/^(Doña Rosa|Chiara)/.test(v) && !n.parentNode.closest('script,style,#splash')) out.add(v); }
    document.querySelectorAll('[aria-label],[placeholder],[title]').forEach(el => ATTRS.forEach(a => { const v = el.getAttribute(a); if (v && es.test(v)) out.add('@' + a + ': ' + v); }));
    return [...out];
  }

  const I18N = window.I18N = { lang: 'es', t, apply, setLang, missing };
  let start = 'es';
  try { start = (location.search.match(/[?&]lang=(en|es)/) || [])[1] || localStorage.getItem('yachiraq.lang') || 'es'; } catch (e) { }
  observe();
  document.addEventListener('click', e => { const b = e.target.closest('[data-lang]'); if (b) setLang(b.dataset.lang); });
  setLang(start, { boot: true });
  if (/[?&]i18n=debug/.test(location.search)) setInterval(() => { if (I18N.lang === 'en') { const m = missing(); if (m.length) console.warn('[i18n] Sin traducir:', m); } }, 4000);
})();
