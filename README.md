# ⚖️ Liquidador Judicial Pro

Herramienta para liquidación de intereses en procesos judiciales colombianos. Calcula intereses civiles, corrientes y moratorios con la metodología certificada por la Superintendencia Financiera de Colombia, y genera el informe listo para imprimir en PDF.

---

## 🎯 Características

- ✅ Tres regímenes de interés: **Civil** (6% EA fijo), **Corriente** (IBC SFC) y **Moratorio** (IBC × 1.5 — tasa de usura)
- ✅ Tasas IBC mensuales certificadas por la SFC desde 2018
- ✅ Fórmula exacta: `capital × (tasa nominal mensual) × (días / 30)`
- ✅ Cortes automáticos por mes calendario y por abonos
- ✅ Aplicación correcta de abonos: primero a intereses, luego a capital (Art. 1653 C.C.)
- ✅ Generación de informe en PDF directamente desde el navegador
- ✅ Sin base de datos ni servidores — corre 100% en Google Apps Script

---

## 💼 Casos de uso

| Proceso | Régimen recomendado |
|---|---|
| Ejecución de sentencia | Civil (6% EA) |
| Ejecutivo de alimentos | Civil (6% EA) |
| Responsabilidad civil extracontractual | Civil (6% EA) |
| Ejecutivo hipotecario / pagaré | Corriente o Moratorio |
| Obligaciones comerciales en mora | Moratorio (IBC × 1.5) |

---

## 🚀 Cómo usar

### Opción A — Usar la webapp (recomendado)

Accede directamente en:

> **[Insertar URL de la webapp aquí]**

No necesitas instalar nada. Completa el formulario y descarga el PDF.

### Opción B — Desplegarlo tú mismo

1. Ve a [Google Apps Script](https://script.google.com) y crea un nuevo proyecto
2. Copia el contenido de `google-apps-script/Code.gs` en el editor
3. Crea un archivo HTML llamado `Index` y copia el contenido de `google-apps-script/Index.html`
4. Clic en **Implementar → Nueva implementación → Aplicación web**
5. Configurar: ejecutar como **Yo**, acceso para **Cualquier persona**
6. Copiar la URL generada y compartirla

---

## ⚙️ Stack técnico

- **Backend:** Google Apps Script (JavaScript)
- **Frontend:** HTML / CSS / JavaScript — sin frameworks
- **Tasas IBC:** Tabla histórica extraída de certificaciones mensuales SFC (2018–2026)
- **Salida:** HTML imprimible → PDF vía Ctrl+P del navegador

---

## 📁 Estructura del repositorio

```
Liquidador-Judicial-de-Interes/
├── google-apps-script/
│   ├── Code.gs          ← Lógica de cálculo y generación del informe
│   ├── Index.html       ← Formulario web (interfaz de usuario)
│   └── appsscript.json  ← Configuración del proyecto Apps Script
└── README.md
```

---

## 📐 Metodología de cálculo

Las tasas IBC son certificadas mensualmente por la Superintendencia Financiera de Colombia mediante resolución. La fórmula aplicada es:

```
Interés del período = Capital × (Tasa nominal mensual) × (Días / 30)
```

Donde la tasa nominal mensual se obtiene de:
- **Civil:** `0.06 / 12 = 0.5%` mensual fijo
- **Corriente:** `CorPct / 12` (tasa corriente nominal anual ÷ 12)
- **Moratorio:** `MoraNom / 12` (tasa de usura nominal anual ÷ 12)

Los intereses **no se capitalizan** — el cálculo siempre se hace sobre el capital original (Art. 1617 C.C. y Art. 886 C.Co — prohibición del anatocismo).

Fuente oficial de tasas: [superfinanciera.gov.co](https://www.superfinanciera.gov.co/publicaciones/10829/)

---

## 🔄 Actualización mensual de tasas

La SFC certifica el IBC el último día hábil de cada mes. Para añadir la nueva tasa, edita la tabla `TASAS_IBC` en `Code.gs` agregando una línea al final:

```javascript
{ desde: '2026-05-01', corriente: 0.XXXX, nomMensual: 0.XXXXXXXX, nomMensualMora: 0.XXXXXXXX }
```

Los valores `nomMensual` y `nomMensualMora` se obtienen así:
```
nomMensual     = CorPct  / 100 / 12
nomMensualMora = MoraNom / 100 / 12
```

---

## ⚠️ Aviso legal

Esta herramienta es orientativa. Los resultados deben verificarse con las certificaciones oficiales de la SFC vigentes para cada período. No sustituye el criterio del juez ni constituye asesoramiento legal.

---

## 👨‍⚖️ Autor

**Ángel Gustavo Páez Campos**  
Páez Abogados — Bucaramanga, Colombia  
[paezabogados.xyz](https://paezabogados.xyz)
