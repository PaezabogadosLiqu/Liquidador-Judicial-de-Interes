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
  { desde: '2018-01-01', corriente: 0.2069, nomMensual: 0.01579406, nomMensualMora: 0.02277919 },  // cor 1.5794% | mora 2.2779%
  { desde: '2018-02-01', corriente: 0.2101, nomMensual: 0.01601822, nomMensualMora: 0.02309087 },  // cor 1.6018% | mora 2.3091%
  { desde: '2018-03-01', corriente: 0.2068, nomMensual: 0.01578704, nomMensualMora: 0.02276944 },  // cor 1.5787% | mora 2.2769%
  { desde: '2018-04-01', corriente: 0.2048, nomMensual: 0.01564666, nomMensualMora: 0.02257408 },  // cor 1.5647% | mora 2.2574%
  { desde: '2018-05-01', corriente: 0.2044, nomMensual: 0.01561855, nomMensualMora: 0.02253496 },  // cor 1.5619% | mora 2.2535%
  { desde: '2018-06-01', corriente: 0.2028, nomMensual: 0.01550606, nomMensualMora: 0.02237832 },  // cor 1.5506% | mora 2.2378%
  { desde: '2018-07-01', corriente: 0.2003, nomMensual: 0.01533, nomMensualMora: 0.02213303 },  // cor 1.5330% | mora 2.2133%
  { desde: '2018-08-01', corriente: 0.1994, nomMensual: 0.01526654, nomMensualMora: 0.02204457 },  // cor 1.5267% | mora 2.2045%
  { desde: '2018-09-01', corriente: 0.1981, nomMensual: 0.0151748, nomMensualMora: 0.02191665 },  // cor 1.5175% | mora 2.1917%
  { desde: '2018-10-01', corriente: 0.1963, nomMensual: 0.01504762, nomMensualMora: 0.02173922 },  // cor 1.5048% | mora 2.1739%
  { desde: '2018-11-01', corriente: 0.1949, nomMensual: 0.01494858, nomMensualMora: 0.021601 },  // cor 1.4949% | mora 2.1601%
  { desde: '2018-12-01', corriente: 0.194, nomMensual: 0.01488485, nomMensualMora: 0.02151203 },  // cor 1.4885% | mora 2.1512%
  { desde: '2019-01-01', corriente: 0.1916, nomMensual: 0.0147147, nomMensualMora: 0.02127435 },  // cor 1.4715% | mora 2.1274%
  { desde: '2019-02-01', corriente: 0.197, nomMensual: 0.0150971, nomMensualMora: 0.02180826 },  // cor 1.5097% | mora 2.1808%
  { desde: '2019-03-01', corriente: 0.1937, nomMensual: 0.0148636, nomMensualMora: 0.02148235 },  // cor 1.4864% | mora 2.1482%
  { desde: '2019-04-01', corriente: 0.1932, nomMensual: 0.01482817, nomMensualMora: 0.02143287 },  // cor 1.4828% | mora 2.1433%
  { desde: '2019-05-01', corriente: 0.1934, nomMensual: 0.01484235, nomMensualMora: 0.02145267 },  // cor 1.4842% | mora 2.1453%
  { desde: '2019-06-01', corriente: 0.193, nomMensual: 0.014814, nomMensualMora: 0.02141307 },  // cor 1.4814% | mora 2.1413%
  { desde: '2019-07-01', corriente: 0.1928, nomMensual: 0.01479982, nomMensualMora: 0.02139327 },  // cor 1.4800% | mora 2.1393%
  { desde: '2019-08-01', corriente: 0.1932, nomMensual: 0.01482817, nomMensualMora: 0.02143287 },  // cor 1.4828% | mora 2.1433%
  { desde: '2019-09-01', corriente: 0.1932, nomMensual: 0.01482817, nomMensualMora: 0.02143287 },  // cor 1.4828% | mora 2.1433%
  { desde: '2019-10-01', corriente: 0.191, nomMensual: 0.01467212, nomMensualMora: 0.02121484 },  // cor 1.4672% | mora 2.1215%
  { desde: '2019-11-01', corriente: 0.1903, nomMensual: 0.01462241, nomMensualMora: 0.02114536 },  // cor 1.4622% | mora 2.1145%
  { desde: '2019-12-01', corriente: 0.1891, nomMensual: 0.01453713, nomMensualMora: 0.02102613 },  // cor 1.4537% | mora 2.1026%
  { desde: '2020-01-01', corriente: 0.1877, nomMensual: 0.01443754, nomMensualMora: 0.02088684 },  // cor 1.4438% | mora 2.0887%
  { desde: '2020-02-01', corriente: 0.1906, nomMensual: 0.01464372, nomMensualMora: 0.02117514 },  // cor 1.4644% | mora 2.1175%
  { desde: '2020-03-01', corriente: 0.1895, nomMensual: 0.01456557, nomMensualMora: 0.02106589 },  // cor 1.4566% | mora 2.1066%
  { desde: '2020-04-01', corriente: 0.1869, nomMensual: 0.01438059, nomMensualMora: 0.02080714 },  // cor 1.4381% | mora 2.0807%
  { desde: '2020-05-01', corriente: 0.1819, nomMensual: 0.01402381, nomMensualMora: 0.02030752 },  // cor 1.4024% | mora 2.0308%
  { desde: '2020-06-01', corriente: 0.1812, nomMensual: 0.01397375, nomMensualMora: 0.02023735 },  // cor 1.3974% | mora 2.0237%
  { desde: '2020-07-01', corriente: 0.1812, nomMensual: 0.01397375, nomMensualMora: 0.02023735 },  // cor 1.3974% | mora 2.0237%
  { desde: '2020-08-01', corriente: 0.1829, nomMensual: 0.01409528, nomMensualMora: 0.02040766 },  // cor 1.4095% | mora 2.0408%
  { desde: '2020-09-01', corriente: 0.1835, nomMensual: 0.01413813, nomMensualMora: 0.02046769 },  // cor 1.4138% | mora 2.0468%
  { desde: '2020-10-01', corriente: 0.1809, nomMensual: 0.01395229, nomMensualMora: 0.02020727 },  // cor 1.3952% | mora 2.0207%
  { desde: '2020-11-01', corriente: 0.1784, nomMensual: 0.01377324, nomMensualMora: 0.01995617 },  // cor 1.3773% | mora 1.9956%
  { desde: '2020-12-01', corriente: 0.1746, nomMensual: 0.01350042, nomMensualMora: 0.01957319 },  // cor 1.3500% | mora 1.9573%
  { desde: '2021-01-01', corriente: 0.1732, nomMensual: 0.0133997, nomMensualMora: 0.0194317 },  // cor 1.3400% | mora 1.9432%
  { desde: '2021-02-01', corriente: 0.1754, nomMensual: 0.01355792, nomMensualMora: 0.01965395 },  // cor 1.3558% | mora 1.9654%
  { desde: '2021-03-01', corriente: 0.1741, nomMensual: 0.01346446, nomMensualMora: 0.01952268 },  // cor 1.3464% | mora 1.9523%
  { desde: '2021-04-01', corriente: 0.1731, nomMensual: 0.01339251, nomMensualMora: 0.01942158 },  // cor 1.3393% | mora 1.9422%
  { desde: '2021-05-01', corriente: 0.1722, nomMensual: 0.0133277, nomMensualMora: 0.0193305 },  // cor 1.3328% | mora 1.9330%
  { desde: '2021-06-01', corriente: 0.1721, nomMensual: 0.01332049, nomMensualMora: 0.01932037 },  // cor 1.3320% | mora 1.9320%
  { desde: '2021-07-01', corriente: 0.1718, nomMensual: 0.01329888, nomMensualMora: 0.01928998 },  // cor 1.3299% | mora 1.9290%
  { desde: '2021-08-01', corriente: 0.1724, nomMensual: 0.0133421, nomMensualMora: 0.01935074 },  // cor 1.3342% | mora 1.9351%
  { desde: '2021-09-01', corriente: 0.1719, nomMensual: 0.01330608, nomMensualMora: 0.01930011 },  // cor 1.3306% | mora 1.9300%
  { desde: '2021-10-01', corriente: 0.1708, nomMensual: 0.01322679, nomMensualMora: 0.01918863 },  // cor 1.3227% | mora 1.9189%
  { desde: '2021-11-01', corriente: 0.1727, nomMensual: 0.01336371, nomMensualMora: 0.01938111 },  // cor 1.3364% | mora 1.9381%
  { desde: '2021-12-01', corriente: 0.1746, nomMensual: 0.01350042, nomMensualMora: 0.01957319 },  // cor 1.3500% | mora 1.9573%
  { desde: '2022-01-01', corriente: 0.1766, nomMensual: 0.01364411, nomMensualMora: 0.01977496 },  // cor 1.3644% | mora 1.9775%
  { desde: '2022-02-01', corriente: 0.183, nomMensual: 0.01410242, nomMensualMora: 0.02041767 },  // cor 1.4102% | mora 2.0418%
  { desde: '2022-03-01', corriente: 0.1847, nomMensual: 0.01422378, nomMensualMora: 0.02058764 },  // cor 1.4224% | mora 2.0588%
  { desde: '2022-04-01', corriente: 0.1905, nomMensual: 0.01463662, nomMensualMora: 0.02116522 },  // cor 1.4637% | mora 2.1165%
  { desde: '2022-05-01', corriente: 0.1971, nomMensual: 0.01510416, nomMensualMora: 0.02181812 },  // cor 1.5104% | mora 2.1818%
  { desde: '2022-06-01', corriente: 0.204, nomMensual: 0.01559044, nomMensualMora: 0.02249583 },  // cor 1.5590% | mora 2.2496%
  { desde: '2022-07-01', corriente: 0.2128, nomMensual: 0.01620693, nomMensualMora: 0.02335304 },  // cor 1.6207% | mora 2.3353%
  { desde: '2022-08-01', corriente: 0.2221, nomMensual: 0.01685401, nomMensualMora: 0.02425046 },  // cor 1.6854% | mora 2.4250%
  { desde: '2022-09-01', corriente: 0.235, nomMensual: 0.01774413, nomMensualMora: 0.02548112 },  // cor 1.7744% | mora 2.5481%
  { desde: '2022-10-01', corriente: 0.2461, nomMensual: 0.01850326, nomMensualMora: 0.02652721 },  // cor 1.8503% | mora 2.6527%
  { desde: '2022-11-01', corriente: 0.2578, nomMensual: 0.01929674, nomMensualMora: 0.02761729 },  // cor 1.9297% | mora 2.7617%
  { desde: '2022-12-01', corriente: 0.2764, nomMensual: 0.02054434, nomMensualMora: 0.02932448 },  // cor 2.0544% | mora 2.9324%
  { desde: '2023-01-01', corriente: 0.2884, nomMensual: 0.02134044, nomMensualMora: 0.03040959 },  // cor 2.1340% | mora 3.0410%
  { desde: '2023-02-01', corriente: 0.3018, nomMensual: 0.02222141, nomMensualMora: 0.03160662 },  // cor 2.2221% | mora 3.1607%
  { desde: '2023-03-01', corriente: 0.3084, nomMensual: 0.02265227, nomMensualMora: 0.03219063 },  // cor 2.2652% | mora 3.2191%
  { desde: '2023-04-01', corriente: 0.3139, nomMensual: 0.02300981, nomMensualMora: 0.03267455 },  // cor 2.3010% | mora 3.2675%
  { desde: '2023-05-01', corriente: 0.3027, nomMensual: 0.02228028, nomMensualMora: 0.03168647 },  // cor 2.2280% | mora 3.1686%
  { desde: '2023-06-01', corriente: 0.2976, nomMensual: 0.02194618, nomMensualMora: 0.03123307 },  // cor 2.1946% | mora 3.1233%
  { desde: '2023-07-01', corriente: 0.2936, nomMensual: 0.0216833, nomMensualMora: 0.03087593 },  // cor 2.1683% | mora 3.0876%
  { desde: '2023-08-01', corriente: 0.2875, nomMensual: 0.02128096, nomMensualMora: 0.03032864 },  // cor 2.1281% | mora 3.0329%
  { desde: '2023-09-01', corriente: 0.2803, nomMensual: 0.02080382, nomMensualMora: 0.02967852 },  // cor 2.0804% | mora 2.9679%
  { desde: '2023-10-01', corriente: 0.2653, nomMensual: 0.01980183, nomMensualMora: 0.02830943 },  // cor 1.9802% | mora 2.8309%
  { desde: '2023-11-01', corriente: 0.2552, nomMensual: 0.01912099, nomMensualMora: 0.02737615 },  // cor 1.9121% | mora 2.7376%
  { desde: '2023-12-01', corriente: 0.2504, nomMensual: 0.01879567, nomMensualMora: 0.02692932 },  // cor 1.8796% | mora 2.6929%
  { desde: '2024-01-01', corriente: 0.2332, nomMensual: 0.01762044, nomMensualMora: 0.02531037 },  // cor 1.7620% | mora 2.5310%
  { desde: '2024-02-01', corriente: 0.2331, nomMensual: 0.01761357, nomMensualMora: 0.02530088 },  // cor 1.7614% | mora 2.5301%
  { desde: '2024-03-01', corriente: 0.222, nomMensual: 0.01684707, nomMensualMora: 0.02424086 },  // cor 1.6847% | mora 2.4241%
  { desde: '2024-04-01', corriente: 0.2206, nomMensual: 0.01674995, nomMensualMora: 0.0241063 },  // cor 1.6750% | mora 2.4106%
  { desde: '2024-05-01', corriente: 0.2102, nomMensual: 0.01602522, nomMensualMora: 0.0231006 },  // cor 1.6025% | mora 2.3101%
  { desde: '2024-06-01', corriente: 0.2056, nomMensual: 0.01570284, nomMensualMora: 0.02265227 },  // cor 1.5703% | mora 2.2652%
  { desde: '2024-07-01', corriente: 0.1966, nomMensual: 0.01506883, nomMensualMora: 0.02176882 },  // cor 1.5069% | mora 2.1769%
  { desde: '2024-08-01', corriente: 0.1947, nomMensual: 0.01493442, nomMensualMora: 0.02158123 },  // cor 1.4934% | mora 2.1581%
  { desde: '2024-09-01', corriente: 0.1923, nomMensual: 0.01476436, nomMensualMora: 0.02134374 },  // cor 1.4764% | mora 2.1344%
  { desde: '2024-10-01', corriente: 0.1878, nomMensual: 0.01444466, nomMensualMora: 0.02089679 },  // cor 1.4445% | mora 2.0897%
  { desde: '2024-11-01', corriente: 0.1759, nomMensual: 0.01359384, nomMensualMora: 0.01970439 },  // cor 1.3594% | mora 1.9704%
  { desde: '2024-12-01', corriente: 0.1659, nomMensual: 0.01287275, nomMensualMora: 0.01869037 },  // cor 1.2873% | mora 1.8690%
  { desde: '2025-01-01', corriente: 0.1659, nomMensual: 0.01287275, nomMensualMora: 0.01869037 },  // cor 1.2873% | mora 1.8690%
  { desde: '2025-02-01', corriente: 0.1753, nomMensual: 0.01355074, nomMensualMora: 0.01964386 },  // cor 1.3551% | mora 1.9644%
  { desde: '2025-03-01', corriente: 0.1661, nomMensual: 0.01288723, nomMensualMora: 0.01871076 },  // cor 1.2887% | mora 1.8711%
  { desde: '2025-04-01', corriente: 0.1708, nomMensual: 0.01322679, nomMensualMora: 0.01918863 },  // cor 1.3227% | mora 1.9189%
  { desde: '2025-05-01', corriente: 0.1731, nomMensual: 0.01339251, nomMensualMora: 0.01942158 },  // cor 1.3393% | mora 1.9422%
  { desde: '2025-06-01', corriente: 0.1703, nomMensual: 0.01319073, nomMensualMora: 0.01913791 },  // cor 1.3191% | mora 1.9138%
  { desde: '2025-07-01', corriente: 0.1652, nomMensual: 0.01282206, nomMensualMora: 0.01861897 },  // cor 1.2822% | mora 1.8619%
  { desde: '2025-08-01', corriente: 0.1678, nomMensual: 0.01301019, nomMensualMora: 0.01888389 },  // cor 1.3010% | mora 1.8884%
  { desde: '2025-09-01', corriente: 0.1667, nomMensual: 0.01293064, nomMensualMora: 0.0187719 },  // cor 1.2931% | mora 1.8772%
  { desde: '2025-10-01', corriente: 0.1624, nomMensual: 0.01261902, nomMensualMora: 0.01833283 },  // cor 1.2619% | mora 1.8333%
  { desde: '2025-11-01', corriente: 0.1666, nomMensual: 0.01292341, nomMensualMora: 0.01876172 },  // cor 1.2923% | mora 1.8762%
  { desde: '2025-12-01', corriente: 0.1668, nomMensual: 0.01293788, nomMensualMora: 0.01878209 },  // cor 1.2938% | mora 1.8782%
  { desde: '2026-01-01', corriente: 0.1624, nomMensual: 0.01261902, nomMensualMora: 0.01833283 },  // cor 1.2619% | mora 1.8333%
  { desde: '2026-02-01', corriente: 0.1682, nomMensual: 0.0130391, nomMensualMora: 0.01892458 },  // cor 1.3039% | mora 1.8925%
  { desde: '2026-03-01', corriente: 0.1701, nomMensual: 0.0131763, nomMensualMora: 0.01911761 },  // cor 1.3176% | mora 1.9118%
  { desde: '2026-04-01', corriente: 0.1784, nomMensual: 0.01377324, nomMensualMora: 0.01995617 },  // cor 1.3773% | mora 1.9956%
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
  // Cortes por: fin de mes calendario + cambios de tasa + fechas de abonos
  // El período va desde fechaInicio hasta fechaFin INCLUSIVE
 
  var capital    = capitalOriginal;
  var interesAcum = 0;
  var lineas     = [];
 
  // Función: último día del mes de una fecha
  function ultimoDiaMes(d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  }
 
  // Función: primer día del mes siguiente
  function primerDiaSigMes(d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 1);
  }
 
  // Construir lista de fechas de corte (todas son el ÚLTIMO día de algún período)
  var fechasCorte = [];
 
  // Cortes por fin de mes calendario entre fechaInicio y fechaFin
  var mesIter = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
  while (mesIter <= fechaFin) {
    var finMes = ultimoDiaMes(mesIter);
    if (finMes < fechaFin) {
      fechasCorte.push(new Date(finMes.getTime()));
    }
    mesIter = primerDiaSigMes(mesIter);
  }
  fechasCorte.push(new Date(fechaFin.getTime())); // siempre termina en fechaFin
 
  // Cortes adicionales por cambios de tasa IBC (si ocurren a mitad de mes)
  if (tipoInteres !== "CIVIL") {
    for (var t = 0; t < TASAS_IBC.length; t++) {
      var fCorte = parseFecha(TASAS_IBC[t].desde);
      // El corte va el día ANTERIOR al cambio de tasa
      var fCorteAntes = new Date(fCorte.getFullYear(), fCorte.getMonth(), fCorte.getDate() - 1);
      if (fCorteAntes > fechaInicio && fCorteAntes < fechaFin) {
        fechasCorte.push(fCorteAntes);
      }
    }
  }
 
  // Cortes por abonos
  for (var a = 0; a < abonos.length; a++) {
    fechasCorte.push(new Date(abonos[a].fecha.getTime()));
  }
 
  // Ordenar y deduplicar
  fechasCorte.sort(function(a, b){ return a - b; });
  var cortesUnicos = [];
  var prevMs = -1;
  for (var cc = 0; cc < fechasCorte.length; cc++) {
    var ms = fechasCorte[cc].getTime();
    if (ms >= fechaInicio.getTime() && ms !== prevMs) {
      cortesUnicos.push(fechasCorte[cc]);
      prevMs = ms;
    }
  }
 
  // ── 4. LOOP DE LIQUIDACIÓN ─────────────────────────────────────────────────
  var desdeTramo = new Date(fechaInicio.getTime());
 
  for (var ci = 0; ci < cortesUnicos.length; ci++) {
    var hastaTramo = cortesUnicos[ci];
    if (hastaTramo.getTime() < desdeTramo.getTime()) continue;
 
    // Días: inclusivo en ambos extremos (Fin - Ini + 1)
    var nDias = diasEntreFechas(desdeTramo, hastaTramo) + 1;
 
    // ── Tasa según modalidad ──
    var teaIBC       = 0;
    var teaAplicada  = 0;
    var tasaDiaria   = 0;
    var tasaMensual  = 0;
    var interesTramo = 0;
 
    if (tipoInteres === "CIVIL") {
      // Interés civil 6% EA — Art. 1617 C.C. — interés simple proporcional
      // Fórmula: capital × (0.06/12) × (días/30)
      teaIBC       = 0.06;
      teaAplicada  = 0.06;
      tasaMensual  = 0.06 / 12;         // 0.5% mensual fijo en decimal
      tasaDiaria   = tasaMensual / 30;
      interesTramo = capital * tasaMensual * (nDias / 30);
 
    } else {
      // CORRIENTE o MORATORIO — IBC SFC
      // Fórmula: capital × tasaMensual × (días/30)
      // CORRIENTE: tasaMensual = CorPct/12  (nomMensual del archivo)
      // MORATORIO: tasaMensual = MoraNom/12 (nomMensualMora del archivo)
      var ibcData  = obtenerIBCData(desdeTramo);
      teaIBC       = ibcData.tea;
      teaAplicada  = teaIBC;
      tasaMensual  = (tipoInteres === "MORATORIO")
                     ? ibcData.nomMensualMora   // MoraNom/12
                     : ibcData.nomMensual;       // CorPct/12
      tasaDiaria   = tasaMensual / 30;
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
      diasAnio:     esBisiesto(desdeTramo.getFullYear()) ? 366 : 365,
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
 
  // ── 5. GENERAR HTML Y DEVOLVER COMO STRING ─────────────────────────────────
  var etiquetaTipo = {
    "CIVIL":     "CIVIL (6% EA — Art. 1617 C.C.)",
    "CORRIENTE": "CORRIENTE (IBC SFC)",
    "MORATORIO": "MORATORIO (IBC x 1.5 — Art. 884 C.Co)"
  }[tipoInteres];
 
  var intFinal  = Math.round(interesAcum * 100) / 100;
  var capFinal  = Math.round(capital * 100) / 100;
  var granTotal = capFinal + intFinal + agencias + costas;
 
  function fmt(n) {
    return '$ ' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  function fmtPct(n) {
    return (n * 100).toFixed(6) + '%';
  }
  function fmtDate(d) {
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    var yy = d.getFullYear();
    return (dd < 10 ? '0'+dd : dd) + '/' + (mm < 10 ? '0'+mm : mm) + '/' + yy;
  }
 
  // Filas de la tabla
  var filas = lineas.map(function(l) {
    var abono   = l.abono    > 0 ? fmt(l.abono)    : '-';
    var aInt    = l.abonoAInt > 0 ? fmt(l.abonoAInt) : '-';
    var aCap    = l.abonoACap > 0 ? fmt(l.abonoACap) : '-';
    return '<tr>' +
      '<td>' + fmtDate(l.desde) + '</td>' +
      '<td>' + fmtDate(l.hasta) + '</td>' +
      '<td class="num">' + l.dias + '</td>' +
      '<td class="num">' + (l.tasaMensual * 100).toFixed(6) + '%</td>' +
      '<td class="num">' + fmt(l.capitalBase) + '</td>' +
      '<td class="num">' + fmt(l.interesTramo) + '</td>' +
      '<td class="num">' + abono + '</td>' +
      '<td class="num">' + aInt + '</td>' +
      '<td class="num">' + aCap + '</td>' +
      '<td class="num">' + fmt(l.saldoInteres) + '</td>' +
      '<td class="num">' + fmt(l.saldoCapital) + '</td>' +
    '</tr>';
  }).join('\n');
 
  // Filas resumen
  var resumenFilas = '<tr class="subtotal"><td colspan="9" class="lbl">Capital final</td><td colspan="2" class="num">' + fmt(capFinal) + '</td></tr>' +
    '<tr class="subtotal"><td colspan="9" class="lbl">Intereses</td><td colspan="2" class="num">' + fmt(intFinal) + '</td></tr>';
  if (agencias > 0) resumenFilas += '<tr class="subtotal"><td colspan="9" class="lbl">Agencias en costas</td><td colspan="2" class="num">' + fmt(agencias) + '</td></tr>';
  if (costas   > 0) resumenFilas += '<tr class="subtotal"><td colspan="9" class="lbl">Costas judiciales</td><td colspan="2" class="num">' + fmt(costas) + '</td></tr>';
  resumenFilas += '<tr class="total"><td colspan="9" class="lbl">GRAN TOTAL</td><td colspan="2" class="num">' + fmt(granTotal) + '</td></tr>';
 
  var fechaGenerado = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "d/M/yyyy, HH:mm:ss");
 
  var html = '<!DOCTYPE html><html><head><meta charset="utf-8">' +
  '<title>Liquidacion de Intereses</title>' +
  '<style>' +
    'body{font-family:Arial,sans-serif;font-size:11px;color:#222;margin:20px}' +
    'h2{font-size:16px;margin-bottom:4px}' +
    '.meta{margin-bottom:18px;font-size:11px}' +
    '.meta td{padding:3px 10px 3px 0}' +
    '.meta td:first-child{font-weight:bold;color:#555}' +
    'table.datos{width:100%;border-collapse:collapse;margin-top:12px}' +
    'table.datos th{background:#1a3a5c;color:white;padding:5px 6px;text-align:center;font-size:10px}' +
    'table.datos td{padding:4px 6px;border-bottom:1px solid #e0e0e0;font-size:10px}' +
    'table.datos tr:nth-child(even){background:#f5f8fc}' +
    '.num{text-align:right}' +
    '.lbl{text-align:right;font-weight:bold;padding-right:12px}' +
    'tr.subtotal td{border-top:1px solid #bbb;background:#eaf3de;font-weight:bold}' +
    'tr.total td{border-top:2px solid #2d5240;background:#d4efdf;font-weight:bold;font-size:11px}' +
    '.footer{margin-top:10px;font-size:9px;color:#888}' +
    '@media print{body{margin:8px}button{display:none}}' +
  '</style></head><body>' +
  '<h2>Liquidacion de Intereses</h2>' +
  '<p class="footer">Generado: ' + fechaGenerado + '</p>' +
  '<table class="meta">' +
    '<tr><td>Tipo de interes aplicado</td><td>' + etiquetaTipo + '</td></tr>' +
    '<tr><td>Capital</td><td>' + fmt(capitalOriginal) + '</td></tr>' +
    '<tr><td>Fecha inicio mora</td><td>' + fmtDate(fechaInicio) + '</td></tr>' +
    '<tr><td>Fecha de pago</td><td>' + fmtDate(fechaFin) + '</td></tr>' +
    '<tr><td>Dias de mora liquidados</td><td>' + diasEntreFechas(fechaInicio, fechaFin) + '</td></tr>' +
    '<tr><td>Intereses liquidados</td><td>' + fmt(intFinal) + '</td></tr>' +
    '<tr><td>Deuda total</td><td>' + fmt(granTotal) + '</td></tr>' +
  '</table>' +
  '<table class="datos">' +
    '<thead><tr>' +
      '<th>Desde</th><th>Hasta</th><th>Dias</th><th>Tasa Mens (%)</th>' +
      '<th>Capital base</th><th>Interes</th>' +
      '<th>Abono</th><th>A intereses</th><th>A capital</th>' +
      '<th>Saldo intereses</th><th>Saldo capital</th>' +
    '</tr></thead>' +
    '<tbody>' + filas + '</tbody>' +
    '<tfoot>' + resumenFilas + '</tfoot>' +
  '</table>' +
  '<p class="footer">Fuente tasas IBC: Superintendencia Financiera de Colombia — superfinanciera.gov.co</p>' +
  '</body></html>';
 
  return html;
}
 
// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
 
function obtenerIBCData(fecha) {
  // Devuelve { tea, nomMensual: CorPct/12/100, nomMensualMora: MoraNom/12/100 }
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
      ". Actualice la tabla TASAS_IBC con la certificacion de la SFC.\n" +
      "Fuente: https://www.superfinanciera.gov.co/publicaciones/10829/"
    );
  }
  return {
    tea:            entrada.corriente,
    nomMensual:     entrada.nomMensual,
    nomMensualMora: entrada.nomMensualMora
  };
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
