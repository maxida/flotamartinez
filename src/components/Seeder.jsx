import { useState } from 'react'
import { upsertVehiculoByPatente, ensureChoferByName, createOrdenFromHistoric } from '../services/seedService'

const datosIniciales = [
  {
    "patente": "AC897PP", "modelo": "kangoo", "anio": 2018, "vtv": "2025-09-01", "oblea": "2026-04-01",
    "fecha": "2025-08-18", "km": 300900, "chofer": "NAHUEL",
    "reparaciones": {}, "novedad": "choque parte delantera, capot y panel izquierdo rot"
  },
  {
    "patente": "AF684MI", "modelo": "kangoo", "anio": 2022, "vtv": "2027-06-01", "oblea": "2026-06-01",
    "fecha": "2025-10-08", "km": 154360, "chofer": "LUIS",
    "reparaciones": { "tren_delantero": "casoleta- parrillas- bujes y bieletas de la barra- amortiguador izq" }
  },
  {
    "patente": "AF263YQ", "modelo": "kangoo", "anio": 2022, "vtv": "2026-01-31", "oblea": "2026-01-01",
    "fecha": "2025-10-22", "km": 185397, "chofer": "PIKI",
    "reparaciones": { "tren_delantero": "casoleta- parrilla- bujes", "tren_trasero": "amortiguadores" }
  },
  {
    "patente": "JAO082", "modelo": "H1", "anio": 2010, "vtv": "2024-04-01", "oblea": null,
    "fecha": "2025-11-04", "km": 229635, "chofer": "JOSE MARIA",
    "novedad": "LEVANTA TEMPERATURA", "reparaciones": {}
  },
  {
    "patente": "AC897PP", "fecha": "2026-11-06", "km": 312220, "chofer": "NAHUEL",
    "reparaciones": { "tren_delantero": "bujes de parrilla", "electronica": "cambio de bateria" },
    "novedad": "choque en la parte trasera"
  },
  {
    "patente": "AF501DC", "modelo": "kangoo", "anio": 2023, "vtv": "31/10/0205", "oblea": "2026-09-01",
    "fecha": "2025-10-16", "km": 131354, "chofer": "PEDRO", "reparaciones": {}
  },
  {
    "patente": "AD129AI", "modelo": "Kangoo", "anio": 2022, "vtv": "2026-01-01",
    "fecha": "2025-10-23", "km": 126369, "chofer": "PABLO",
    "reparaciones": { "tren_delantero": "casoleta- parrillas", "frenos": "delanteros" }
  },
  {
    "patente": "AC867PP", "modelo": "kangoo", "km": 315555, "chofer": "NAHUEL", "fecha": "2025-12-03",
    "reparaciones": { "tren_delantero": "parrilla izq y der", "electronica": "cambio de llave de luz" }
  },
  {
    "patente": "AF263YQ", "km": 191470, "chofer": "PIKI", "fecha": "2025-12-26",
    "reparaciones": { "tren_delantero": "amortiguadores x2- casoletas x2" },
    "novedad": "AGARRO UN POSO Y ROMPIO TODO"
  }
]

export default function Seeder() {
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState([])
  const [done, setDone] = useState(false)

  function log(msg) {
    setLogs(l => [...l, `${new Date().toISOString()} - ${msg}`])
  }

  async function handleSeed() {
    setRunning(true)
    setLogs([])
    setDone(false)
    let count = 0
    try {
      for (const item of datosIniciales) {
        log(`Procesando patente ${item.patente}`)
        try {
          await upsertVehiculoByPatente(item)
          log(`Vehículo ${item.patente} creado/actualizado`)
        } catch (err) {
          log(`Error vehiculo ${item.patente}: ${err.message}`)
        }

        try {
          if (item.chofer) {
            await ensureChoferByName(item.chofer)
            log(`Chofer ${item.chofer} asegurado`)
          }
        } catch (err) {
          log(`Error chofer ${item.chofer}: ${err.message}`)
        }

        try {
          await createOrdenFromHistoric(item)
          log(`Orden histórica para ${item.patente} creada`)
          count++
        } catch (err) {
          log(`Error orden ${item.patente}: ${err.message}`)
        }
      }
      setDone(true)
      log(`Seed finalizado — ${count} órdenes creadas`)
    } catch (err) {
      log(`Seed falló: ${err.message}`)
    } finally {
      setRunning(false)
    }
  }

  return (
    <section>
      <h3>Seeder (temporal)</h3>
      <p>Carga datos históricos de ejemplo en Firestore. Usar solo una vez.</p>
      <button onClick={handleSeed} disabled={running}>
        {running ? 'Cargando...' : 'Cargar datos históricos'}
      </button>
      {done && <div style={{ marginTop: 8, color: 'green' }}>Carga completada</div>}
      <div style={{ marginTop: 12, maxHeight: 240, overflow: 'auto', background: '#f7f7f7', padding: 8 }}>
        {logs.map((l, i) => <div key={i} style={{ fontSize: 12 }}>{l}</div>)}
      </div>
    </section>
  )
}
