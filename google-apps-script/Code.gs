// ⚖️ LIQUIDADOR JUDICIAL PRO — v4.0
// CIVIL:     6% EA, interés simple — capital × (0.06/12) × (días/30)
// CORRIENTE: IBC SFC — capital × (CorPct/12) × (días/30)
// MORATORIO: IBC×1.5 SFC — capital × (MoraNom/12) × (días/30)
// Fuente tasas: https://www.superfinanciera.gov.co/publicaciones/10829/

// ── TABLA IBC ────────────────────────────────────────────────────────────────
// nomMensual     = CorPct  / 100 / 12  (corriente mensual decimal)
// nomMensualMora = MoraNom / 100 / 12  (mora mensual decimal)
// Añadir cada mes: { desde: 'AAAA-MM-DD', corriente: X, nomMensual: X, nomMensualMora: X }
var TASAS_IBC = [
  { desde: '2018-01-01', corriente: 0.2069, nomMensual: 0.01579406, nomMensualMora: 0.02277919 },
  { desde: '2018-02-01', corriente: 0.2101, nomMensual: 0.01601822, nomMensualMora: 0.02309087 },
  { desde: '2018-03-01', corriente: 0.2068, nomMensual: 0.01578704, nomMensualMora: 0.02276944 },
  { desde: '2018-04-01', corriente: 0.2048, nomMensual: 0.01564666, nomMensualMora: 0.02257408 },
  { desde: '2018-05-01', corriente: 0.2044, nomMensual: 0.01561855, nomMensualMora: 0.02253496 },
  { desde: '2018-06-01', corriente: 0.2028, nomMensual: 0.01550606, nomMensualMora: 0.02237832 },
  { desde: '2018-07-01', corriente: 0.2003, nomMensual: 0.01533, nomMensualMora: 0.02213303 },
  { desde: '2018-08-01', corriente: 0.1994, nomMensual: 0.01526654, nomMensualMora: 0.02204457 },
  { desde: '2018-09-01', corriente: 0.1981, nomMensual: 0.0151748, nomMensualMora: 0.02191665 },
  { desde: '2018-10-01', corriente: 0.1963, nomMensual: 0.01504762, nomMensualMora: 0.02173922 },
  { desde: '2018-11-01', corriente: 0.1949, nomMensual: 0.01494858, nomMensualMora: 0.021601 },
  { desde: '2018-12-01', corriente: 0.194, nomMensual: 0.01488485, nomMensualMora: 0.02151203 },
  { desde: '2019-01-01', corriente: 0.1916, nomMensual: 0.0147147, nomMensualMora: 0.02127435 },
  { desde: '2019-02-01', corriente: 0.197, nomMensual: 0.0150971, nomMensualMora: 0.02180826 },
  { desde: '2019-03-01', corriente: 0.1937, nomMensual: 0.0148636, nomMensualMora: 0.02148235 },
  { desde: '2019-04-01', corriente: 0.1932, nomMensual: 0.01482817, nomMensualMora: 0.02143287 },
  { desde: '2019-05-01', corriente: 0.1934, nomMensual: 0.01484235, nomMensualMora: 0.02145267 },
  { desde: '2019-06-01', corriente: 0.193, nomMensual: 0.014814, nomMensualMora: 0.02141307 },
  { desde: '2019-07-01', corriente: 0.1928, nomMensual: 0.01479982, nomMensualMora: 0.02139327 },
  { desde: '2019-08-01', corriente: 0.1932, nomMensual: 0.01482817, nomMensualMora: 0.02143287 },
  { desde: '2019-09-01', corriente: 0.1932, nomMensual: 0.01482817, nomMensualMora: 0.02143287 },
  { desde: '2019-10-01', corriente: 0.191, nomMensual: 0.01467212, nomMensualMora: 0.02121484 },
  { desde: '2019-11-01', corriente: 0.1903, nomMensual: 0.01462241, nomMensualMora: 0.02114536 },
  { desde: '2019-12-01', corriente: 0.1891, nomMensual: 0.01453713, nomMensualMora: 0.02102613 },
  { desde: '2020-01-01', corriente: 0.1877, nomMensual: 0.01443754, nomMensualMora: 0.02088684 },
  { desde: '2020-02-01', corriente: 0.1906, nomMensual: 0.01464372, nomMensualMora: 0.02117514 },
  { desde: '2020-03-01', corriente: 0.1895, nomMensual: 0.01456557, nomMensualMora: 0.02106589 },
  { desde: '2020-04-01', corriente: 0.1869, nomMensual: 0.01438059, nomMensualMora: 0.02080714 },
  { desde: '2020-05-01', corriente: 0.1819, nomMensual: 0.01402381, nomMensualMora: 0.02030752 },
  { desde: '2020-06-01', corriente: 0.1812, nomMensual: 0.01397375, nomMensualMora: 0.02023735 },
  { desde: '2020-07-01', corriente: 0.1812, nomMensual: 0.01397375, nomMensualMora: 0.02023735 },
  { desde: '2020-08-01', corriente: 0.1829, nomMensual: 0.01409528, nomMensualMora: 0.02040766 },
  { desde: '2020-09-01', corriente: 0.1835, nomMensual: 0.01413813, nomMensualMora: 0.02046769 },
  { desde: '2020-10-01', corriente: 0.1809, nomMensual: 0.01395229, nomMensualMora: 0.02020727 },
  { desde: '2020-11-01', corriente: 0.1784, nomMensual: 0.01377324, nomMensualMora: 0.01995617 },
  { desde: '2020-12-01', corriente: 0.1746, nomMensual: 0.01350042, nomMensualMora: 0.01957319 },
  { desde: '2021-01-01', corriente: 0.1732, nomMensual: 0.0133997, nomMensualMora: 0.0194317 },
  { desde: '2021-02-01', corriente: 0.1754, nomMensual: 0.01355792, nomMensualMora: 0.01965395 },
  { desde: '2021-03-01', corriente: 0.1741, nomMensual: 0.01346446, nomMensualMora: 0.01952268 },
  { desde: '2021-04-01', corriente: 0.1731, nomMensual: 0.01339251, nomMensualMora: 0.01942158 },
  { desde: '2021-05-01', corriente: 0.1722, nomMensual: 0.0133277, nomMensualMora: 0.0193305 },
  { desde: '2021-06-01', corriente: 0.1721, nomMensual: 0.01332049, nomMensualMora: 0.01932037 },
  { desde: '2021-07-01', corriente: 0.1718, nomMensual: 0.01329888, nomMensualMora: 0.01928998 },
  { desde: '2021-08-01', corriente: 0.1724, nomMensual: 0.0133421, nomMensualMora: 0.01935074 },
  { desde: '2021-09-01', corriente: 0.1719, nomMensual: 0.01330608, nomMensualMora: 0.01930011 },
  { desde: '2021-10-01', corriente: 0.1708, nomMensual: 0.01322679, nomMensualMora: 0.01918863 },
  { desde: '2021-11-01', corriente: 0.1727, nomMensual: 0.01336371, nomMensualMora: 0.01938111 },
  { desde: '2021-12-01', corriente: 0.1746, nomMensual: 0.01350042, nomMensualMora: 0.01957319 },
  { desde: '2022-01-01', corriente: 0.1766, nomMensual: 0.01364411, nomMensualMora: 0.01977496 },
  { desde: '2022-02-01', corriente: 0.183, nomMensual: 0.01410242, nomMensualMora: 0.02041767 },
  { desde: '2022-03-01', corriente: 0.1847, nomMensual: 0.01422378, nomMensualMora: 0.02058764 },
  { desde: '2022-04-01', corriente: 0.1905, nomMensual: 0.01463662, nomMensualMora: 0.02116522 },
  { desde: '2022-05-01', corriente: 0.1971, nomMensual: 0.01510416, nomMensualMora: 0.02181812 },
  { desde: '2022-06-01', corriente: 0.204, nomMensual: 0.01559044, nomMensualMora: 0.02249583 },
  { desde: '2022-07-01', corriente: 0.2128, nomMensual: 0.01620693, nomMensualMora: 0.02335304 },
  { desde: '2022-08-01', corriente: 0.2221, nomMensual: 0.01685401, nomMensualMora: 0.02425046 },
  { desde: '2022-09-01', corriente: 0.235, nomMensual: 0.01774413, nomMensualMora: 0.02548112 },
  { desde: '2022-10-01', corriente: 0.2461, nomMensual: 0.01850326, nomMensualMora: 0.02652721 },
  { desde: '2022-11-01', corriente: 0.2578, nomMensual: 0.01929674, nomMensualMora: 0.02761729 },
  { desde: '2022-12-01', corriente: 0.2764, nomMensual: 0.02054434, nomMensualMora: 0.02932448 },
  { desde: '2023-01-01', corriente: 0.2884, nomMensual: 0.02134044, nomMensualMora: 0.03040959 },
  { desde: '2023-02-01', corriente: 0.3018, nomMensual: 0.02222141, nomMensualMora: 0.03160662 },
  { desde: '2023-03-01', corriente: 0.3084, nomMensual: 0.02265227, nomMensualMora: 0.03219063 },
  { desde: '2023-04-01', corriente: 0.3139, nomMensual: 0.02300981, nomMensualMora: 0.03267455 },
  { desde: '2023-05-01', corriente: 0.3027, nomMensual: 0.02228028, nomMensualMora: 0.03168647 },
  { desde: '2023-06-01', corriente: 0.2976, nomMensual: 0.02194618, nomMensualMora: 0.03123307 },
  { desde: '2023-07-01', corriente: 0.2936, nomMensual: 0.0216833, nomMensualMora: 0.03087593 },
  { desde: '2023-08-01', corriente: 0.2875, nomMensual: 0.02128096, nomMensualMora: 0.03032864 },
  { desde: '2023-09-01', corriente: 0.2803, nomMensual: 0.02080382, nomMensualMora: 0.02967852 },
  { desde: '2023-10-01', corriente: 0.2653, nomMensual: 0.01980183, nomMensualMora: 0.02830943 },
  { desde: '2023-11-01', corriente: 0.2552, nomMensual: 0.01912099, nomMensualMora: 0.02737615 },
  { desde: '2023-12-01', corriente: 0.2504, nomMensual: 0.01879567, nomMensualMora: 0.02692932 },
  { desde: '2024-01-01', corriente: 0.2332, nomMensual: 0.01762044, nomMensualMora: 0.02531037 },
  { desde: '2024-02-01', corriente: 0.2331, nomMensual: 0.01761357, nomMensualMora: 0.02530088 },
  { desde: '2024-03-01', corriente: 0.222, nomMensual: 0.01684707, nomMensualMora: 0.02424086 },
  { desde: '2024-04-01', corriente: 0.2206, nomMensual: 0.01674995, nomMensualMora: 0.0241063 },
  { desde: '2024-05-01', corriente: 0.2102, nomMensual: 0.01602522, nomMensualMora: 0.0231006 },
  { desde: '2024-06-01', corriente: 0.2056, nomMensual: 0.01570284, nomMensualMora: 0.02265227 },
  { desde: '2024-07-01', corriente: 0.1966, nomMensual: 0.01506883, nomMensualMora: 0.02176882 },
  { desde: '2024-08-01', corriente: 0.1947, nomMensual: 0.01493442, nomMensualMora: 0.02158123 },
  { desde: '2024-09-01', corriente: 0.1923, nomMensual: 0.01476436, nomMensualMora: 0.02134374 },
  { desde: '2024-10-01', corriente: 0.1878, nomMensual: 0.01444466, nomMensualMora: 0.02089679 },
  { desde: '2024-11-01', corriente: 0.1759, nomMensual: 0.01359384, nomMensualMora: 0.01970439 },
  { desde: '2024-12-01', corriente: 0.1659, nomMensual: 0.01287275, nomMensualMora: 0.01869037 },
  { desde: '2025-01-01', corriente: 0.1659, nomMensual: 0.01287275, nomMensualMora: 0.01869037 },
  { desde: '2025-02-01', corriente: 0.1753, nomMensual: 0.01355074, nomMensualMora: 0.01964386 },
  { desde: '2025-03-01', corriente: 0.1661, nomMensual: 0.01288723, nomMensualMora: 0.01871076 },
  { desde: '2025-04-01', corriente: 0.1708, nomMensual: 0.01322679, nomMensualMora: 0.01918863 },
  { desde: '2025-05-01', corriente: 0.1731, nomMensual: 0.01339251, nomMensualMora: 0.01942158 },
  { desde: '2025-06-01', corriente: 0.1703, nomMensual: 0.01319073, nomMensualMora: 0.01913791 },
  { desde: '2025-07-01', corriente: 0.1652, nomMensual: 0.01282206, nomMensualMora: 0.01861897 },
  { desde: '2025-08-01', corriente: 0.1678, nomMensual: 0.01301019, nomMensualMora: 0.01888389 },
  { desde: '2025-09-01', corriente: 0.1667, nomMensual: 0.01293064, nomMensualMora: 0.0187719 },
  { desde: '2025-10-01', corriente: 0.1624, nomMensual: 0.01261902, nomMensualMora: 0.01833283 },
  { desde: '2025-11-01', corriente: 0.1666, nomMensual: 0.01292341, nomMensualMora: 0.01876172 },
  { desde: '2025-12-01', corriente: 0.1668, nomMensual: 0.01293788, nomMensualMora: 0.01878209 },
  { desde: '2026-01-01', corriente: 0.1624, nomMensual: 0.01261902, nomMensualMora: 0.01833283 },
  { desde: '2026-02-01', corriente: 0.1682, nomMensual: 0.0130391, nomMensualMora: 0.01892458 },
  { desde: '2026-03-01', corriente: 0.1701, nomMensual: 0.0131763, nomMensualMora: 0.01911761 },
  { desde: '2026-04-01', corriente: 0.1784, nomMensual: 0.01377324, nomMensualMora: 0.01995617 }
];

