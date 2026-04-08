// ⚖️ LIQUIDADOR JUDICIAL PRO — v3.0
// Metodología: Superintendencia Financiera de Colombia
// Fuente tasas: https://www.superfinanciera.gov.co/publicaciones/10829/
//
// LÓGICA CORRECTA (según SFC):
//   1. El capital NO se capitaliza. Los intereses se calculan siempre sobre
//      el capital inicial (anatocismo prohibido — Art. 886 C.Co / Art. 1617 C.C.)
//   2. Tasa diaria = (1 + TEA)^(1/días_año) − 1  (año bisiesto = 366, normal = 365)
//   3. Interés período = Capital × tasa_diaria × número_de_días
//   4. Tipos de interés:
//        CORRIENTE  → Interés Bancario Corriente (IBC) modalidad consumo y ordinario
//        MORATORIO  → IBC × 1.5  (tasa de usura — Art. 884 C.Co)
//   5. Los intereses se liquidan desde el día siguiente al vencimiento hasta
//      el día del pago, ambos inclusive.
//   6. Los abonos se aplican primero a intereses, luego a capital.
//      El saldo de capital reducido cambia la base de cálculo en adelante.
//   7. Tasa diaria se expresa con 10 decimales (precisión SFC).
//
// TASAS IBC — Actualizar mensualmente desde la SFC.
// La SFC certifica bimestralmente o mensualmente según período.
// Ruta: superfinanciera.gov.co → Sala de prensa → Interés Bancario Corriente
// ─────────────────────────────────────────────────────────────────────────────

