// ⚖️ LIQUIDADOR JUDICIAL PRO — v3.1
// Tres modalidades de interés según uso judicial colombiano:
//   CIVIL     → 6% EA fijo, interés simple (Art. 1617 C.C.)
//               Uso: sentencias, alimentos, RCE, obligaciones civiles puras
//   CORRIENTE → IBC SFC modalidad consumo y ordinario
//               Uso: ejecutivos comerciales (interés pactado o corriente)
//   MORATORIO → IBC × 1.5 (tasa de usura — Art. 884 C.Co)
//               Uso: mora en ejecutivos comerciales, cuando la ley o el contrato lo prevén
//
// Fórmula tasa diaria: (1 + TEA)^(1/días_año) − 1
// Los intereses NUNCA se capitalizan (anatocismo prohibido)
// Capital civil: interés simple estricto → capital × 0.06 × (días/días_año)
// Años bisiestos: 366 días automático
//
// Fuente tasas IBC: https://www.superfinanciera.gov.co/publicaciones/10829/
 
// ─── TABLA DE TASAS IBC ───────────────────────────────────────────────────────
// Fuente: Certificaciones mensuales SFC — Resoluciones publicadas en:
// https://www.superfinanciera.gov.co/publicaciones/10829/
// Formato: { desde: "AAAA-MM-DD", corriente: TEA_decimal, nomMensual: decimal }
// nomMensual = CorPct/12 = tasa nominal mensual usada para calcular interés diario
// Fórmula interés: capital × nomMensual × (días/30)
// usura_nomMensual = corriente_nomMensual × 1.5 (calculado automáticamente)
// La tasa rige desde el día 1 del mes indicado hasta el último día de ese mes.
// usura = corriente × 1.5 (calculado automáticamente)
// ⚠️ Actualizar el primer día hábil de cada mes con la nueva certificación SFC.
// ─── TABLA DE TASAS IBC ───────────────────────────────────────────────────────
// Fuente: Certificaciones mensuales SFC
// https://www.superfinanciera.gov.co/publicaciones/10829/
// Datos extraídos de Tasas.ods (tabla histórica oficial)
// Formato: { desde: "AAAA-MM-DD", corriente: TEA_decimal, nomMensual: decimal }
// nomMensual = CorPct/12 = tasa nominal mensual usada para calcular interés diario
// Fórmula interés: capital × nomMensual × (días/30)
// usura_nomMensual = corriente_nomMensual × 1.5 (calculado automáticamente)
// usura = corriente × 1.5 (calculado automáticamente)
// ⚠️ Añadir nueva entrada cada mes con la certificación SFC.
var TASAS_IBC = [
  { desde: '2018-01-01', corriente: 0.2069, nomMensual: 0.01579406 },  // IBC 20.69% | mens 1.5794%
  { desde: '2018-02-01', corriente: 0.2101, nomMensual: 0.01601822 },  // IBC 21.01% | mens 1.6018%
  { desde: '2018-03-01', corriente: 0.2068, nomMensual: 0.01578704 },  // IBC 20.68% | mens 1.5787%
  { desde: '2018-04-01', corriente: 0.2048, nomMensual: 0.01564666 },  // IBC 20.48% | mens 1.5647%
  { desde: '2018-05-01', corriente: 0.2044, nomMensual: 0.01561855 },  // IBC 20.44% | mens 1.5619%
  { desde: '2018-06-01', corriente: 0.2028, nomMensual: 0.01550606 },  // IBC 20.28% | mens 1.5506%
  { desde: '2018-07-01', corriente: 0.2003, nomMensual: 0.01533 },  // IBC 20.03% | mens 1.5330%
  { desde: '2018-08-01', corriente: 0.1994, nomMensual: 0.01526654 },  // IBC 19.94% | mens 1.5267%
  { desde: '2018-09-01', corriente: 0.1981, nomMensual: 0.0151748 },  // IBC 19.81% | mens 1.5175%
  { desde: '2018-10-01', corriente: 0.1963, nomMensual: 0.01504762 },  // IBC 19.63% | mens 1.5048%
  { desde: '2018-11-01', corriente: 0.1949, nomMensual: 0.01494858 },  // IBC 19.49% | mens 1.4949%
  { desde: '2018-12-01', corriente: 0.194, nomMensual: 0.01488485 },  // IBC 19.40% | mens 1.4885%
  { desde: '2019-01-01', corriente: 0.1916, nomMensual: 0.0147147 },  // IBC 19.16% | mens 1.4715%
  { desde: '2019-02-01', corriente: 0.197, nomMensual: 0.0150971 },  // IBC 19.70% | mens 1.5097%
  { desde: '2019-03-01', corriente: 0.1937, nomMensual: 0.0148636 },  // IBC 19.37% | mens 1.4864%
  { desde: '2019-04-01', corriente: 0.1932, nomMensual: 0.01482817 },  // IBC 19.32% | mens 1.4828%
  { desde: '2019-05-01', corriente: 0.1934, nomMensual: 0.01484235 },  // IBC 19.34% | mens 1.4842%
  { desde: '2019-06-01', corriente: 0.193, nomMensual: 0.014814 },  // IBC 19.30% | mens 1.4814%
  { desde: '2019-07-01', corriente: 0.1928, nomMensual: 0.01479982 },  // IBC 19.28% | mens 1.4800%
  { desde: '2019-08-01', corriente: 0.1932, nomMensual: 0.01482817 },  // IBC 19.32% | mens 1.4828%
  { desde: '2019-09-01', corriente: 0.1932, nomMensual: 0.01482817 },  // IBC 19.32% | mens 1.4828%
  { desde: '2019-10-01', corriente: 0.191, nomMensual: 0.01467212 },  // IBC 19.10% | mens 1.4672%
  { desde: '2019-11-01', corriente: 0.1903, nomMensual: 0.01462241 },  // IBC 19.03% | mens 1.4622%
  { desde: '2019-12-01', corriente: 0.1891, nomMensual: 0.01453713 },  // IBC 18.91% | mens 1.4537%
  { desde: '2020-01-01', corriente: 0.1877, nomMensual: 0.01443754 },  // IBC 18.77% | mens 1.4438%
  { desde: '2020-02-01', corriente: 0.1906, nomMensual: 0.01464372 },  // IBC 19.06% | mens 1.4644%
  { desde: '2020-03-01', corriente: 0.1895, nomMensual: 0.01456557 },  // IBC 18.95% | mens 1.4566%
  { desde: '2020-04-01', corriente: 0.1869, nomMensual: 0.01438059 },  // IBC 18.69% | mens 1.4381%
  { desde: '2020-05-01', corriente: 0.1819, nomMensual: 0.01402381 },  // IBC 18.19% | mens 1.4024%
  { desde: '2020-06-01', corriente: 0.1812, nomMensual: 0.01397375 },  // IBC 18.12% | mens 1.3974%
  { desde: '2020-07-01', corriente: 0.1812, nomMensual: 0.01397375 },  // IBC 18.12% | mens 1.3974%
  { desde: '2020-08-01', corriente: 0.1829, nomMensual: 0.01409528 },  // IBC 18.29% | mens 1.4095%
  { desde: '2020-09-01', corriente: 0.1835, nomMensual: 0.01413813 },  // IBC 18.35% | mens 1.4138%
  { desde: '2020-10-01', corriente: 0.1809, nomMensual: 0.01395229 },  // IBC 18.09% | mens 1.3952%
  { desde: '2020-11-01', corriente: 0.1784, nomMensual: 0.01377324 },  // IBC 17.84% | mens 1.3773%
  { desde: '2020-12-01', corriente: 0.1746, nomMensual: 0.01350042 },  // IBC 17.46% | mens 1.3500%
  { desde: '2021-01-01', corriente: 0.1732, nomMensual: 0.0133997 },  // IBC 17.32% | mens 1.3400%
  { desde: '2021-02-01', corriente: 0.1754, nomMensual: 0.01355792 },  // IBC 17.54% | mens 1.3558%
  { desde: '2021-03-01', corriente: 0.1741, nomMensual: 0.01346446 },  // IBC 17.41% | mens 1.3464%
  { desde: '2021-04-01', corriente: 0.1731, nomMensual: 0.01339251 },  // IBC 17.31% | mens 1.3393%
  { desde: '2021-05-01', corriente: 0.1722, nomMensual: 0.0133277 },  // IBC 17.22% | mens 1.3328%
  { desde: '2021-06-01', corriente: 0.1721, nomMensual: 0.01332049 },  // IBC 17.21% | mens 1.3320%
  { desde: '2021-07-01', corriente: 0.1718, nomMensual: 0.01329888 },  // IBC 17.18% | mens 1.3299%
  { desde: '2021-08-01', corriente: 0.1724, nomMensual: 0.0133421 },  // IBC 17.24% | mens 1.3342%
  { desde: '2021-09-01', corriente: 0.1719, nomMensual: 0.01330608 },  // IBC 17.19% | mens 1.3306%
  { desde: '2021-10-01', corriente: 0.1708, nomMensual: 0.01322679 },  // IBC 17.08% | mens 1.3227%
  { desde: '2021-11-01', corriente: 0.1727, nomMensual: 0.01336371 },  // IBC 17.27% | mens 1.3364%
  { desde: '2021-12-01', corriente: 0.1746, nomMensual: 0.01350042 },  // IBC 17.46% | mens 1.3500%
  { desde: '2022-01-01', corriente: 0.1766, nomMensual: 0.01364411 },  // IBC 17.66% | mens 1.3644%
  { desde: '2022-02-01', corriente: 0.183, nomMensual: 0.01410242 },  // IBC 18.30% | mens 1.4102%
  { desde: '2022-03-01', corriente: 0.1847, nomMensual: 0.01422378 },  // IBC 18.47% | mens 1.4224%
  { desde: '2022-04-01', corriente: 0.1905, nomMensual: 0.01463662 },  // IBC 19.05% | mens 1.4637%
  { desde: '2022-05-01', corriente: 0.1971, nomMensual: 0.01510416 },  // IBC 19.71% | mens 1.5104%
  { desde: '2022-06-01', corriente: 0.204, nomMensual: 0.01559044 },  // IBC 20.40% | mens 1.5590%
  { desde: '2022-07-01', corriente: 0.2128, nomMensual: 0.01620693 },  // IBC 21.28% | mens 1.6207%
  { desde: '2022-08-01', corriente: 0.2221, nomMensual: 0.01685401 },  // IBC 22.21% | mens 1.6854%
  { desde: '2022-09-01', corriente: 0.235, nomMensual: 0.01774413 },  // IBC 23.50% | mens 1.7744%
  { desde: '2022-10-01', corriente: 0.2461, nomMensual: 0.01850326 },  // IBC 24.61% | mens 1.8503%
  { desde: '2022-11-01', corriente: 0.2578, nomMensual: 0.01929674 },  // IBC 25.78% | mens 1.9297%
  { desde: '2022-12-01', corriente: 0.2764, nomMensual: 0.02054434 },  // IBC 27.64% | mens 2.0544%
  { desde: '2023-01-01', corriente: 0.2884, nomMensual: 0.02134044 },  // IBC 28.84% | mens 2.1340%
  { desde: '2023-02-01', corriente: 0.3018, nomMensual: 0.02222141 },  // IBC 30.18% | mens 2.2221%
  { desde: '2023-03-01', corriente: 0.3084, nomMensual: 0.02265227 },  // IBC 30.84% | mens 2.2652%
  { desde: '2023-04-01', corriente: 0.3139, nomMensual: 0.02300981 },  // IBC 31.39% | mens 2.3010%
  { desde: '2023-05-01', corriente: 0.3027, nomMensual: 0.02228028 },  // IBC 30.27% | mens 2.2280%
  { desde: '2023-06-01', corriente: 0.2976, nomMensual: 0.02194618 },  // IBC 29.76% | mens 2.1946%
  { desde: '2023-07-01', corriente: 0.2936, nomMensual: 0.0216833 },  // IBC 29.36% | mens 2.1683%
  { desde: '2023-08-01', corriente: 0.2875, nomMensual: 0.02128096 },  // IBC 28.75% | mens 2.1281%
  { desde: '2023-09-01', corriente: 0.2803, nomMensual: 0.02080382 },  // IBC 28.03% | mens 2.0804%
  { desde: '2023-10-01', corriente: 0.2653, nomMensual: 0.01980183 },  // IBC 26.53% | mens 1.9802%
  { desde: '2023-11-01', corriente: 0.2552, nomMensual: 0.01912099 },  // IBC 25.52% | mens 1.9121%
  { desde: '2023-12-01', corriente: 0.2504, nomMensual: 0.01879567 },  // IBC 25.04% | mens 1.8796%
  { desde: '2024-01-01', corriente: 0.2332, nomMensual: 0.01762044 },  // IBC 23.32% | mens 1.7620%
  { desde: '2024-02-01', corriente: 0.2331, nomMensual: 0.01761357 },  // IBC 23.31% | mens 1.7614%
  { desde: '2024-03-01', corriente: 0.222, nomMensual: 0.01684707 },  // IBC 22.20% | mens 1.6847%
  { desde: '2024-04-01', corriente: 0.2206, nomMensual: 0.01674995 },  // IBC 22.06% | mens 1.6750%
  { desde: '2024-05-01', corriente: 0.2102, nomMensual: 0.01602522 },  // IBC 21.02% | mens 1.6025%
  { desde: '2024-06-01', corriente: 0.2056, nomMensual: 0.01570284 },  // IBC 20.56% | mens 1.5703%
  { desde: '2024-07-01', corriente: 0.1966, nomMensual: 0.01506883 },  // IBC 19.66% | mens 1.5069%
  { desde: '2024-08-01', corriente: 0.1947, nomMensual: 0.01493442 },  // IBC 19.47% | mens 1.4934%
  { desde: '2024-09-01', corriente: 0.1923, nomMensual: 0.01476436 },  // IBC 19.23% | mens 1.4764%
  { desde: '2024-10-01', corriente: 0.1878, nomMensual: 0.01444466 },  // IBC 18.78% | mens 1.4445%
  { desde: '2024-11-01', corriente: 0.1759, nomMensual: 0.01359384 },  // IBC 17.59% | mens 1.3594%
  { desde: '2024-12-01', corriente: 0.1659, nomMensual: 0.01287275 },  // IBC 16.59% | mens 1.2873%
  { desde: '2025-01-01', corriente: 0.1659, nomMensual: 0.01287275 },  // IBC 16.59% | mens 1.2873%
  { desde: '2025-02-01', corriente: 0.1753, nomMensual: 0.01355074 },  // IBC 17.53% | mens 1.3551%
  { desde: '2025-03-01', corriente: 0.1661, nomMensual: 0.01288723 },  // IBC 16.61% | mens 1.2887%
  { desde: '2025-04-01', corriente: 0.1708, nomMensual: 0.01322679 },  // IBC 17.08% | mens 1.3227%
  { desde: '2025-05-01', corriente: 0.1731, nomMensual: 0.01339251 },  // IBC 17.31% | mens 1.3393%
  { desde: '2025-06-01', corriente: 0.1703, nomMensual: 0.01319073 },  // IBC 17.03% | mens 1.3191%
  { desde: '2025-07-01', corriente: 0.1652, nomMensual: 0.01282206 },  // IBC 16.52% | mens 1.2822%
  { desde: '2025-08-01', corriente: 0.1678, nomMensual: 0.01301019 },  // IBC 16.78% | mens 1.3010%
  { desde: '2025-09-01', corriente: 0.1667, nomMensual: 0.01293064 },  // IBC 16.67% | mens 1.2931%
  { desde: '2025-10-01', corriente: 0.1624, nomMensual: 0.01261902 },  // IBC 16.24% | mens 1.2619%
  { desde: '2025-11-01', corriente: 0.1666, nomMensual: 0.01292341 },  // IBC 16.66% | mens 1.2923%
  { desde: '2025-12-01', corriente: 0.1668, nomMensual: 0.01293788 },  // IBC 16.68% | mens 1.2938%
  { desde: '2026-01-01', corriente: 0.1624, nomMensual: 0.01261902 },  // IBC 16.24% | mens 1.2619%
  { desde: '2026-02-01', corriente: 0.1682, nomMensual: 0.0130391 },  // IBC 16.82% | mens 1.3039%
  { desde: '2026-03-01', corriente: 0.1701, nomMensual: 0.0131763 },  // IBC 17.01% | mens 1.3176%
  { desde: '2026-04-01', corriente: 0.1784, nomMensual: 0.01377324 },  // IBC 17.84% | mens 1.3773%
];
 
