import React from 'react'
import useCollection from '../hooks/useCollection'

// --- FUNCIÓN DE FECHAS MEJORADA (Soporta MM/AAAA) ---
const formatDate = (dateValue) => {
  if (!dateValue) return null;
  
  // 1. Si es Timestamp de Firebase
  if (typeof dateValue.toDate === 'function') {
    return dateValue.toDate();
  }
  
  // 2. Si es string
  if (typeof dateValue === 'string') {
    // Limpiamos espacios por si acaso
    const cleanDate = dateValue.trim();

    if (cleanDate.includes('/')) {
      const parts = cleanDate.split('/');

      // CASO A: Formato completo "DD/MM/YYYY" (Ej: "18/08/2025")
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        return new Date(year, month - 1, day);
      }

      // CASO B: Formato corto "MM/YYYY" (Ej: "09/2025" como se ve en tu Firebase)
      // Asumiremos que vence el ÚLTIMO día de ese mes.
      if (parts.length === 2) {
        const month = parseInt(parts[0], 10);
        const year = parseInt(parts[1], 10);
        // (year, month, 0) crea una fecha en el último día del mes anterior, 
        // por eso usamos month tal cual para obtener el último día de ESE mes.
        return new Date(year, month, 0); 
      }
    }
  }

  // 3. Intento final estándar (ISO o formato compatible)
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? null : date;
}

const formatKm = (value) => {
  if (value === undefined || value === null || value === '') return 'N/A';
  const num = Number(value);
  return isNaN(num) ? value : `${num.toLocaleString('es-AR')} km`;
}

// Badge de Estado
const RenderDateBadge = ({ dateRaw }) => {
  const date = formatDate(dateRaw);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!date) return <span className="text-gray-400 text-sm">-</span>;

  const isExpired = date < today;
  const diffTime = date - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  // Avisar si vence en los próximos 30 días
  const isSoon = diffDays > 0 && diffDays <= 30; 

  let styles = "bg-green-100 text-green-800 border-green-200";
  let icon = "✅";

  if (isExpired) {
    styles = "bg-red-100 text-red-800 border-red-200 font-bold";
    icon = "🚨";
  } else if (isSoon) {
    styles = "bg-yellow-100 text-yellow-800 border-yellow-200 font-medium";
    icon = "⚠️";
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs border ${styles} inline-flex items-center gap-1 whitespace-nowrap`}>
      {icon} {date.toLocaleDateString('es-AR')}
    </span>
  );
};

export default function Vehiculos() {
  const { data: vehiculos, loading, error } = useCollection('vehiculo')

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

      {error && <p className="text-red-600">Error: {error.message}</p>}
      {loading && <div className="text-center py-4">Cargando flota...</div>}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                  <th className="px-6 py-4">Patente</th>
                  <th className="px-6 py-4">Vehículo</th>
                  <th className="px-6 py-4">Año</th>
                  <th className="px-6 py-4">Kilometraje</th>
                  <th className="px-6 py-4">Vencimiento VTV</th>
                  <th className="px-6 py-4">Vencimiento GNC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehiculos.map((v) => {
                  // Mapeo seguro de campos según tu imagen de Firebase
                  const patente = v.patente || v.dominio || v.DOMINIO || v.id || 'S/D';
                  const modelo = v.modelo || v.MODELO || 'Desconocido';
                  // Support the Firebase field named "año" (con tilde) además de anio/year
                  const anio = v['año'] ?? v.anio ?? v.year ?? '';
                  const km = v.kilometros ?? v.km ?? null;
                  
                  // Nombres exactos vistos en tu imagen (VTV y oblea)
                  const fechaVTV = v.VTV || v.vtv || v.vtv_vencimiento || null;
                  const fechaOblea = v.oblea || v.OBLEA || v.oblea_vencimiento || null;

                  return (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-300">
                          {patente}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-800 capitalize">{modelo}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{anio || '-'}</td>
                      <td className="px-6 py-4 font-medium text-slate-600">{formatKm(km)}</td>
                      <td className="px-6 py-4">
                        <RenderDateBadge dateRaw={fechaVTV} />
                      </td>
                      <td className="px-6 py-4">
                        <RenderDateBadge dateRaw={fechaOblea} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}