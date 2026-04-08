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
// Actualizar cuando la SFC certifique nuevos períodos (cada ~2 meses)
// Formato: { desde: "AAAA-MM-DD", corriente: TEA_decimal }
// usura = corriente × 1.5 (calculado automáticamente)
var TASAS_IBC = [
  // 2018
  { desde: "2018-01-01", corriente: 0.1953 },
  { desde: "2018-03-01", corriente: 0.1953 },
  { desde: "2018-05-01", corriente: 0.1920 },
  { desde: "2018-07-01", corriente: 0.1883 },
  { desde: "2018-09-01", corriente: 0.1870 },
  { desde: "2018-11-01", corriente: 0.1870 },
  // 2019
  { desde: "2019-01-01", corriente: 0.1853 },
  { desde: "2019-03-01", corriente: 0.1830 },
  { desde: "2019-05-01", corriente: 0.1802 },
  { desde: "2019-07-01", corriente: 0.1763 },
  { desde: "2019-09-01", corriente: 0.1733 },
  { desde: "2019-11-01", corriente: 0.1710 },
  // 2020
  { desde: "2020-01-01", corriente: 0.1697 },
  { desde: "2020-03-01", corriente: 0.1680 },
  { desde: "2020-05-01", corriente: 0.1660 },
  { desde: "2020-07-01", corriente: 0.1637 },
  { desde: "2020-09-01", corriente: 0.1607 },
  { desde: "2020-11-01", corriente: 0.1570 },
  // 2021
  { desde: "2021-01-01", corriente: 0.1530 },
  { desde: "2021-03-01", corriente: 0.1498 },
  { desde: "2021-05-01", corriente: 0.1467 },
  { desde: "2021-07-01", corriente: 0.1443 },
  { desde: "2021-09-01", corriente: 0.1430 },
  { desde: "2021-11-01", corriente: 0.1430 },
  // 2022
  { desde: "2022-01-01", corriente: 0.1446 },
  { desde: "2022-03-01", corriente: 0.1480 },
  { desde: "2022-05-01", corriente: 0.1552 },
  { desde: "2022-07-01", corriente: 0.1686 },
  { desde: "2022-09-01", corriente: 0.1895 },
  { desde: "2022-11-01", corriente: 0.2116 },
  // 2023
  { desde: "2023-01-01", corriente: 0.2323 },
  { desde: "2023-03-01", corriente: 0.2537 },
  { desde: "2023-05-01", corriente: 0.2700 },
  { desde: "2023-07-01", corriente: 0.2786 },
  { desde: "2023-09-01", corriente: 0.2786 },
  { desde: "2023-11-01", corriente: 0.2786 },
  // 2024
  { desde: "2024-01-01", corriente: 0.2771 },
  { desde: "2024-03-01", corriente: 0.2697 },
  { desde: "2024-05-01", corriente: 0.2558 },
  { desde: "2024-07-01", corriente: 0.2406 },
  { desde: "2024-09-01", corriente: 0.2271 },
  { desde: "2024-11-01", corriente: 0.2162 },
  // 2025
  { desde: "2025-01-01", corriente: 0.2083 },
  { desde: "2025-03-01", corriente: 0.2018 },
  { desde: "2025-05-01", corriente: 0.1972 },
  { desde: "2025-07-01", corriente: 0.1938 },
  { desde: "2025-09-01", corriente: 0.1912 },
  { desde: "2025-11-01", corriente: 0.1894 },
  // 2026 — actualizar cuando la SFC certifique nuevos períodos
  { desde: "2026-01-01", corriente: 0.1953 },
  { desde: "2026-03-01", corriente: 0.2040 }
  // ← Añadir aquí: { desde: "2026-05-01", corriente: 0.XXXX }
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
    var interesTramo = 0;

    if (tipoInteres === "CIVIL") {
      // Interés simple 6% EA — Art. 1617 C.C.
      // No se convierte a diaria con fórmula compuesta; es proporcional lineal
      teaIBC      = 0.06;
      teaAplicada = 0.06;
      tasaDiaria  = parseFloat((0.06 / diasAnio).toFixed(10));
      interesTramo = capital * tasaDiaria * nDias;

    } else {
      // CORRIENTE o MORATORIO — IBC SFC
      teaIBC      = obtenerIBC(desdeTramo);
      teaAplicada = (tipoInteres === "MORATORIO") ? teaIBC * 1.5 : teaIBC;
      // Fórmula SFC: (1 + TEA)^(1/días_año) − 1
      tasaDiaria  = parseFloat((Math.pow(1 + teaAplicada, 1 / diasAnio) - 1).toFixed(10));
      interesTramo = capital * tasaDiaria * nDias;
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
    "IBC EA", "Tasa aplicada EA", "Tasa diaria (10 dec.)",
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
      l.teaAplicada,
      l.tasaDiaria,
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

    hoja.getRange(fila, 5, filasDatos.length, 2).setNumberFormat("0.00%");
    hoja.getRange(fila, 7, filasDatos.length, 1).setNumberFormat("0.0000000000%");
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
  hoja.setColumnWidth(7, 165);

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

function obtenerIBC(fecha) {
  var tsMs = fecha.getTime();
  var tasaVigente = null;
  for (var i = 0; i < TASAS_IBC.length; i++) {
    var fDesde = parseFecha(TASAS_IBC[i].desde);
    if (fDesde.getTime() <= tsMs) {
      tasaVigente = TASAS_IBC[i].corriente;
    } else {
      break;
    }
  }
  if (tasaVigente === null) {
    throw new Error(
      "No hay tasa IBC registrada para la fecha " +
      Utilities.formatDate(fecha, Session.getScriptTimeZone(), "dd/MM/yyyy") +
      ". Actualice la tabla TASAS_IBC con la certificación de la SFC para ese período.\n" +
      "Fuente: https://www.superfinanciera.gov.co/publicaciones/10829/"
    );
  }
  return tasaVigente;
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
