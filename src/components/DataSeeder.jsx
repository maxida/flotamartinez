import React, { useState } from 'react'
import { db, Timestamp } from '../services/firebase'
import { collection, doc, setDoc, getDoc, addDoc } from 'firebase/firestore'

const historialData = [
  {
    "patente": "AC897PP", "modelo": "kangoo", "anio": 2018, "vtv": "2025-09-01", "oblea": "2026-04-01",
    "fecha": "2025-08-18", "km": 300900, "chofer": "NAHUEL",
    "reparaciones": {}, "novedad": "choque parte delantera, capot y panel izquierdo rot"
  },
  {
    "patente": "AG764GA", "modelo": "Kangoo", "fecha": "2025-09-06", "km": 48000, "chofer": "PABLO",
    "reparaciones": { "frenos": "delanteros" }
  },
  {
    "patente": "AF263YQ", "modelo": "kangoo", "fecha": "2025-09-06", "km": 178100, "chofer": "PIKI"
  },
  {
    "patente": "AF684MI", "modelo": "kangoo", "anio": 2022, "vtv": "2027-06-01", "oblea": "2026-06-01",
    "fecha": "2025-10-08", "km": 154360, "chofer": "LUIS",
    "reparaciones": { "tren_delantero": "casoleta- parrillas- bujes y bieletas de la barra- amortiguador izq", "frenos": "delanteros" }
  },
  {
    "patente": "AE142MW", "modelo": "kangoo", "anio": 2020, "vtv": "2026-07-01", "oblea": "2026-04-01",
    "fecha": "2025-10-09", "km": 256362, "chofer": "SUSANA"
  },
  {
    "patente": "AF501DC", "modelo": "kangoo", "anio": 2023, "vtv": "31/10/0205", "oblea": "2026-09-01",
    "fecha": "2025-10-16", "km": 131354, "chofer": "PEDRO"
  },
  {
    "patente": "AF263YQ", "modelo": "Kangoo", "anio": 2022, "vtv": "2026-01-31", "oblea": "2026-01-01",
    "fecha": "2025-10-22", "km": 185397, "chofer": "PIKI",
    "reparaciones": { "tren_delantero": "casoleta- parrilla- bujes y bieletas de barra", "tren_trasero": "amortiguadores" }
  },
  {
    "patente": "AD129AI", "modelo": "Kangoo", "anio": 2022, "vtv": "2026-01-01",
    "fecha": "2025-10-23", "km": 126369, "chofer": "PABLO",
    "reparaciones": { "tren_delantero": "casoleta- parrillas- bujes y bieletas de la barra", "frenos": "delanteros" }
  },
  {
    "patente": "JAO082", "modelo": "H1", "anio": 2010, "vtv": "2024-04-01",
    "fecha": "2025-11-04", "km": 229635, "chofer": "JOSE MARIA", "novedad": "LEVANTA TEMPERATURA"
  },
  {
    "patente": "AD129AI", "modelo": "kangoo", "fecha": "2025-08-18", "km": 124000,
    "novedad": "DISTRIBUCION"
  },
  {
    "patente": "PGD755", "modelo": "Kangoo", "anio": 2014, "km": 0, "novedad": "REPARANDO TAPA"
  },
  {
    "patente": "AH641WH", "modelo": "kangoo", "anio": 2025, "fecha": "2026-11-04", "km": 4150, "chofer": "JORGE"
  },
  {
    "patente": "AC897PP", "modelo": "kangoo", "fecha": "2026-11-06", "km": 312220, "chofer": "NAHUEL",
    "reparaciones": { "tren_delantero": "bujes de parrilla lado derecho- bujes y bieletas", "tren_trasero": "bujes izquiero y derecho", "electronica": "cambio de bateria" },
    "novedad": "choque en la parte trasera, manija de puerta trasera, cinturon roto"
  },
  {
    "patente": "AF684MI", "modelo": "kangoo", "fecha": "2025-11-11", "km": 156111, "chofer": "LUIS",
    "reparaciones": { "mecanica_ligera": "CORREA POLI V" }
  },
  {
    "patente": "JAO082", "modelo": "H1", "fecha": "2025-11-11", "km": 0, "chofer": "JOSE MARIA",
    "reparaciones": { "mecanica_ligera": "REPARACION DE RADIADOR" }
  },
  {
    "patente": "AF501DC", "modelo": "kangoo", "fecha": "2025-11-17", "km": 0, "chofer": "PEDRO",
    "reparaciones": { "tren_delantero": "casoletas-crapodinas-amortiguadores-bieletas-bujes de barra-parrillas ambos lados" },
    "novedad": "LLAMADO DE ATENCION POR MENTIR"
  },
  {
    "patente": "AC897PP", "modelo": "kangoo", "fecha": "2025-11-18", "km": 312000, "chofer": "NAHUEL",
    "reparaciones": { "tren_delantero": "bujes de parrillas- bieletas", "tren_trasero": "bujes de tren trasero izquierdo y derecho" }
  },
  {
    "patente": "AD129AI", "modelo": "kangoo", "fecha": "2025-12-01", "km": 0, "chofer": "PABLO",
    "reparaciones": { "electronica": "cambio de llave de luz" }
  },
  {
    "patente": "AF263YQ", "modelo": "kangoo", "fecha": "2025-11-28", "km": 0, "chofer": "PIKI",
    "reparaciones": { "mecanica_ligera": "PERDIDA DE AGUA" }
  },
  {
    "patente": "JAO082", "modelo": "H1", "fecha": "2025-11-29", "km": 0, "chofer": "JOSE MARIA",
    "reparaciones": { "frenos": "ARREGLO DE CERBO DE FRENO" }
  },
  {
    "patente": "AC867PP", "modelo": "kangoo", "fecha": "2025-12-03", "km": 315555, "chofer": "NAHUEL",
    "reparaciones": { "tren_delantero": "parrilla izquierda y derecha", "electronica": "cambio de llave de luz" }
  },
  {
    "patente": "408", "modelo": "kangoo", "km": 194060, "chofer": "LUIS",
    "reparaciones": { "tren_delantero": "bieleta derecha" }
  },
  {
    "patente": "AC897PP", "modelo": "Kangoo", "fecha": "2025-12-10", "km": 316532, "chofer": "NAHUEL",
    "reparaciones": { "electronica": "cambio de bomba y reparacion de aforador" }
  },
  {
    "patente": "JAO082", "modelo": "H1", "fecha": "2025-12-08", "km": 0,
    "reparaciones": { "frenos": "CAMBIO DE CABLE DE FRENO TRASERO" }
  },
  {
    "patente": "AC897PP", "modelo": "Kangoo", "fecha": "2025-11-07", "km": 0, "chofer": "NAHUEL",
    "reparaciones": { "electronica": "cambio de bateria" }
  },
  {
    "patente": "AD129AI", "modelo": "Kangoo", "fecha": "2025-12-26", "km": 129879, "chofer": "JOSE MARIA",
    "reparaciones": { "tren_delantero": "bieletas- casoletas- crapodinas- ruleman de rueda lado izq" }
  },
  {
    "patente": "AF263YQ", "modelo": "Kangoo", "fecha": "2025-12-26", "km": 191470, "chofer": "PIKI",
    "reparaciones": { "tren_delantero": "amortiguadores x2- casoletas x2- crapodinas x2- espiral derecho x2" },
    "novedad": "AGARRO UN POSO Y ROMPIO TODO"
  }
]

