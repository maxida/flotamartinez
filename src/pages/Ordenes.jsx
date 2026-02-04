import { useEffect, useState } from 'react'
import { getOrdenes } from '../services/ordenesService'
import { Link } from 'react-router-dom'

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await getOrdenes()
      setOrdenes(data)
    } catch (err) {
      setError('No se pudieron cargar las órdenes')
    } finally { setLoading(false) }
  }

  return (
    <section>
      <h2>Órdenes de trabajo</h2>
      {/* Crear nueva orden link removed */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loading ? <div>Cargando...</div> : (
        <ul>
          {ordenes.map(o => (
            <li key={o.id}>
              {o.vehiculo_patente} — {o.chofer_nombre} — {o.estado_trabajo || 'PENDIENTE'} — {o.km_ingreso}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
