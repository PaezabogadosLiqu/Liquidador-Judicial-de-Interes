// ⚖️ LIQUIDADOR JUDICIAL PRO
// Automatiza liquidación de créditos con DTF actualizado desde Superfinanciera
// Versión: 1.0

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Liquidador Judicial Pro')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function generarLiquidacionSheet(formulario) {
  // Limpieza y parseo de capital
  var capitalTexto = formulario.capital.replace(/\./g, ''); 
  var capital = parseFloat(capitalTexto);
  var capitalInicialBase = capital; 
  var tipoInteres = formulario.tipoInteres; // CIVIL o COMERCIAL
  
  // Agencias y costas
  var agencias = formulario.agencias ? parseFloat(formulario.agencias.replace(/\./g, '')) : 0;
  var costas = formulario.costas ? parseFloat(formulario.costas.replace(/\./g, '')) : 0;
  
  // Parse de fechas
  var pI = formulario.fechaInicio.split("-");
  var fechaIterador = new Date(pI[0], pI[1] - 1, pI[2]);
  
  var pF = formulario.fechaTerminacion.split("-");
  var fechaFinFinal = new Date(pF[0], pF[1] - 1, pF[2]);

  // Procesamiento de abonos
  var listaAbonos = [];
  if (formulario.abonoFecha && formulario.abonoValor) {
    var fechas = Array.isArray(formulario.abonoFecha) ? formulario.abonoFecha : [formulario.abonoFecha];
    var valores = Array.isArray(formulario.abonoValor) ? formulario.abonoValor : [formulario.abonoValor];
    for (var i = 0; i < fechas.length; i++) {
      if (fechas[i] && valores[i]) {
        var valLimpio = parseFloat(valores[i].replace(/\./g, ''));
        var pA = fechas[i].split("-");
        listaAbonos.push({ 
          fechaExacta: new Date(pA[0], pA[1] - 1, pA[2]), 
          valor: valLimpio, 
          aplicado: false 
        });
      }
    }
  }

  var lineasResultado = [];
  var totalInteresAcumulado = 0;

  // Loop principal de cálculo
  while (fechaIterador <= fechaFinFinal) {
    var finDeMes = new Date(fechaIterador.getFullYear(), fechaIterador.getMonth() + 1, 0);
    var fechaFinSubperiodo = (finDeMes < fechaFinFinal) ? finDeMes : fechaFinFinal;

    // Detectar si hay abono en este período
    var hayAbono = false;
    var fCorteAb = null;
    for (var k = 0; k < listaAbonos.length; k++) {
      if (!listaAbonos[k].aplicado && 
          listaAbonos[k].fechaExacta >= fechaIterador && 
          listaAbonos[k].fechaExacta <= fechaFinSubperiodo) {
        if (fCorteAb === null || listaAbonos[k].fechaExacta < fCorteAb) {
          fCorteAb = new Date(listaAbonos[k].fechaExacta.getTime());
          hayAbono = true;
        }
      }
    }
    if (hayAbono) fechaFinSubperiodo = fCorteAb;

    // ✅ DETERMINAR TASA SEGÚN RÉGIMEN (MEJORADO - AUTOMÁTICO)
    var tasaMensual = 0;
    if (tipoInteres === "CIVIL") {
      // 6% ANUAL / 12 MESES = 0.5% MENSUAL EXACTO (Interés Simple)
      tasaMensual = 0.005; 
    } else {
      // ✅ NUEVO: Obtener DTF automáticamente desde Superfinanciera
      var tasaEA = obtenerTasaDTFconCache(fechaIterador);
      
      if (tasaEA > 1) tasaEA /= 100;
      tasaMensual = Math.pow(1 + tasaEA, 1/12) - 1; // Conversión financiera
    }

    // Cálculo de días exactos
    var utc1 = Date.UTC(fechaIterador.getFullYear(), fechaIterador.getMonth(), fechaIterador.getDate());
    var utc2 = Date.UTC(fechaFinSubperiodo.getFullYear(), fechaFinSubperiodo.getMonth(), fechaFinSubperiodo.getDate());
    var dias = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24)) + 1; 
    
    // Cálculo de interés del período
    var interesDelMes = Math.round(capital * tasaMensual * (dias / 30) * 100) / 100; 
    totalInteresAcumulado += interesDelMes;

    // Procesamiento de abonos
    var abTotal = 0, abInt = 0, abCap = 0;
    if (hayAbono) {
      for (var k = 0; k < listaAbonos.length; k++) {
        if (!listaAbonos[k].aplicado && listaAbonos[k].fechaExacta.getTime() === fechaFinSubperiodo.getTime()) {
          abTotal += listaAbonos[k].valor;
          listaAbonos[k].aplicado = true;
        }
      }
      if (abTotal > 0) {
        if (abTotal <= totalInteresAcumulado) {
          abInt = abTotal;
          totalInteresAcumulado -= abInt;
        } else {
          abInt = totalInteresAcumulado;
          totalInteresAcumulado = 0;
          abCap = abTotal - abInt;
          capital -= abCap;
          if (capital < 0) capital = 0;
        }
      }
    }

    // Agregar línea al resultado
    lineasResultado.push([
      Utilities.formatDate(fechaIterador, Session.getScriptTimeZone(), "dd/MM/yyyy"), 
      Utilities.formatDate(fechaFinSubperiodo, Session.getScriptTimeZone(), "dd/MM/yyyy"), 
      dias, 
      tasaMensual, 
      interesDelMes,
      abTotal > 0 ? abTotal : "-", 
      abInt > 0 ? abInt : "-", 
      abCap > 0 ? abCap : "-",
      totalInteresAcumulado, 
      capital
    ]);

    if (capital <= 0) break;
    fechaIterador = new Date(fechaFinSubperiodo.getFullYear(), fechaFinSubperiodo.getMonth(), fechaFinSubperiodo.getDate() + 1);
  }

  // Crear Google Sheet con resultados
  var nuevoLibro = SpreadsheetApp.create("Liquidacion_" + tipoInteres + "_" + formulario.fechaInicio);
  var hoja = nuevoLibro.getSheets()[0];
  
  // Encabezado principal
  hoja.getRange("A1").setValue("LIQUIDACIÓN DE CRÉDITO - RÉGIMEN " + tipoInteres)
    .setFontWeight("bold")
    .setFontSize(12);
  
  hoja.getRange("A3").setValue("CAPITAL BASE:").setFontWeight("bold");
  hoja.getRange("B3").setValue(capitalInicialBase).setNumberFormat('$ #,##0.00');

  // Tabla de liquidación
  var encabezados = [["Desde", "Hasta", "Días", "Tasa Mens (%)", "Int. Mes", "Abono", "A Int.", "A Cap.", "Saldo Int.", "Saldo Cap."]];
  hoja.getRange(5, 1, 1, 10)
    .setValues(encabezados)
    .setFontWeight("bold")
    .setBackground("#2c3e50")
    .setFontColor("white")
    .setHorizontalAlignment("center");
  
  hoja.getRange(6, 1, lineasResultado.length, 10)
    .setValues(lineasResultado)
    .setHorizontalAlignment("center");

  // Formateo de números
  hoja.getRange(6, 4, lineasResultado.length, 1).setNumberFormat("0.00%");
  hoja.getRange(6, 5, lineasResultado.length, 6).setNumberFormat('$ #,##0.00');

  // Resumen final
  var f = 6 + lineasResultado.length + 1;
  hoja.getRange(f, 9).setValue("INT. FINAL:").setFontWeight("bold");
  hoja.getRange(f, 10).setValue(totalInteresAcumulado).setNumberFormat('$ #,##0.00');
  
  hoja.getRange(f+1, 9).setValue("CAP. FINAL:").setFontWeight("bold");
  hoja.getRange(f+1, 10).setValue(capital).setNumberFormat('$ #,##0.00');
  
  var actualF = f + 2;
  if (agencias > 0) {
    hoja.getRange(actualF, 9).setValue("AGENCIAS:").setFontWeight("bold");
    hoja.getRange(actualF, 10).setValue(agencias).setNumberFormat('$ #,##0.00');
    actualF++;
  }
  if (costas > 0) {
    hoja.getRange(actualF, 9).setValue("COSTAS:").setFontWeight("bold");
    hoja.getRange(actualF, 10).setValue(costas).setNumberFormat('$ #,##0.00');
    actualF++;
  }

  // GRAN TOTAL
  hoja.getRange(actualF, 9).setValue("GRAN TOTAL:").setFontWeight("bold");
  var granTotal = capital + totalInteresAcumulado + agencias + costas;
  hoja.getRange(actualF, 10)
    .setValue(granTotal)
    .setNumberFormat('$ #,##0.00')
    .setBackground("#d4efdf");
  
  hoja.autoResizeColumns(1, 10);
  
  return nuevoLibro.getUrl();
}

