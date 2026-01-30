import React from 'react'
import useCollection from '../hooks/useCollection'

// Función auxiliar para formatear fechas de forma inteligente
// Acepta: Timestamp de Firestore, String de fecha (ISO), u objeto Date
const formatDate = (dateValue) => {
  if (!dateValue) return null;
  
  // Caso 1: Es un Timestamp de Firestore (tiene método toDate)
  if (typeof dateValue.toDate === 'function') {
    return dateValue.toDate();
  }
  
  // Caso 2: Es un string (ej: "2025-09-01") o fecha normal
  const date = new Date(dateValue);
  // Validar si es una fecha válida
  if (isNaN(date.getTime())) return null;
  
  return date;
}

// Formateador de Kilómetros
const formatKm = (value) => {
  // Buscamos 'kilometros', 'km' o 'kilometraje'
  if (value === undefined || value === null) return 'N/A';
  return Number(value).toLocaleString('es-AR') + ' km';
}

export default function Vehiculos() {
  // Traemos los datos de la colección 'vehiculos'
  const { data: vehiculos, loading, error } = useCollection('vehiculos')
  
  const today = new Date();
  today.setHours(0,0,0,0); // Normalizar hoy a las 00:00

  // Renderizador de Badges (Etiquetas de color)
  const renderDateBadge = (rawDate) => {
    const date = formatDate(rawDate);
    
    if (!date) return <span className="text-gray-400 text-sm">-</span>;

    const isExpired = date < today;
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isSoon = diffDays > 0 && diffDays <= 30; // Vence en 30 días

    let styleClass = "bg-green-100 text-green-800 border-green-200"; // Por defecto OK
    let icon = "✅";

    if (isExpired) {
      styleClass = "bg-red-100 text-red-800 border-red-200 font-bold";
      icon = "🚨";
    } else if (isSoon) {
      styleClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
      icon = "⚠️";
    }

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs border ${styleClass} inline-flex items-center gap-1`}>
        {icon} {date.toLocaleDateString('es-AR')}
      </span>
    );
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Flota de Vehículos</h1>
          <p className="text-slate-500 text-sm">Estado general de VTV, Obleas y Kilometraje</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border text-sm text-slate-600">
          Total: <span className="font-bold text-indigo-600">{vehiculos ? vehiculos.length : 0}</span> Unidades
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700 font-bold">Error de conexión:</p>
          <p className="text-red-600 text-sm">{error.message}</p>
          <p className="text-xs text-red-500 mt-1">Revisa tu archivo .env.local y config.js</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                <th className="px-6 py-4">Patente</th>
                <th className="px-6 py-4">Vehículo</th>
                <th className="px-6 py-4">Kilometraje</th>
                <th className="px-6 py-4">Vencimiento VTV</th>
                <th className="px-6 py-4">Vencimiento GNC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehiculos.map((vehiculo) => (
                <tr key={vehiculo.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-300">
                      {vehiculo.patente}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">
                        {vehiculo.modelo || 'Modelo Desconocido'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {vehiculo.anio || vehiculo.year || '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">
                    {formatKm(vehiculo.kilometros ?? vehiculo.km)}
                  </td>
                  <td className="px-6 py-4">
                    {renderDateBadge(vehiculo.vtv_vencimiento ?? vehiculo.vtv)}
                  </td>
                  <td className="px-6 py-4">
                    {renderDateBadge(vehiculo.oblea_vencimiento ?? vehiculo.oblea)}
                  </td>
                </tr>
              ))}
              
              {vehiculos.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400 italic">
                    No hay vehículos registrados en la base de datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}