function sanitizeId(name) {
  if (!name) return null
  return name.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '').toUpperCase()
}

function parseToTimestamp(dateStr) {
  if (!dateStr) return null
  // try native ISO parse first
  const d1 = new Date(dateStr)
  if (!isNaN(d1.getTime())) return Timestamp.fromDate(d1)

  // try dd/mm/yyyy or d/m/yyyy
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/').map(p => p.trim())
    if (parts.length === 3) {
      let day = parseInt(parts[0], 10)
      let month = parseInt(parts[1], 10) - 1
      let year = parseInt(parts[2], 10)
      if (year < 100) year += 2000
      const d2 = new Date(year, month, day)
      if (!isNaN(d2.getTime())) return Timestamp.fromDate(d2)
    }
  }

  // failed to parse
  return null
}

export default function DataSeeder() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState({ processed: 0, total: historialData.length, errors: [] })

  const handleImport = async () => {
    if (loading) return
    setLoading(true)
    const errors = []
    let processed = 0

    for (const item of historialData) {
      try {
        const patente = String(item.patente || '').trim()
        if (!patente) {
          errors.push({ item, error: 'sin_patente' })
          continue
        }

        // 1) vehiculos: upsert by patente
        const vehiculoData = {}
        if (item.modelo) vehiculoData.modelo = item.modelo
        if (item.anio) vehiculoData.anio = item.anio
        if (item.vtv) vehiculoData.vtv_vencimiento = item.vtv
        if (item.oblea) vehiculoData.oblea_vencimiento = item.oblea

        if (Object.keys(vehiculoData).length > 0) {
          const vehRef = doc(db, 'vehiculos', patente)
          await setDoc(vehRef, { patente, ...vehiculoData }, { merge: true })
        }

        // 2) choferes: create if chofer present and not exists
        let choferId = null
        if (item.chofer) {
          choferId = sanitizeId(item.chofer)
          const choferRef = doc(db, 'choferes', choferId)
          const choferSnap = await getDoc(choferRef)
          if (!choferSnap.exists()) {
            await setDoc(choferRef, { nombre: item.chofer, estado: 'ACTIVO' })
          }
        }

        // 3) ordenes: create new doc
        const orden = {
          patente,
          modelo: item.modelo || null,
          km: typeof item.km === 'number' ? item.km : (item.km ? Number(item.km) : null),
          chofer: item.chofer || null,
          estado: 'FINALIZADO',
          detalle_reparacion: item.reparaciones || {},
          observaciones: item.novedad || null,
          creado_en: Timestamp.now()
        }

        const ts = parseToTimestamp(item.fecha || item.fecha)
        if (ts) orden.fecha = ts
        else orden.fecha = null

        await addDoc(collection(db, 'ordenes'), orden)

        processed += 1
        setProgress(prev => ({ ...prev, processed }))
      } catch (err) {
        errors.push({ item, error: err?.message || String(err) })
      }
    }

    setProgress({ processed, total: historialData.length, errors })
    setLoading(false)
  }

  return (
    <div style={{ padding: 12, border: '1px dashed #ccc', borderRadius: 6 }}>
      <button onClick={handleImport} disabled={loading}>
        {loading ? `Importando... (${progress.processed}/${progress.total})` : 'IMPORTAR HISTORIAL'}
      </button>
      <div style={{ marginTop: 8 }}>
        Procesados: {progress.processed} / {progress.total}
      </div>
      {progress.errors && progress.errors.length > 0 && (
        <details style={{ marginTop: 8 }}>
          <summary>Errores ({progress.errors.length})</summary>
          <pre style={{ maxHeight: 200, overflow: 'auto' }}>{JSON.stringify(progress.errors, null, 2)}</pre>
        </details>
      )}
    </div>
  )
}
