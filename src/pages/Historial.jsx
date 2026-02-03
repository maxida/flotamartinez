import React from 'react'
import useCollection from '../hooks/useCollection'

// Función para formatear fechas desde Firebase
const formatDate = (timestamp) => {
  if (!timestamp) return '-';
  // Si es un Timestamp de Firestore
  if (timestamp.toDate) return timestamp.toDate().toLocaleDateString('es-AR');
  // Si es un objeto Date o string
  return new Date(timestamp).toLocaleDateString('es-AR');
}

export default function Historial() {
  // Traemos TODAS las órdenes de la base de datos
  const { data: ordenes, loading, error } = useCollection('ordenes')

  // Filtramos solo las finalizadas y las ordenamos por fecha (más reciente primero)
  const historialOrdenado = ordenes 
    ? ordenes
        .filter(o => o.estado_trabajo === 'FINALIZADO')
        .sort((a, b) => {
           // Ordenar por fecha descendente
           const dateA = a.fecha_ingreso?.toDate ? a.fecha_ingreso.toDate() : new Date(0);
           const dateB = b.fecha_ingreso?.toDate ? b.fecha_ingreso.toDate() : new Date(0);
           return dateB - dateA;
        })
    : [];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Historial de Reparaciones</h1>
          <p className="text-slate-500 text-sm">Registro histórico y órdenes finalizadas</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border text-sm font-bold text-indigo-600">
          Total: {historialOrdenado.length} Registros
        </div>
      </div>

      {loading && <p className="text-center py-4">Cargando historial...</p>}
      {error && <p className="text-red-600">Error: {error.message}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 uppercase text-xs font-bold border-b border-slate-200">
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Vehículo</th>
                <th className="px-6 py-3">Chofer</th>
                <th className="px-6 py-3">Detalle Reparación</th>
                <th className="px-6 py-3">Novedad / Observación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {historialOrdenado.map((orden) => (
                <tr key={orden.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-700 whitespace-nowrap">
                    {formatDate(orden.fecha_ingreso)}
                  </td>
                  <td className="px-6 py-3">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-mono font-bold border border-indigo-100">
                      {orden.vehiculo_patente}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-600 capitalize">
                    {orden.chofer_nombre?.toLowerCase()}
                  </td>
                  <td className="px-6 py-3 text-slate-600">
                    {/* Renderizar objeto de reparaciones o texto */}
                    {orden.detalle_reparacion && typeof orden.detalle_reparacion === 'object' ? (
                      <ul className="list-disc list-inside">
                        {Object.entries(orden.detalle_reparacion).map(([key, val]) => (
                          <li key={key}>
                            <span className="font-semibold capitalize">{key.replace('_', ' ')}:</span> {val}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>{orden.detalle_reparacion || '-'}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-slate-500 italic">
                    {orden.observaciones || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}