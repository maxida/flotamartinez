import { useEffect, useState } from 'react'
import { getChoferes, addChofer } from '../services/choferesService'

export default function Choferes() {
  const [choferes, setChoferes] = useState([])
  const [form, setForm] = useState({ nombre: '', dni: '', estado: 'Activo' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await getChoferes()
      setChoferes(data)
    } catch (err) {
      setError('No se pudieron cargar los choferes')
    } finally { setLoading(false) }
  }

  async function handleAdd(e) {
    e.preventDefault()
    setError(null)
    try {
      await addChofer(form)
      setForm({ nombre: '', dni: '', estado: 'Activo' })
      load()
    } catch (err) {
      setError('Error al agregar chofer')
    }
  }

  return (
    <section>
      <h2>Choferes</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleAdd} style={{ marginBottom: 12 }}>
        <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
        <input placeholder="DNI" value={form.dni} onChange={e => setForm({ ...form, dni: e.target.value })} />
        <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}>
          <option>Activo</option>
          <option>Inactivo</option>
        </select>
        <button type="submit">Agregar</button>
      </form>

      {loading ? <div>Cargando...</div> : (
        <ul>
          {choferes.map(c => (
            <li key={c.id}>{c.nombre} — {c.dni} ({c.estado})</li>
          ))}
        </ul>
      )}
    </section>
  )
}
