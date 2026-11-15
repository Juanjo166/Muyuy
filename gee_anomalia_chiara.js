// Yachiraq: anomalía de lluvia (GPM IMERG) y humedad del suelo (SMAP) en Chiara, Ayacucho.
// Cómo usarlo: abre https://code.earthengine.google.com, pega este script y presiona "Run".
// En la consola (derecha) aparece una línea "const ANOM_CONFIG=..." para pegar en index.html.

var chiara = ee.Geometry.Point([-74.2058, -13.2730]).buffer(15000); // 15 km alrededor del pueblo
Map.centerObject(chiara, 10);
Map.addLayer(chiara, {color: 'red'}, 'Chiara');

// ---------- Lluvia: GPM IMERG (mm/h cada 30 minutos) ----------
// Si el ID no existe, busca "IMERG" en el catálogo de datos de Earth Engine y reemplázalo.
var imerg = ee.ImageCollection('NASA/GPM_L3/IMERG_V07').select('precipitation');
var lastRain = ee.Date(imerg.aggregate_max('system:time_start'));   // último dato disponible
var rStart = lastRain.advance(-30, 'day');

function rainSum(s, e) { return imerg.filterDate(s, e).sum().multiply(0.5); } // mm acumulados
function meanIn(img, band) { return ee.Number(img.reduceRegion(ee.Reducer.mean(), chiara, 10000).get(band)); }

var rainRecent = meanIn(rainSum(rStart, lastRain), 'precipitation');
var rainClim = ee.Number(ee.List.sequence(1, 20).map(function (k) {        // mismo periodo, 20 años anteriores
  var s = rStart.advance(ee.Number(k).multiply(-1), 'year'), e = lastRain.advance(ee.Number(k).multiply(-1), 'year');
  return meanIn(rainSum(s, e), 'precipitation');
}).reduce(ee.Reducer.mean()));
var rainPct = rainRecent.divide(rainClim).subtract(1).multiply(100).round();

// ---------- Humedad del suelo: SMAP L3 mejorado (9 km) ----------
// Si el ID no existe, busca "SMAP L3 Radiometer Global Daily 9 km" en el catálogo y reemplázalo.
var smap = ee.ImageCollection('NASA/SMAP/SPL3SMP_E/006').select('soil_moisture_am');
var lastSoil = ee.Date(smap.aggregate_max('system:time_start'));
var sStart = lastSoil.advance(-30, 'day');
var soilRecent = meanIn(smap.filterDate(sStart, lastSoil).mean(), 'soil_moisture_am');
var soilClim = ee.Number(ee.List.sequence(1, 8).map(function (k) {         // SMAP existe desde 2015
  var s = sStart.advance(ee.Number(k).multiply(-1), 'year'), e = lastSoil.advance(ee.Number(k).multiply(-1), 'year');
  return meanIn(smap.filterDate(s, e).mean(), 'soil_moisture_am');
}).reduce(ee.Reducer.mean()));
var soilPct = soilRecent.divide(soilClim).subtract(1).multiply(100).round();

ee.Dictionary({
  rain: rainPct, soil: soilPct,
  rainMm: rainRecent.round(), rainNormalMm: rainClim.round(),
  desde: rStart.format('d MMM'), hasta: lastRain.format('d MMM YYYY')
}).evaluate(function (r) {
  print('Lluvia últimos 30 días: ' + r.rainMm + ' mm (normal: ' + r.rainNormalMm + ' mm) → ' + r.rain + ' %');
  print('Humedad del suelo vs. normal: ' + r.soil + ' %');
  print('Pega esta línea en index.html (reemplaza la que dice const ANOM_CONFIG=...):');
  print("const ANOM_CONFIG={rainPct:" + r.rain + ",soilPct:" + r.soil + ",period:'" + r.desde + " al " + r.hasta + "',live:true};");
});