// ─────────────────────────────────────────────────────────────────────────────
// ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Liquidador Judicial Pro')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}
 
// ─────────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
function generarLiquidacionSheet(formulario) {
 
  // ── 1. VALIDACIÓN ──────────────────────────────────────────────────────────
  var capital = parseFloat(formulario.capital.replace(/\./g, ''));
  if (isNaN(capital) || capital <= 0)
    throw new Error("El capital debe ser un número positivo.");
 
  var tipoInteres = formulario.tipoInteres;
  if (tipoInteres !== "CIVIL" && tipoInteres !== "CORRIENTE" && tipoInteres !== "MORATORIO")
    throw new Error("Tipo de interés inválido. Use CIVIL, CORRIENTE o MORATORIO.");
 
  var agencias = formulario.agencias ? parseFloat(formulario.agencias.replace(/\./g, '')) : 0;
  var costas   = formulario.costas   ? parseFloat(formulario.costas.replace(/\./g, ''))   : 0;
  var capitalOriginal = capital;
 
  var pI = formulario.fechaInicio.split("-");
  var fechaInicio = new Date(+pI[0], +pI[1]-1, +pI[2]);
 
  var pF = formulario.fechaFin.split("-");
  var fechaFin = new Date(+pF[0], +pF[1]-1, +pF[2]);
 
  if (fechaInicio > fechaFin)
    throw new Error("La fecha de inicio de mora debe ser anterior o igual a la fecha de pago.");
 
  // ── 2. ABONOS ──────────────────────────────────────────────────────────────
  var abonos = [];
  if (formulario.abonoFecha && formulario.abonoValor) {
    var aFechas  = Array.isArray(formulario.abonoFecha)  ? formulario.abonoFecha  : [formulario.abonoFecha];
    var aValores = Array.isArray(formulario.abonoValor) ? formulario.abonoValor : [formulario.abonoValor];
    for (var i = 0; i < aFechas.length; i++) {
      if (!aFechas[i] || !aValores[i]) continue;
      var pA = aFechas[i].split("-");
      var fa = new Date(+pA[0], +pA[1]-1, +pA[2]);
      if (fa < fechaInicio || fa > fechaFin)
        throw new Error("El abono del " + aFechas[i] + " está fuera del rango de liquidación.");
      abonos.push({ fecha: fa, valor: parseFloat(aValores[i].replace(/\./g, '')), aplicado: false });
    }
    abonos.sort(function(a, b){ return a.fecha - b.fecha; });
  }
 
  // ── 3. CONSTRUCCIÓN DE TRAMOS ──────────────────────────────────────────────
  // Para CIVIL: un solo tramo (tasa fija, no cambia)
  // Para CORRIENTE/MORATORIO: cortes por cambio de IBC + fechas de abonos
 
  var capital    = capitalOriginal;
  var interesAcum = 0;
  var lineas     = [];
 
  // Fechas de corte
  var fechasCorte = [fechaFin];
 
  if (tipoInteres !== "CIVIL") {
    // Cortes por cambio de IBC
    for (var t = 0; t < TASAS_IBC.length; t++) {
      var fCorte = parseFecha(TASAS_IBC[t].desde);
      if (fCorte > fechaInicio && fCorte <= fechaFin) {
        fechasCorte.push(fCorte);
      }
    }
  }
 
  // Cortes por abonos
  for (var a = 0; a < abonos.length; a++) {
    fechasCorte.push(abonos[a].fecha);
  }
 
  // Ordenar y deduplicar
  fechasCorte.sort(function(a, b){ return a - b; });
  var cortesUnicos = [];
  var prevMs = -1;
  for (var c = 0; c < fechasCorte.length; c++) {
    if (fechasCorte[c].getTime() !== prevMs) {
      cortesUnicos.push(fechasCorte[c]);
      prevMs = fechasCorte[c].getTime();
    }
  }
 
  // ── 4. LOOP DE LIQUIDACIÓN ─────────────────────────────────────────────────
  var desdeTramo = fechaInicio;
 
  for (var c = 0; c < cortesUnicos.length; c++) {
    var hastaTramo = cortesUnicos[c];
    if (hastaTramo < desdeTramo) continue;
 
    // Días del año (bisiesto automático)
    var diasAnio = esBisiesto(desdeTramo.getFullYear()) ? 366 : 365;
 
    // Días del tramo (inclusive en ambos extremos para el último período)
    var nDias = diasEntreFechas(desdeTramo, hastaTramo);
    if (hastaTramo.getTime() === fechaFin.getTime()) nDias += 1;
 
    // ── Tasa según modalidad ──
    var teaIBC       = 0;
    var teaAplicada  = 0;
    var tasaDiaria   = 0;
    var tasaMensual  = 0;
    var interesTramo = 0;
 
    if (tipoInteres === "CIVIL") {
      // Interés civil 6% EA — Art. 1617 C.C.
      // Fórmula: capital × (0.06/12) × (días/30) — interés simple proporcional
      // CorPct civil = 0.06/12*100 = 0.5% mensual fijo
      teaIBC       = 0.06;
      teaAplicada  = 0.06;
      tasaMensual  = 0.06 / 12;              // 0.5% mensual en decimal
      tasaDiaria   = tasaMensual / 30;       // solo referencia para el sheet
      interesTramo = capital * tasaMensual * (nDias / 30);
 
    } else {
      // CORRIENTE o MORATORIO — IBC SFC
      // Fórmula exacta del liquidador: (CAPITAL × días × Tasa) / 3000
      // donde Tasa = CorPct/12  (nominal mensual en %, sin redondear)
      // equivalente a: capital × (CorPct/12/100) × (días/30)
      // Para CORRIENTE: usa CorPct corriente
      // Para MORATORIO: usa CorPct corriente (el Excel usa la misma base corriente)
      // La distinción mora/plazo en el Excel es solo de encabezado, no de tasa
      var ibcData  = obtenerIBCData(desdeTramo);
      teaIBC       = ibcData.tea;
      var corPct   = ibcData.nomMensual;    // CorPct/12 ya en decimal
      teaAplicada  = teaIBC;
      tasaMensual  = corPct;                // nominal mensual decimal (ej: 0.018796)
      tasaDiaria   = tasaMensual / 30;      // solo referencia para el sheet
      interesTramo = capital * tasaMensual * (nDias / 30);
    }
 
    interesAcum += interesTramo;
 
    // ── Aplicar abonos del día hastaTramo ──
    var abonoDia = 0, abonoAInt = 0, abonoACap = 0;
    for (var a = 0; a < abonos.length; a++) {
      if (!abonos[a].aplicado && abonos[a].fecha.getTime() === hastaTramo.getTime()) {
        abonoDia += abonos[a].valor;
        abonos[a].aplicado = true;
      }
    }
    if (abonoDia > 0) {
      if (abonoDia <= interesAcum) {
        abonoAInt = abonoDia;
        interesAcum -= abonoAInt;
      } else {
        abonoAInt   = interesAcum;
        interesAcum = 0;
        abonoACap   = abonoDia - abonoAInt;
        capital     = Math.max(0, capital - abonoACap);
      }
    }
 
    lineas.push({
      desde:        desdeTramo,
      hasta:        hastaTramo,
      dias:         nDias,
      diasAnio:     diasAnio,
      teaIBC:       teaIBC,
      teaAplicada:  teaAplicada,
      tasaDiaria:   tasaDiaria,
      capitalBase:  capital + abonoACap,
      tasaMensual:  tasaMensual,
      interesTramo: interesTramo,
      abono:        abonoDia,
      abonoAInt:    abonoAInt,
      abonoACap:    abonoACap,
      saldoInteres: interesAcum,
      saldoCapital: capital
    });
 
    if (capital <= 0) break;
    if (hastaTramo.getTime() >= fechaFin.getTime()) break;
 
    desdeTramo = new Date(
      hastaTramo.getFullYear(),
      hastaTramo.getMonth(),
      hastaTramo.getDate() + 1
    );
  }
 
  // ── 5. CREAR GOOGLE SHEET ──────────────────────────────────────────────────
  var etiquetaTipo = {
    "CIVIL":     "CIVIL (6% EA — Art. 1617 C.C.)",
    "CORRIENTE": "CORRIENTE (IBC SFC)",
    "MORATORIO": "MORATORIO (IBC × 1.5 — Art. 884 C.Co)"
  }[tipoInteres];
 
  var libro = SpreadsheetApp.create(
    "Liquidacion_" + tipoInteres + "_" + formulario.fechaInicio
  );
  var hoja = libro.getSheets()[0];
  hoja.setName("Liquidación");
 
  // Encabezado
  hoja.getRange("A1").setValue("LIQUIDACIÓN DE INTERESES — " + etiquetaTipo)
    .setFontWeight("bold").setFontSize(13);
  hoja.getRange("A2").setValue("Fuente tasas: Superintendencia Financiera de Colombia")
    .setFontColor("#555555").setFontSize(11);
 
  hoja.getRange("A4").setValue("Capital base:").setFontWeight("bold");
  hoja.getRange("B4").setValue(capitalOriginal).setNumberFormat('$ #,##0.00');
  hoja.getRange("A5").setValue("Inicio mora:").setFontWeight("bold");
  hoja.getRange("B5").setValue(Utilities.formatDate(fechaInicio, Session.getScriptTimeZone(), "dd/MM/yyyy"));
  hoja.getRange("A6").setValue("Fecha pago:").setFontWeight("bold");
  hoja.getRange("B6").setValue(Utilities.formatDate(fechaFin, Session.getScriptTimeZone(), "dd/MM/yyyy"));
  hoja.getRange("A7").setValue("Régimen:").setFontWeight("bold");
  hoja.getRange("B7").setValue(etiquetaTipo);
 
  // Cabecera tabla
  var headers = [
    "Desde", "Hasta", "Días", "Año",
    "IBC EA", "Tasa mens. (%)", "Tasa diaria (ref.)",
    "Capital base", "Interés tramo",
    "Abono", "A intereses", "A capital",
    "Saldo intereses", "Saldo capital"
  ];
  var fila = 9;
  hoja.getRange(fila, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight("bold")
    .setBackground("#1a3a5c")
    .setFontColor("white")
    .setHorizontalAlignment("center")
    .setWrap(true);
  hoja.setRowHeight(fila, 40);
  fila++;
 
  // Filas de datos
  var filasDatos = lineas.map(function(l) {
    return [
      Utilities.formatDate(l.desde, Session.getScriptTimeZone(), "dd/MM/yyyy"),
      Utilities.formatDate(l.hasta, Session.getScriptTimeZone(), "dd/MM/yyyy"),
      l.dias,
      l.diasAnio,
      l.teaIBC,
      l.tasaMensual * 100,   // tasa mensual en %
      l.tasaDiaria * 100,    // tasa diaria en % (referencia),
      l.capitalBase,
      Math.round(l.interesTramo * 100) / 100,
      l.abono    > 0 ? l.abono    : "-",
      l.abonoAInt > 0 ? l.abonoAInt : "-",
      l.abonoACap > 0 ? l.abonoACap : "-",
      Math.round(l.saldoInteres * 100) / 100,
      Math.round(l.saldoCapital * 100) / 100
    ];
  });
 
  if (filasDatos.length > 0) {
    hoja.getRange(fila, 1, filasDatos.length, headers.length)
      .setValues(filasDatos)
      .setHorizontalAlignment("center");
 
    hoja.getRange(fila, 5, filasDatos.length, 1).setNumberFormat("0.00%");     // IBC EA
    hoja.getRange(fila, 6, filasDatos.length, 1).setNumberFormat("0.0000%");      // tasa mensual
    hoja.getRange(fila, 7, filasDatos.length, 1).setNumberFormat("0.00000000%");  // tasa diaria ref
    hoja.getRange(fila, 8, filasDatos.length, 2).setNumberFormat('$ #,##0.00');
    hoja.getRange(fila, 13, filasDatos.length, 2).setNumberFormat('$ #,##0.00');
 
    for (var r = 0; r < filasDatos.length; r++) {
      if (r % 2 === 0) {
        hoja.getRange(fila + r, 1, 1, headers.length).setBackground("#f2f7fc");
      }
    }
    fila += filasDatos.length;
  }
 
  // ── Resumen final ──
  fila += 1;
  var intFinal  = Math.round(interesAcum * 100) / 100;
  var capFinal  = Math.round(capital * 100) / 100;
  var granTotal = capFinal + intFinal + agencias + costas;
 
  var resumen = [
    ["Capital final:", capFinal],
    ["Intereses:",     intFinal]
  ];
  if (agencias > 0) resumen.push(["Agencias en costas:", agencias]);
  if (costas   > 0) resumen.push(["Costas:",             costas]);
  resumen.push(["GRAN TOTAL:", granTotal]);
 
  for (var r = 0; r < resumen.length; r++) {
    var esTotal = (r === resumen.length - 1);
    hoja.getRange(fila + r, headers.length - 1)
      .setValue(resumen[r][0])
      .setFontWeight("bold")
      .setHorizontalAlignment("right");
    var celda = hoja.getRange(fila + r, headers.length);
    celda.setValue(resumen[r][1]).setNumberFormat('$ #,##0.00');
    if (esTotal) {
      hoja.getRange(fila + r, headers.length - 1, 1, 2)
        .setBackground("#d4efdf")
        .setFontWeight("bold")
        .setFontSize(12);
    }
  }
 
  hoja.autoResizeColumns(1, headers.length);
  hoja.setColumnWidth(6, 120);
  hoja.setColumnWidth(7, 130);
 
  // ── Hoja de trazabilidad ──
  var hojaT = libro.insertSheet("Tasas aplicadas");
  hojaT.getRange("A1").setValue("TASAS APLICADAS EN ESTA LIQUIDACIÓN")
    .setFontWeight("bold").setFontSize(11);
  hojaT.getRange("A2").setValue(
    tipoInteres === "CIVIL"
      ? "Interés civil fijo: 6% EA — Art. 1617 C.C. — tasa diaria = 0.06 / días_año"
      : "Fuente: Superintendencia Financiera de Colombia — https://www.superfinanciera.gov.co/publicaciones/10829/\nFórmula tasa diaria: (1 + TEA)^(1/días_año) − 1"
  ).setFontColor("#555555");
 
  var hT = [["Vigencia desde", "IBC Corriente EA", "Usura EA", "Tipo aplicado", "Tasa diaria (10 dec.)"]];
  hojaT.getRange(4, 1, 1, 5).setValues(hT)
    .setFontWeight("bold").setBackground("#1a3a5c").setFontColor("white");
 
  var filaT = 5;
  var vistas = {};
  for (var li = 0; li < lineas.length; li++) {
    var key = lineas[li].teaIBC.toString() + "_" + lineas[li].diasAnio;
    if (!vistas[key]) {
      vistas[key] = true;
      hojaT.getRange(filaT, 1).setValue(
        Utilities.formatDate(lineas[li].desde, Session.getScriptTimeZone(), "dd/MM/yyyy")
      );
      hojaT.getRange(filaT, 2).setValue(lineas[li].teaIBC).setNumberFormat("0.00%");
      hojaT.getRange(filaT, 3).setValue(lineas[li].teaIBC * 1.5).setNumberFormat("0.00%");
      hojaT.getRange(filaT, 4).setValue(tipoInteres);
      hojaT.getRange(filaT, 5).setValue(lineas[li].tasaDiaria).setNumberFormat("0.0000000000%");
      filaT++;
    }
  }
  hojaT.autoResizeColumns(1, 5);
 
  return libro.getUrl();
}
 
// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
 
function obtenerIBCData(fecha) {
  // Devuelve { tea: TEA_decimal, nomMensual: CorPct/12/100 }
  var tsMs = fecha.getTime();
  var entrada = null;
  for (var i = 0; i < TASAS_IBC.length; i++) {
    var fDesde = parseFecha(TASAS_IBC[i].desde);
    if (fDesde.getTime() <= tsMs) {
      entrada = TASAS_IBC[i];
    } else {
      break;
    }
  }
  if (entrada === null) {
    throw new Error(
      "No hay tasa IBC registrada para la fecha " +
      Utilities.formatDate(fecha, Session.getScriptTimeZone(), "dd/MM/yyyy") +
      ". Actualice la tabla TASAS_IBC con la certificación de la SFC para ese período.\n" +
      "Fuente: https://www.superfinanciera.gov.co/publicaciones/10829/"
    );
  }
  return { tea: entrada.corriente, nomMensual: entrada.nomMensual };
}
 
function obtenerIBC(fecha) {
  // Compatibilidad — devuelve solo la TEA
  return obtenerIBCData(fecha).tea;
}
 
function parseFecha(str) {
  var p = str.split("-");
  return new Date(+p[0], +p[1]-1, +p[2]);
}
 
function diasEntreFechas(d1, d2) {
  var utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  var utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.round((utc2 - utc1) / 86400000);
}
 
function esBisiesto(anio) {
  return (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);
}
 
// ─────────────────────────────────────────────────────────────────────────────
// MANTENIMIENTO — ejecutar desde el editor de Apps Script
// ─────────────────────────────────────────────────────────────────────────────
 
function verificarCobertura(fechaInicioStr, fechaFinStr) {
  // Uso: verificarCobertura("2022-01-01", "2026-04-30")
  try {
    obtenerIBC(parseFecha(fechaInicioStr));
    obtenerIBC(parseFecha(fechaFinStr));
    Logger.log("✓ Cobertura OK para " + fechaInicioStr + " → " + fechaFinStr);
  } catch(e) {
    Logger.log("✗ " + e.message);
  }
}
 
function agregarNuevaTasa(fechaDesde, tasaCorrienteEA) {
  // Uso: agregarNuevaTasa("2026-05-01", 0.2100)
  // IMPORTANTE: copiar también al array TASAS_IBC para que persista
  TASAS_IBC.push({ desde: fechaDesde, corriente: tasaCorrienteEA });
  TASAS_IBC.sort(function(a, b){ return parseFecha(a.desde) - parseFecha(b.desde); });
  Logger.log("Tasa añadida: " + fechaDesde + " → corriente=" +
    (tasaCorrienteEA*100).toFixed(2) + "% | usura=" +
    (tasaCorrienteEA*1.5*100).toFixed(2) + "%");
}