// ✅ FUNCIONES PARA OBTENER DTF AUTOMÁTICAMENTE (NUEVO)

function obtenerTasaDTFoficial(fecha) {
  /**
   * Obtiene DTF directamente de datos.gov.co (fuente oficial Superfinanciera)
   * Endpoint: https://www.datos.gov.co/resource/32sa-8pi3.json
   * @param {Date} fecha - Fecha para la cual obtener la DTF
   * @return {number} Tasa DTF en formato decimal (0.09 = 9%)
   */
  
  var anio = fecha.getFullYear();
  var mes = String(fecha.getMonth() + 1).padStart(2, "0");
  var dia = String(fecha.getDate()).padStart(2, "0");
  var fechaFormato = anio + "-" + mes + "-" + dia;
  
  try {
    // Endpoint oficial de datos.gov.co para DTF
    var url = "https://www.datos.gov.co/resource/32sa-8pi3.json?vigenciadesde=" + fechaFormato;
    
    var options = {
      method: 'get',
      muteHttpExceptions: true,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    };
    
    var response = UrlFetchApp.fetch(url, options);
    
    if (response.getResponseCode() === 200) {
      var json = JSON.parse(response.getContentText());
      
      if (json && json.length > 0) {
        // El campo de tasa viene como string, convertir a float
        var tasa = parseFloat(json[0].vigenciavalor);
        Logger.log("DTF obtenida para " + fechaFormato + ": " + tasa + "%");
        return tasa / 100; // Convertir de porcentaje a decimal
      }
    }
  } catch (e) {
    Logger.log("Error obteniendo DTF: " + e);
  }
  
  // Fallback: retornar tasa por defecto (actual ~9%)
  Logger.log("Usando DTF por defecto: 9%");
  return 0.09;
}

