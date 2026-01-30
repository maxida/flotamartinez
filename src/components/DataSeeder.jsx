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
  const [counters, setCounters] = useState({ vehiculos: 0, choferes: 0, ordenes: 0 })

  const handleImport = async () => {
    if (loading) return
    setLoading(true)
    const errors = []
    let processed = 0
    let vehiculosCount = 0
    let choferesCount = 0
    let ordenesCount = 0

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
        // try parse vtv/oblea to Timestamp, fallback to raw string
        if (item.vtv) {
          const tv = parseToTimestamp(item.vtv)
          vehiculoData.vtv_vencimiento = tv ? tv : item.vtv
        }
        if (item.oblea) {
          const ob = parseToTimestamp(item.oblea)
          vehiculoData.oblea_vencimiento = ob ? ob : item.oblea
        }

        if (Object.keys(vehiculoData).length > 0) {
          try {
            const vehRef = doc(db, 'vehiculos', patente)
            await setDoc(vehRef, { patente, ...vehiculoData }, { merge: true })
            vehiculosCount++
          } catch (err) {
            throw new Error(`vehiculo:${err.message}`)
          }
        }

        // 2) choferes: create if chofer present and not exists
        let choferId = null
        if (item.chofer) {
          try {
            choferId = sanitizeId(item.chofer)
            const choferRef = doc(db, 'choferes', choferId)
            const choferSnap = await getDoc(choferRef)
            if (!choferSnap.exists()) {
              await setDoc(choferRef, { nombre: item.chofer, estado: 'ACTIVO' })
              choferesCount++
            }
          } catch (err) {
            throw new Error(`chofer:${err.message}`)
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

        const ts = parseToTimestamp(item.fecha)
        if (ts) orden.fecha = ts
        else orden.fecha = null

        try {
          await addDoc(collection(db, 'ordenes'), orden)
          ordenesCount++
        } catch (err) {
          throw new Error(`orden:${err.message}`)
        }

        processed += 1
        setProgress(prev => ({ ...prev, processed }))
      } catch (err) {
        const message = err?.message || String(err)
        console.error('Seed item error', { item, message })
        errors.push({ item, error: message })
      }
    }

    setCounters({ vehiculos: vehiculosCount, choferes: choferesCount, ordenes: ordenesCount })
    setProgress({ processed, total: historialData.length, errors })
    setLoading(false)
  }

  return (
    <div style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 8, maxWidth: 720, background: '#ffffff' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick={handleImport} disabled={loading} style={{ padding: '8px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: loading ? 'default' : 'pointer' }}>
          {loading ? `Importando... (${progress.processed}/${progress.total})` : 'IMPORTAR HISTORIAL'}
        </button>
        <div style={{ color: '#374151' }}>Procesados: <strong>{progress.processed}</strong> / {progress.total}</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <div style={{ fontSize: 13 }}>Vehículos: <strong>{counters.vehiculos}</strong></div>
          <div style={{ fontSize: 13 }}>Choferes nuevos: <strong>{counters.choferes}</strong></div>
          <div style={{ fontSize: 13 }}>Órdenes: <strong>{counters.ordenes}</strong></div>
        </div>
      </div>

      {progress.errors && progress.errors.length > 0 && (
        <div style={{ marginTop: 12, borderTop: '1px solid #f3f4f6', paddingTop: 12 }}>
          <h4 style={{ margin: 0, fontSize: 14 }}>Errores ({progress.errors.length})</h4>
          <ul style={{ maxHeight: 260, overflow: 'auto', paddingLeft: 18 }}>
            {progress.errors.map((e, i) => (
              <li key={i} style={{ fontSize: 13, color: '#b91c1c', marginBottom: 6 }}>
                <div><strong>Error:</strong> {e.error}</div>
                <div style={{ fontSize: 12, color: '#374151' }}>Patente: {e.item?.patente || 'N/A'} — Chofer: {e.item?.chofer || 'N/A'}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
