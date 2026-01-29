import { useEffect, useState } from 'react'
import { getVehiculos, addVehiculo } from '../services/vehiculosService'

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([])
  const [form, setForm] = useState({ patente: '', modelo: '', anio: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await getVehiculos()
      setVehiculos(data)
    } catch (err) {
      setError('No se pudieron cargar los vehículos')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    setError(null)
    try {
      const payload = { patente: form.patente, modelo: form.modelo, anio: Number(form.anio) }
      await addVehiculo(payload)
      setForm({ patente: '', modelo: '', anio: '' })
      load()
    } catch (err) {
      setError('Error al agregar vehículo')
    }
  }

  return (
    <section>
      <h2>Vehículos</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleAdd} style={{ marginBottom: 12 }}>
        <input placeholder="Patente" value={form.patente} onChange={e => setForm({ ...form, patente: e.target.value })} />
        <input placeholder="Modelo" value={form.modelo} onChange={e => setForm({ ...form, modelo: e.target.value })} />
        <input placeholder="Año" value={form.anio} onChange={e => setForm({ ...form, anio: e.target.value })} />
        <button type="submit">Agregar</button>
      </form>

      {loading ? <div>Cargando...</div> : (
        <ul>
          {vehiculos.map(v => (
            <li key={v.id}>{v.patente} — {v.modelo} ({v.anio})</li>
          ))}
        </ul>
      )}
    </section>
  )
}