// ── ENTRY POINT ──────────────────────────────────────────────────────────────
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Liquidador Judicial Pro')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

// ── FUNCIÓN PRINCIPAL ─────────────────────────────────────────────────────────
function generarLiquidacionSheet(formulario) {

  // 1. VALIDACIÓN
  var capital = parseFloat(formulario.capital.replace(/\.\./g, '').replace(/\./g, ''));
  if (isNaN(capital) || capital <= 0)
    throw new Error('El capital debe ser un número positivo.');

  var tipo = formulario.tipoInteres;
  if (tipo !== 'CIVIL' && tipo !== 'CORRIENTE' && tipo !== 'MORATORIO')
    throw new Error('Tipo de interés inválido.');

  var agencias = formulario.agencias ? parseFloat(formulario.agencias.replace(/\./g, '')) : 0;
  var costas   = formulario.costas   ? parseFloat(formulario.costas.replace(/\./g, ''))   : 0;
  var capitalOriginal = capital;

  var pI = formulario.fechaInicio.split('-');
  var fechaInicio = new Date(+pI[0], +pI[1]-1, +pI[2]);
  var pF = formulario.fechaFin.split('-');
  var fechaFin    = new Date(+pF[0], +pF[1]-1, +pF[2]);

  if (fechaInicio > fechaFin)
    throw new Error('La fecha de inicio debe ser anterior a la fecha de pago.');

  // 2. ABONOS
  var abonos = [];
  if (formulario.abonoFecha && formulario.abonoValor) {
    var aF = Array.isArray(formulario.abonoFecha) ? formulario.abonoFecha : [formulario.abonoFecha];
    var aV = Array.isArray(formulario.abonoValor)  ? formulario.abonoValor  : [formulario.abonoValor];
    for (var i = 0; i < aF.length; i++) {
      if (!aF[i] || !aV[i]) continue;
      var pa = aF[i].split('-');
      var fa = new Date(+pa[0], +pa[1]-1, +pa[2]);
      if (fa < fechaInicio || fa > fechaFin)
        throw new Error('El abono del ' + aF[i] + ' está fuera del rango.');
      abonos.push({ fecha: fa, valor: parseFloat(aV[i].replace(/\./g, '')), aplicado: false });
    }
    abonos.sort(function(a,b){ return a.fecha - b.fecha; });
  }

  // 3. CORTES DE PERÍODO
  // Corte principal: último día de cada mes calendario
  // Cortes adicionales: fechas de abonos
  var cortes = [];

  // Último día de cada mes entre fechaInicio y fechaFin
  var m = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
  while (m <= fechaFin) {
    var ult = new Date(m.getFullYear(), m.getMonth() + 1, 0); // último día del mes
    if (ult.getTime() < fechaFin.getTime()) cortes.push(ult);
    m = new Date(m.getFullYear(), m.getMonth() + 1, 1);
  }
  cortes.push(new Date(fechaFin.getTime()));

  // Agregar fechas de abonos como cortes adicionales
  for (var a = 0; a < abonos.length; a++) {
    cortes.push(new Date(abonos[a].fecha.getTime()));
  }

  // Ordenar y deduplicar
  cortes.sort(function(a,b){ return a-b; });
  var cortesOk = [];
  var prev = -1;
  for (var k = 0; k < cortes.length; k++) {
    var ms = cortes[k].getTime();
    if (ms >= fechaInicio.getTime() && ms !== prev) {
      cortesOk.push(cortes[k]);
      prev = ms;
    }
  }

  // 4. LOOP DE LIQUIDACIÓN
  var desde      = new Date(fechaInicio.getTime());
  var interesAcum = 0;
  var lineas     = [];

  for (var ci = 0; ci < cortesOk.length; ci++) {
    var hasta = cortesOk[ci];
    if (hasta.getTime() < desde.getTime()) continue;

    // Días inclusive: Fin - Ini + 1
    var dias = Math.round((hasta.getTime() - desde.getTime()) / 86400000) + 1;

    // Tasa mensual según tipo
    var tasaMens;
    var ibcTea = 0;
    if (tipo === 'CIVIL') {
      tasaMens = 0.06 / 12;  // 0.5% mensual fijo
      ibcTea   = 0.06;
    } else {
      var ibc  = buscarIBC(desde);
      ibcTea   = ibc.corriente;
      tasaMens = (tipo === 'MORATORIO') ? ibc.nomMensualMora : ibc.nomMensual;
    }

    // Interés del tramo
    var interes = capital * tasaMens * (dias / 30);
    interesAcum += interes;

    // Aplicar abonos que vencen en esta fecha
    var abonoDia = 0, abInt = 0, abCap = 0;
    for (var a = 0; a < abonos.length; a++) {
      if (!abonos[a].aplicado && abonos[a].fecha.getTime() === hasta.getTime()) {
        abonoDia += abonos[a].valor;
        abonos[a].aplicado = true;
      }
    }
    if (abonoDia > 0) {
      if (abonoDia <= interesAcum) {
        abInt = abonoDia;
        interesAcum -= abInt;
      } else {
        abInt = interesAcum;
        interesAcum = 0;
        abCap = abonoDia - abInt;
        capital = Math.max(0, capital - abCap);
      }
    }

    lineas.push({
      desde:       desde,
      hasta:       hasta,
      dias:        dias,
      tasaMens:    tasaMens,
      ibcTea:      ibcTea,
      capitalBase: capital + abCap,
      interes:     interes,
      abono:       abonoDia,
      abInt:       abInt,
      abCap:       abCap,
      saldoInt:    interesAcum,
      saldoCap:    capital
    });

    if (capital <= 0) break;
    if (hasta.getTime() >= fechaFin.getTime()) break;
    desde = new Date(hasta.getFullYear(), hasta.getMonth(), hasta.getDate() + 1);
  }

  // 5. GENERAR HTML
  var etiqueta = {
    'CIVIL':     'Civil (6% EA — Art. 1617 C.C.)',
    'CORRIENTE': 'Corriente (IBC SFC)',
    'MORATORIO': 'Moratorio (IBC x 1.5 — Art. 884 C.Co)'
  }[tipo];

  var intFinal  = Math.round(interesAcum * 100) / 100;
  var capFinal  = Math.round(capital * 100) / 100;
  var granTotal = capFinal + intFinal + agencias + costas;
  var diasTotales = Math.round((fechaFin.getTime() - fechaInicio.getTime()) / 86400000) + 1;
  var fechaGen  = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'd/M/yyyy, HH:mm:ss');

  function fmt(n) {
    return '$ ' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  function fd(d) {
    var dd = d.getDate(), mm = d.getMonth()+1, yy = d.getFullYear();
    return (dd<10?'0'+dd:dd)+'/'+(mm<10?'0'+mm:mm)+'/'+yy;
  }

  var filas = lineas.map(function(l) {
    return '<tr>' +
      '<td>' + fd(l.desde) + '</td>' +
      '<td>' + fd(l.hasta) + '</td>' +
      '<td class="n">' + l.dias + '</td>' +
      '<td class="n">' + (l.tasaMens*100).toFixed(6) + '%</td>' +
      '<td class="n">' + fmt(l.capitalBase) + '</td>' +
      '<td class="n">' + fmt(l.interes) + '</td>' +
      '<td class="n">' + (l.abono  > 0 ? fmt(l.abono)  : '-') + '</td>' +
      '<td class="n">' + (l.abInt  > 0 ? fmt(l.abInt)  : '-') + '</td>' +
      '<td class="n">' + (l.abCap  > 0 ? fmt(l.abCap)  : '-') + '</td>' +
      '<td class="n">' + fmt(l.saldoInt) + '</td>' +
      '<td class="n">' + fmt(l.saldoCap) + '</td>' +
    '</tr>';
  }).join('');

  var tfoot = '<tr class="sub"><td colspan="9" class="r">Capital final</td><td colspan="2" class="n">' + fmt(capFinal) + '</td></tr>' +
    '<tr class="sub"><td colspan="9" class="r">Intereses</td><td colspan="2" class="n">' + fmt(intFinal) + '</td></tr>';
  if (agencias > 0) tfoot += '<tr class="sub"><td colspan="9" class="r">Agencias en costas</td><td colspan="2" class="n">' + fmt(agencias) + '</td></tr>';
  if (costas   > 0) tfoot += '<tr class="sub"><td colspan="9" class="r">Costas judiciales</td><td colspan="2" class="n">' + fmt(costas) + '</td></tr>';
  tfoot += '<tr class="tot"><td colspan="9" class="r">GRAN TOTAL</td><td colspan="2" class="n">' + fmt(granTotal) + '</td></tr>';

  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Liquidacion de Intereses</title>' +
  '<style>' +
    'body{font-family:Arial,sans-serif;font-size:11px;color:#111;margin:24px}' +
    'h2{font-size:15px;margin:0 0 4px}' +
    'p.gen{font-size:9px;color:#888;margin:0 0 14px}' +
    'table.res{border-collapse:collapse;margin-bottom:18px;width:480px}' +
    'table.res td{padding:3px 12px 3px 0;font-size:11px}' +
    'table.res td:first-child{font-weight:bold;color:#444;width:200px}' +
    'table.det{width:100%;border-collapse:collapse}' +
    'table.det th{background:#1a3a5c;color:#fff;padding:5px 6px;font-size:10px;text-align:center}' +
    'table.det td{padding:3px 6px;border-bottom:1px solid #ddd;font-size:10px}' +
    'table.det tr:nth-child(even) td{background:#f4f8fc}' +
    '.n{text-align:right} .r{text-align:right;font-weight:bold;padding-right:10px}' +
    'tr.sub td{background:#eaf3de;font-weight:bold;border-top:1px solid #aaa}' +
    'tr.tot td{background:#d4efdf;font-weight:bold;font-size:12px;border-top:2px solid #2d5240}' +
    'p.src{font-size:9px;color:#888;margin-top:8px}' +
    '@media print{button{display:none}}' +
  '</style></head><body>' +
  '<h2>Liquidacion de Intereses</h2>' +
  '<p class="gen">Generado: ' + fechaGen + '</p>' +
  '<table class="res">' +
    '<tr><td>Tipo de interes aplicado</td><td>' + etiqueta + '</td></tr>' +
    '<tr><td>Valor de la deuda</td><td>' + fmt(capitalOriginal) + '</td></tr>' +
    '<tr><td>Fecha en que inicio la mora</td><td>' + fd(fechaInicio) + '</td></tr>' +
    '<tr><td>Fecha pago</td><td>' + fd(fechaFin) + '</td></tr>' +
    '<tr><td>Dias de mora liquidados</td><td>' + diasTotales + ' dias</td></tr>' +
    '<tr><td>Intereses liquidados</td><td>' + fmt(intFinal) + '</td></tr>' +
    '<tr><td>Deuda total</td><td>' + fmt(granTotal) + '</td></tr>' +
  '</table>' +
  '<table class="det">' +
    '<thead><tr>' +
      '<th>Desde</th><th>Hasta</th><th>Dias</th><th>Tasa Mens %</th>' +
      '<th>Capital base</th><th>Interes</th>' +
      '<th>Abono</th><th>A intereses</th><th>A capital</th>' +
      '<th>Saldo intereses</th><th>Saldo capital</th>' +
    '</tr></thead>' +
    '<tbody>' + filas + '</tbody>' +
    '<tfoot>' + tfoot + '</tfoot>' +
  '</table>' +
  '<p class="src">Fuente tasas IBC: Superintendencia Financiera de Colombia — superfinanciera.gov.co</p>' +
  '</body></html>';

  return html;
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

function buscarIBC(fecha) {
  var ms = fecha.getTime();
  var entrada = null;
  for (var i = 0; i < TASAS_IBC.length; i++) {
    var p = TASAS_IBC[i].desde.split('-');
    var f = new Date(+p[0], +p[1]-1, +p[2]);
    if (f.getTime() <= ms) {
      entrada = TASAS_IBC[i];
    } else {
      break;
    }
  }
  if (!entrada) {
    throw new Error(
      'No hay tasa IBC para la fecha ' + fecha.toLocaleDateString('es-CO') +
      '. Actualice TASAS_IBC con la certificacion SFC. ' +
      'Fuente: https://www.superfinanciera.gov.co/publicaciones/10829/'
    );
  }
  return entrada;
}

function parseFecha(str) {
  var p = str.split('-');
  return new Date(+p[0], +p[1]-1, +p[2]);
}

function diasEntreFechas(d1, d2) {
  return Math.round((d2.getTime() - d1.getTime()) / 86400000);
}

function esBisiesto(anio) {
  return (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);
}

// ── MANTENIMIENTO ─────────────────────────────────────────────────────────────

function verificarCobertura(ini, fin) {
  try {
    buscarIBC(parseFecha(ini));
    buscarIBC(parseFecha(fin));
    Logger.log('OK: cobertura ' + ini + ' a ' + fin);
  } catch(e) { Logger.log('ERROR: ' + e.message); }
}