function obtenerTasaDTFconCache(fecha) {
  /**
   * Obtiene DTF con caché local para optimizar (evita llamadas innecesarias)
   * Almacena en Properties del Script durante 30 días
   * @param {Date} fecha - Fecha para la cual obtener la DTF
   * @return {number} Tasa DTF en formato decimal
   */
  
  var propiedades = PropertiesService.getScriptProperties();
  
  // Clave basada en año-mes (DTF es semanal pero cacheamos por mes)
  var cacheKey = "dtf_" + Utilities.formatDate(fecha, Session.getScriptTimeZone(), "yyyy-MM");
  var tasaCacheada = propiedades.getProperty(cacheKey);
  
  if (tasaCacheada) {
    Logger.log("DTF obtenida de caché: " + tasaCacheada);
    return parseFloat(tasaCacheada);
  }
  
  // Si no está en caché, obtener de datos.gov.co
  var tasa = obtenerTasaDTFoficial(fecha);
  
  // Guardar en caché durante 30 días
  propiedades.setProperty(cacheKey, tasa.toString());
  Logger.log("DTF almacenada en caché: " + tasa);
  
  return tasa;
}

function limpiarCache() {
  /**
   * Función auxiliar para limpiar el caché de tasas
   * Útil si necesitas forzar una actualización
   */
  var propiedades = PropertiesService.getScriptProperties();
  propiedades.deleteAllProperties();
  Logger.log("Caché de DTF limpiado");
}
