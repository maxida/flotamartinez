import React, { useMemo } from 'react'
import useCollection from '../hooks/useCollection'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts'

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

const STATUS_KEYS = ['FINALIZADO', 'EN PROCESO', 'PENDIENTE', 'TALLER', 'OTRO']
const COLORS = {
  'FINALIZADO': '#16a34a',
  'EN PROCESO': '#0369a1',
  'PENDIENTE': '#d97706',
  'TALLER': '#0ea5a4',
  'OTRO': '#64748b'
}

export default function Dashboard() {
  const { data: ordenes = [], loading, error } = useCollection('ordenes')

  // derive driver stats
  const { drivers, barData, pieData, top3, mostAlerts, leastAlerts } = useMemo(() => {
    const map = new Map()
    for (const o of ordenes || []) {
      const name = (o.chofer_nombre || 'Sin Nombre').toString().trim() || 'Sin Nombre'
      const estado = (o.estado_trabajo || 'OTRO').toString().trim().toUpperCase()
      const observacion = (o.observaciones || '')?.toString().trim()

      if (!map.has(name)) map.set(name, { name, total: 0, obs: 0, byStatus: { 'FINALIZADO': 0, 'EN PROCESO': 0, 'PENDIENTE': 0, 'TALLER': 0, 'OTRO': 0 } })
      const entry = map.get(name)
      entry.total += 1
      if (observacion) entry.obs += 1
      // normalize status keys
      const key = STATUS_KEYS.includes(estado) ? estado : (estado === 'EN_PROCESO' ? 'EN PROCESO' : (estado === 'EN_CURSO' ? 'EN PROCESO' : 'OTRO'))
      entry.byStatus[key] = (entry.byStatus[key] || 0) + 1
    }

    const driversArr = Array.from(map.values())

    // barData: array of { name, FINALIZADO, 'EN PROCESO', PENDIENTE, TALLER, OTRO }
    const barData = driversArr.map(d => ({ name: d.name, ...d.byStatus }))

    // pieData: top 3 by total
    const sortedByTotal = driversArr.slice().sort((a, b) => b.total - a.total)
    const top3 = sortedByTotal.slice(0, 3)
    const pieData = top3.map(d => ({ name: d.name, value: d.total }))

    // most alerts (max obs)
    let mostAlerts = null
    let leastAlerts = null
    if (driversArr.length > 0) {
      mostAlerts = driversArr.slice().sort((a, b) => b.obs - a.obs)[0]
      // pick least >0 if exists
      const withPositive = driversArr.filter(d => d.obs > 0)
      if (withPositive.length > 0) {
        leastAlerts = withPositive.slice().sort((a, b) => (a.obs - b.obs) || (b.total - a.total))[0]
      } else {
        // else pick driver with zero obs and most trips
        leastAlerts = driversArr.slice().filter(d => d.obs === 0).sort((a, b) => b.total - a.total)[0] || driversArr[0]
      }
    }

    return { drivers: driversArr, barData, pieData, top3, mostAlerts, leastAlerts }
  }, [ordenes])

  // recent orders
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
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-xl shadow-sm p-5">
          <div className="text-sm text-red-600">Mayor Tasa de Alertas</div>
          <div className="mt-2 text-2xl font-semibold text-red-700">{mostAlerts ? mostAlerts.name : '-'}</div>
          <div className="text-sm text-red-500">{mostAlerts ? `${mostAlerts.obs} observaciones` : 'Sin alertas'}</div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl shadow-sm p-5">
          <div className="text-sm text-green-600">Chofer Destacado (Impecable)</div>
          <div className="mt-2 text-2xl font-semibold text-green-700">{leastAlerts ? leastAlerts.name : '-'}</div>
          <div className="text-sm text-green-500">{leastAlerts ? `${leastAlerts.obs} observaciones` : 'Sin datos'}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-sm text-slate-500">Órdenes totales</div>
          <div className="mt-2 text-2xl font-semibold text-slate-800">{Array.isArray(ordenes) ? ordenes.length : 0}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 w-full">
          <h4 className="text-sm font-semibold text-slate-800 mb-2">Entradas por Chofer (por Estado)</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="FINALIZADO" stackId="a" fill={COLORS['FINALIZADO']} />
                <Bar dataKey="EN PROCESO" stackId="a" fill={COLORS['EN PROCESO']} />
                <Bar dataKey="PENDIENTE" stackId="a" fill={COLORS['PENDIENTE']} />
                <Bar dataKey="TALLER" stackId="a" fill={COLORS['TALLER']} />
                <Bar dataKey="OTRO" stackId="a" fill={COLORS['OTRO']} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 w-full">
          <h4 className="text-sm font-semibold text-slate-800 mb-2">Top 3 Choferes Más Activos</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[[...Object.keys(COLORS)][index]] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent activity (existing table) */}
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
