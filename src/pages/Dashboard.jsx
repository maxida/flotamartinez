import { useEffect, useState } from 'react'
import { getVehiculos } from '../services/vehiculosService'
import { getOrdenes } from '../services/ordenesService'

export default function Dashboard() {
  const [vehiculos, setVehiculos] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const v = await getVehiculos()
      const o = await getOrdenes()
      setVehiculos(v)
      setOrdenes(o)
    } catch (err) {
      console.error(err)
    } finally { setLoading(false) }
  }

  // example KPIs
  const totalVeh = vehiculos.length
  const enTaller = ordenes.filter(x => x.estado_trabajo === 'EN_PROCESO').length
  // gasto del mes: sum costs if reparaciones_realizadas.costo present
  const gastoMes = ordenes.reduce((sum, ord) => {
    if (!Array.isArray(ord.reparaciones_realizadas)) return sum
    return sum + ord.reparaciones_realizadas.reduce((s, r) => s + (r.costo || 0), 0)
  }, 0)

  return (
    <section>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="text-sm text-slate-500">Total Vehículos</div>
          <div className="mt-2 text-2xl font-semibold text-slate-800">{totalVeh}</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="text-sm text-slate-500">En Taller Ahora</div>
          <div className="mt-2 text-2xl font-semibold text-slate-800">{enTaller}</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="text-sm text-slate-500">Gasto del Mes</div>
          <div className="mt-2 text-2xl font-semibold text-slate-800">${gastoMes}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Últimas Órdenes</h3>
        <ul className="divide-y divide-slate-100">
          {ordenes.slice(0,6).map(o => (
            <li key={o.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800">{o.vehiculo_patente} — {o.chofer_nombre}</div>
                <div className="text-sm text-slate-500">{o.fecha_ingreso && o.fecha_ingreso.toDate ? o.fecha_ingreso.toDate().toLocaleDateString() : '-'}</div>
              </div>
              <div className="text-sm text-slate-600">{o.estado_trabajo}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