// ─── TABLA DE TASAS IBC (Interés Bancario Corriente) ─────────────────────────
// Formato: "AAAA-MM-DD": tasa_EA_decimal  (fecha de vigencia → aplica hasta
// la vigencia siguiente exclusive)
// Fuente: Resoluciones SFC publicadas en el enlace arriba indicado.
//
// IMPORTANTE: La SFC certifica la tasa con vigencia desde una fecha específica.
// Se usa la tasa vigente en cada día del período de liquidación.
// ─────────────────────────────────────────────────────────────────────────────
var TASAS_IBC = [
  // Formato: { desde: "AAAA-MM-DD", corriente: X.XXXX }
  // corriente = TEA del IBC modalidad consumo y ordinario (decimal, ej: 0.2194)
  // usura     = corriente × 1.5 (se calcula automáticamente)

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
  // 2026 — ← Añadir aquí cuando la SFC certifique nuevos períodos
  { desde: "2026-01-01", corriente: 0.1953 },
  { desde: "2026-03-01", corriente: 0.2040 }
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

  // ── PARSEO Y VALIDACIÓN ──────────────────────────────────────────────────
  var capitalOriginal = parseFloat(formulario.capital.replace(/\./g, ''));
  if (isNaN(capitalOriginal) || capitalOriginal <= 0)
    throw new Error("El capital debe ser un número positivo.");

  var tipoInteres = formulario.tipoInteres; // "CORRIENTE" o "MORATORIO"
  if (tipoInteres !== "CORRIENTE" && tipoInteres !== "MORATORIO")
    throw new Error("Tipo de interés inválido. Use CORRIENTE o MORATORIO.");

  var agencias = formulario.agencias ? parseFloat(formulario.agencias.replace(/\./g, '')) : 0;
  var costas   = formulario.costas   ? parseFloat(formulario.costas.replace(/\./g, ''))   : 0;

  var pI = formulario.fechaInicio.split("-");
  var fechaInicio = new Date(+pI[0], +pI[1]-1, +pI[2]);

  var pF = formulario.fechaFin.split("-");
  var fechaFin = new Date(+pF[0], +pF[1]-1, +pF[2]);

  if (fechaInicio > fechaFin)
    throw new Error("La fecha de inicio de mora debe ser anterior o igual a la fecha de pago.");

  // ── ABONOS ───────────────────────────────────────────────────────────────
  var abonos = [];
  if (formulario.abonoFecha && formulario.abonoValor) {
    var aFechas = Array.isArray(formulario.abonoFecha) ? formulario.abonoFecha : [formulario.abonoFecha];
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

  // ── LOOP DE LIQUIDACIÓN DÍA A DÍA ───────────────────────────────────────
  // La SFC cambia la tasa en fechas específicas (no siempre el 1ro del mes).
  // Necesitamos cortar el período cada vez que cambia la tasa.
  // Estrategia: agrupar días por tramo de tasa + aplicar abonos como cortes.

  var capital = capitalOriginal; // Capital mutable (se reduce con abonos a capital)
  var interesAcumulado = 0;      // Sin redondeo intermedio
  var lineas = [];
  var tasasUsadas = [];          // Para hoja de trazabilidad

  // Construir lista de fechas de corte: cambios de tasa + fechas de abono
  var fechasCorte = [fechaFin]; // siempre termina en fechaFin

  // Cortes por cambio de tasa
  for (var t = 0; t < TASAS_IBC.length; t++) {
    var fCorte = parseFecha(TASAS_IBC[t].desde);
    if (fCorte > fechaInicio && fCorte <= fechaFin) {
      fechasCorte.push(fCorte);
    }
  }
  // Cortes por abonos
  for (var a = 0; a < abonos.length; a++) {
    fechasCorte.push(abonos[a].fecha);
  }
  // Ordenar y deduplicar
  fechasCorte.sort(function(a,b){ return a-b; });
  var cortesUnicos = [];
  var prevMs = -1;
  for (var c = 0; c < fechasCorte.length; c++) {
    if (fechasCorte[c].getTime() !== prevMs) {
      cortesUnicos.push(fechasCorte[c]);
      prevMs = fechasCorte[c].getTime();
    }
  }

  // Iterar tramos
  var desdeTramo = fechaInicio;

  for (var c = 0; c < cortesUnicos.length; c++) {
    var hastaTramo = cortesUnicos[c];
    if (hastaTramo < desdeTramo) continue;

    // Tasa vigente al inicio de este tramo
    var ibcVigente = obtenerIBC(desdeTramo);
    var teaAplicable = (tipoInteres === "MORATORIO") ? ibcVigente * 1.5 : ibcVigente;

    // Días del año (366 si bisiesto)
    var diasAnio = esBisiesto(desdeTramo.getFullYear()) ? 366 : 365;

    // Tasa diaria con 10 decimales de precisión
    var tasaDiaria = parseFloat((Math.pow(1 + teaAplicable, 1 / diasAnio) - 1).toFixed(10));

    // Días del tramo: desde desdeTramo hasta hastaTramo inclusive
    var nDias = diasEntreFechas(desdeTramo, hastaTramo) + 1;

    // Interés del tramo (sobre capital ACTUAL, no capitalizado)
    var interesTramo = capital * tasaDiaria * nDias;
    interesAcumulado += interesTramo;

    // ¿Hay abono en hastaTramo?
    var abonoDia = 0;
    var abonoAInt = 0;
    var abonoACap = 0;
    for (var a = 0; a < abonos.length; a++) {
      if (!abonos[a].aplicado && abonos[a].fecha.getTime() === hastaTramo.getTime()) {
        abonoDia += abonos[a].valor;
        abonos[a].aplicado = true;
      }
    }
    if (abonoDia > 0) {
      if (abonoDia <= interesAcumulado) {
        // El abono no alcanza ni los intereses
        abonoAInt = abonoDia;
        interesAcumulado -= abonoAInt;
      } else {
        // El abono cubre intereses y parte o todo del capital
        abonoAInt = interesAcumulado;
        interesAcumulado = 0;
        abonoACap = abonoDia - abonoAInt;
        capital = Math.max(0, capital - abonoACap);
      }
    }

    // Registrar tasa para trazabilidad
    var keyTasa = ibcVigente.toFixed(4);
    if (tasasUsadas.indexOf(keyTasa) === -1) tasasUsadas.push(keyTasa);

    lineas.push({
      desde:          desdeTramo,
      hasta:          hastaTramo,
      dias:           nDias,
      diasAnio:       diasAnio,
      teaIBC:         ibcVigente,
      teaAplicada:    teaAplicable,
      tasaDiaria:     tasaDiaria,
      capital:        capital + abonoACap,   // capital AL INICIO del tramo
      interesTramo:   interesTramo,
      abono:          abonoDia,
      abonoAInt:      abonoAInt,
      abonoACap:      abonoACap,
      saldoInteres:   interesAcumulado,
      saldoCapital:   capital
    });

    if (capital <= 0) break;

    // Avanzar: si el corte fue por abono y no por fin, el día siguiente es nuevo tramo
    if (hastaTramo.getTime() < fechaFin.getTime()) {
      desdeTramo = new Date(hastaTramo.getFullYear(), hastaTramo.getMonth(), hastaTramo.getDate() + 1);
    } else {
      break;
    }
  }

  // ── CREAR GOOGLE SHEET ───────────────────────────────────────────────────
  var libro = SpreadsheetApp.create(
    "Liquidacion_" + tipoInteres + "_" + formulario.fechaInicio
  );
  var hoja = libro.getSheets()[0];
  hoja.setName("Liquidación");

  // Encabezado
  var titulo = "LIQUIDACIÓN DE INTERESES — " + tipoInteres +
    (tipoInteres === "MORATORIO" ? " (IBC × 1.5)" : " (IBC)");
  hoja.getRange("A1").setValue(titulo).setFontWeight("bold").setFontSize(13);
  hoja.getRange("A2").setValue("Fuente tasas: Superintendencia Financiera de Colombia")
    .setFontColor("#555555");

  hoja.getRange("A4:B4").setValues([["Capital base:", capitalOriginal]]);
  hoja.getRange("B4").setNumberFormat('$ #,##0.00');
  hoja.getRange("A5:B5").setValues([["Fecha inicio mora:", Utilities.formatDate(fechaInicio, Session.getScriptTimeZone(), "dd/MM/yyyy")]]);
  hoja.getRange("A6:B6").setValues([["Fecha de pago:", Utilities.formatDate(fechaFin,   Session.getScriptTimeZone(), "dd/MM/yyyy")]]);
  hoja.getRange("A7:B7").setValues([["Tipo de interés:", tipoInteres]]);
  hoja.getRange("A4:A7").setFontWeight("bold");

  // Encabezados tabla
  var headers = [
    "Desde", "Hasta", "Días", "Año", "IBC EA",
    "Tasa Aplicada EA", "Tasa Diaria (10 dec.)",
    "Capital Base", "Interés Tramo",
    "Abono Total", "A Intereses", "A Capital",
    "Saldo Intereses", "Saldo Capital"
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

  // Datos
  var filasDatos = lineas.map(function(l) {
    return [
      Utilities.formatDate(l.desde,  Session.getScriptTimeZone(), "dd/MM/yyyy"),
      Utilities.formatDate(l.hasta,  Session.getScriptTimeZone(), "dd/MM/yyyy"),
      l.dias,
      l.diasAnio,
      l.teaIBC,            // IBC certificado
      l.teaAplicada,       // IBC o IBC×1.5
      l.tasaDiaria,        // 10 decimales
      l.capital + l.abonoACap,  // capital al inicio del tramo
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

    // Formato porcentajes
    hoja.getRange(fila, 5, filasDatos.length, 3).setNumberFormat("0.0000%");
    // Tasa diaria con más decimales
    hoja.getRange(fila, 7, filasDatos.length, 1).setNumberFormat("0.0000000000%");
    // Monedas
    hoja.getRange(fila, 8, filasDatos.length, 2).setNumberFormat('$ #,##0.00');
    hoja.getRange(fila, 13, filasDatos.length, 2).setNumberFormat('$ #,##0.00');

    // Colores alternados
    for (var r = 0; r < filasDatos.length; r++) {
      if (r % 2 === 0) {
        hoja.getRange(fila + r, 1, 1, headers.length).setBackground("#f2f7fc");
      }
    }
    fila += filasDatos.length;
  }

  // ── RESUMEN FINAL ────────────────────────────────────────────────────────
  fila += 1;
  var intFinal = Math.round(interesAcumulado * 100) / 100;
  var capFinal = Math.round(capital * 100) / 100;
  var granTotal = capFinal + intFinal + agencias + costas;

  var resumen = [
    ["CAPITAL FINAL:",    capFinal],
    ["INTERESES:",        intFinal]
  ];
  if (agencias > 0) resumen.push(["AGENCIAS EN COSTAS:", agencias]);
  if (costas > 0)   resumen.push(["COSTAS:",             costas]);
  resumen.push(["GRAN TOTAL:", granTotal]);

  for (var r = 0; r < resumen.length; r++) {
    var esTotal = (r === resumen.length - 1);
    hoja.getRange(fila + r, headers.length - 1).setValue(resumen[r][0])
      .setFontWeight("bold")
      .setHorizontalAlignment("right");
    var celdaVal = hoja.getRange(fila + r, headers.length);
    celdaVal.setValue(resumen[r][1]).setNumberFormat('$ #,##0.00');
    if (esTotal) {
      hoja.getRange(fila + r, headers.length - 1, 1, 2)
        .setBackground("#d4efdf")
        .setFontWeight("bold")
        .setFontSize(12);
    }
  }

  hoja.autoResizeColumns(1, headers.length);
  // Columna tasa diaria más ancha para los 10 decimales
  hoja.setColumnWidth(7, 160);

  // ── HOJA DE TRAZABILIDAD ─────────────────────────────────────────────────
  var hojaT = libro.insertSheet("Tasas IBC Aplicadas");
  hojaT.getRange("A1").setValue("TASAS IBC APLICADAS EN ESTA LIQUIDACIÓN")
    .setFontWeight("bold").setFontSize(11);
  hojaT.getRange("A2").setValue(
    "Fuente: Superintendencia Financiera de Colombia — https://www.superfinanciera.gov.co/publicaciones/10829/"
  ).setFontColor("#555555");
  hojaT.getRange("A3").setValue(
    "Tasa de usura = IBC × 1.5  |  Tasa diaria = (1 + TEA)^(1/días_año) − 1"
  ).setFontColor("#777777");

  var hT = [["Vigencia desde", "IBC Corriente EA", "Usura EA", "Tipo aplicado", "Tasa diaria (10 dec.)"]];
  hojaT.getRange(5, 1, 1, 5).setValues(hT)
    .setFontWeight("bold").setBackground("#1a3a5c").setFontColor("white");

  // Solo las tasas que realmente se usaron en el rango
  var filaT = 6;
  var tasasEnRango = TASAS_IBC.filter(function(t) {
    var fT = parseFecha(t.desde);
    return fT <= fechaFin && (fT >= fechaInicio || obtenerIBC(fechaInicio) === t.corriente);
  });
  // Deduplica mostrando solo vigencias que coinciden
  var vistas = {};
  for (var li = 0; li < lineas.length; li++) {
    var key = lineas[li].teaIBC.toString();
    if (!vistas[key]) {
      vistas[key] = true;
      var usura = lineas[li].teaIBC * 1.5;
      var dA    = lineas[li].diasAnio;
      var tDiaria = Math.pow(1 + lineas[li].teaAplicada, 1/dA) - 1;
      hojaT.getRange(filaT, 1).setValue(
        Utilities.formatDate(lineas[li].desde, Session.getScriptTimeZone(), "dd/MM/yyyy")
      );
      hojaT.getRange(filaT, 2).setValue(lineas[li].teaIBC).setNumberFormat("0.00%");
      hojaT.getRange(filaT, 3).setValue(usura).setNumberFormat("0.00%");
      hojaT.getRange(filaT, 4).setValue(tipoInteres);
      hojaT.getRange(filaT, 5).setValue(tDiaria).setNumberFormat("0.0000000000%");
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
  // Devuelve la tasa IBC corriente vigente para la fecha dada.
  // Busca la última entrada cuya fecha "desde" sea <= fecha.
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
      "No hay tasa IBC registrada para la fecha " + Utilities.formatDate(fecha, Session.getScriptTimeZone(), "dd/MM/yyyy") +
      ". Actualice la tabla TASAS_IBC con la certificación de la SFC para ese período."
    );
  }
  return tasaVigente;
}

function parseFecha(str) {
  // "AAAA-MM-DD" → Date local
  var p = str.split("-");
  return new Date(+p[0], +p[1]-1, +p[2]);
}

function diasEntreFechas(d1, d2) {
  // Días calendario entre d1 y d2 (sin contar el día inicial)
  var utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  var utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.round((utc2 - utc1) / 86400000);
}

function esBisiesto(anio) {
  return (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILIDADES DE MANTENIMIENTO
// ─────────────────────────────────────────────────────────────────────────────

function agregarTasaIBC(fechaDesde, tasaCorrienteEA) {
  /**
   * Añade una nueva tasa al array TASAS_IBC en tiempo de ejecución.
   * IMPORTANTE: esta función solo actualiza la memoria de la ejecución actual.
   * Para persistir, DEBE editar manualmente el array TASAS_IBC en el código fuente.
   *
   * Uso: agregarTasaIBC("2026-05-01", 0.2100)
   * Luego copiar ese objeto al array TASAS_IBC en el código.
   */
  TASAS_IBC.push({ desde: fechaDesde, corriente: tasaCorrienteEA });
  TASAS_IBC.sort(function(a, b) { return parseFecha(a.desde) - parseFecha(b.desde); });
  Logger.log("IBC añadido: desde=" + fechaDesde + " corriente=" + (tasaCorrienteEA*100).toFixed(2) + "%"
    + " | usura=" + (tasaCorrienteEA*1.5*100).toFixed(2) + "%");
}

function verificarCobertura(fechaInicioStr, fechaFinStr) {
  /**
   * Verifica que la tabla TASAS_IBC cubre el rango dado.
   * Uso desde editor: verificarCobertura("2022-01-01", "2026-04-30")
   */
  var fi = parseFecha(fechaInicioStr);
  var ff = parseFecha(fechaFinStr);
  try {
    obtenerIBC(fi);
    obtenerIBC(ff);
    Logger.log("✓ Cobertura OK para " + fechaInicioStr + " → " + fechaFinStr);
  } catch(e) {
    Logger.log("✗ " + e.message);
  }
}
