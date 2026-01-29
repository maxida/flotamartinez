import { useState, useEffect } from 'react'
import { addOrden } from '../services/ordenesService'
import { getVehiculos } from '../services/vehiculosService'
import { getChoferes } from '../services/choferesService'
import { useNavigate } from 'react-router-dom'

export default function CreateOrder() {
  const navigate = useNavigate()
  const [vehiculos, setVehiculos] = useState([])
  const [choferes, setChoferes] = useState([])
  const [form, setForm] = useState({
    vehiculo_patente: '', chofer_nombre: '', fecha_ingreso: new Date(), km_ingreso: '', estado_trabajo: 'PENDIENTE', checklist_ingreso: { tren_delantero: 'OK', frenos: 'OK', mecanica_ligera: 'OK', electronica: 'OK' }, reparaciones_realizadas: []
  })
  const [error, setError] = useState(null)

  useEffect(() => { loadOptions() }, [])

  async function loadOptions() {
    try {
      const v = await getVehiculos()
      const c = await getChoferes()
      setVehiculos(v)
      setChoferes(c)
    } catch (err) {
      setError('Error cargando opciones')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const payload = {
        vehiculo_patente: form.vehiculo_patente,
        chofer_nombre: form.chofer_nombre,
        fecha_ingreso: form.fecha_ingreso,
        km_ingreso: Number(form.km_ingreso),
        estado_trabajo: form.estado_trabajo,
        checklist_ingreso: form.checklist_ingreso,
        reparaciones_realizadas: []
      }
      await addOrden(payload)
      navigate('/')
    } catch (err) {
      setError('Error creando orden')
    }
  }

  return (
    <section>
      <h2>Crear Orden</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Vehículo</label>
          <select value={form.vehiculo_patente} onChange={e => setForm({ ...form, vehiculo_patente: e.target.value })}>
            <option value="">-- seleccionar --</option>
            {vehiculos.map(v => <option key={v.id} value={v.patente}>{v.patente} - {v.modelo}</option>)}
          </select>
        </div>
        <div>
          <label>Chofer</label>
          <select value={form.chofer_nombre} onChange={e => setForm({ ...form, chofer_nombre: e.target.value })}>
            <option value="">-- seleccionar --</option>
            {choferes.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
          </select>
        </div>
        <div>
          <label>KM ingreso</label>
          <input value={form.km_ingreso} onChange={e => setForm({ ...form, km_ingreso: e.target.value })} />
        </div>
        <div>
          <button type="submit">Crear</button>
        </div>
      </form>
    </section>
  )
}
