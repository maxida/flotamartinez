import React, { useMemo } from 'react'
import useCollection from '../hooks/useCollection'

const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  if (typeof timestamp.toDate === 'function') return timestamp.toDate().toLocaleDateString('es-AR')
  return new Date(timestamp).toLocaleDateString('es-AR')
}

const renderEstadoBadge = (estado) => {
  const v = (estado || '').toString().trim().toUpperCase()
  if (!v) return <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">-</span>
  if (v === 'FINALIZADO') return <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 font-medium">FINALIZADO</span>
  if (v === 'PENDIENTE') return <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800 font-medium">PENDIENTE</span>
  if (v === 'EN PROCESO' || v === 'EN_PROCESO' || v === 'TALLER') return <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">{estado}</span>
  return <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">{estado}</span>
}

export default function Dashboard() {
  const { data: ordenes = [], loading, error } = useCollection('ordenes')

  // sort by fecha_ingreso desc and take latest 10
  const latest = useMemo(() => {
    if (!Array.isArray(ordenes)) return []
    const sorted = [...ordenes].sort((a, b) => {
      const ta = a.fecha_ingreso?.toDate ? a.fecha_ingreso.toDate().getTime() : (new Date(a.fecha_ingreso || 0)).getTime()
      const tb = b.fecha_ingreso?.toDate ? b.fecha_ingreso.toDate().getTime() : (new Date(b.fecha_ingreso || 0)).getTime()
      return tb - ta
    })
    return sorted.slice(0, 10)
  }, [ordenes])

  return (
    <section className="w-full">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-sm text-slate-500">Órdenes totales</div>
          <div className="mt-2 text-2xl font-semibold text-slate-800">{Array.isArray(ordenes) ? ordenes.length : 0}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-sm text-slate-500">Finalizadas</div>
          <div className="mt-2 text-2xl font-semibold text-slate-800">{ordenes.filter(o => (o.estado_trabajo || '').toUpperCase() === 'FINALIZADO').length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-sm text-slate-500">En taller</div>
          <div className="mt-2 text-2xl font-semibold text-slate-800">{ordenes.filter(o => ['EN PROCESO','EN_PROCESO','TALLER'].includes((o.estado_trabajo || '').toUpperCase())).length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 w-full">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Actividad Reciente — Últimas Órdenes</h3>
        {loading && <div className="text-sm text-slate-500">Cargando órdenes...</div>}
        {error && <div className="text-sm text-red-600">Error cargando órdenes</div>}

        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-xs font-bold border-b border-slate-200">
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Patente</th>
                  <th className="px-4 py-2">Chofer</th>
                  <th className="px-4 py-2">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {latest.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 w-36 font-medium">{formatDate(o.fecha_ingreso)}</td>
                    <td className="px-4 py-2 font-mono font-semibold text-slate-700">{o.vehiculo_patente || '-'}</td>
                    <td className="px-4 py-2 text-slate-600">{o.chofer_nombre || '-'}</td>
                    <td className="px-4 py-2">{renderEstadoBadge(o.estado_trabajo)}</td>
                  </tr>
                ))}
                {latest.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-400">No hay órdenes recientes.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
