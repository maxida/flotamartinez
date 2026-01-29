import { useEffect, useState } from 'react'
import { getOrdenes } from '../services/ordenesService'

function formatDate(o) {
  if (!o) return '-'
  if (o.toDate) return o.toDate().toLocaleDateString()
  try { return new Date(o).toLocaleDateString() } catch { return '-' }
}

function EstadoBadge({ estado }) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold'
  if (!estado) return <span className={base + ' bg-slate-100 text-slate-700'}>-</span>
  if (estado === 'FINALIZADO') return <span className={base + ' bg-emerald-100 text-emerald-800'}>Finalizado</span>
  if (estado === 'EN_PROCESO') return <span className={base + ' bg-amber-100 text-amber-800'}>En Proceso</span>
  if (estado === 'PENDIENTE') return <span className={base + ' bg-indigo-100 text-indigo-800'}>Pendiente</span>
  return <span className={base + ' bg-slate-100 text-slate-700'}>{estado}</span>
}

export default function Historial() {
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await getOrdenes()
      const normalized = data.map(o => ({
        ...o,
        fecha_js: o.fecha_ingreso && typeof o.fecha_ingreso.toDate === 'function' ? o.fecha_ingreso.toDate() : (o.fecha_ingreso ? new Date(o.fecha_ingreso) : null)
      }))
      normalized.sort((a, b) => (b.fecha_js?.getTime() || 0) - (a.fecha_js?.getTime() || 0))
      setOrdenes(normalized)
    } catch (err) {
      setError('No se pudo cargar el historial')
    } finally { setLoading(false) }
  }

  return (
    <section className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Historial de Órdenes</h2>
        <div className="text-sm text-slate-500">Últimas entradas</div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div className="py-10 text-center text-slate-500">Cargando...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Patente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Chofer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">KM</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Reparaciones / Novedad</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {ordenes.map(o => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-700">{o.fecha_js ? o.fecha_js.toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 font-medium">{o.vehiculo_patente}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{o.chofer_nombre}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{o.km_ingreso || '-'}</td>
                  <td className="px-4 py-3 text-sm"> <EstadoBadge estado={o.estado_trabajo} /> </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {Array.isArray(o.reparaciones_realizadas) && o.reparaciones_realizadas.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {o.reparaciones_realizadas.map((r, idx) => (
                          <li key={idx} className="text-slate-700">{r.item}: {r.detalle || r.costo}</li>
                        ))}
                      </ul>
                    ) : ('-')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
