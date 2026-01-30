import React from 'react'
import useCollection from '../hooks/useCollection'

// --- CORRECCIÓN CLAVE: Parser de Fechas Argentinas ---
const formatDate = (dateValue) => {
  if (!dateValue) return null;
  
  // 1. Si es Timestamp de Firebase
  if (typeof dateValue.toDate === 'function') {
    return dateValue.toDate();
  }
  
  // 2. Si es string tipo "DD/MM/YYYY" (Formato Argentino/Excel)
  if (typeof dateValue === 'string' && dateValue.includes('/')) {
    // Convertimos "31/10/2025" a "2025-10-31" para que JS lo entienda
    const parts = dateValue.split('/');
    if (parts.length === 3) {
      // Asumimos [Día, Mes, Año]
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      // Creamos la fecha en formato ISO
      const isoDate = new Date(`${year}-${month}-${day}`);
      if (!isNaN(isoDate.getTime())) return isoDate;
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

  // Debug: Mira la consola del navegador (F12) para ver EXACTAMENTE qué datos llegan
  if (vehiculos?.length > 0) {
    console.log("🔍 Datos crudos del primer vehículo:", vehiculos[0]);
  }

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
      {loading && <p>Cargando...</p>}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
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
                {vehiculos.map((v) => {
                  // Mapeo seguro de campos
                  const patente = v.patente || v.dominio || v.DOMINIO || v.id || 'S/D';
                  const modelo = v.modelo || v.MODELO || v.modeloVehiculo || 'Desconocido';
                  const anio = v.anio || v.year || '';
                  const km = v.kilometros ?? v.km ?? v.kilometraje ?? null;
                  
                  // AQUI BUSCAMOS TODAS LAS VARIANTES DE NOMBRES
                  const fechaVTV = v.vtv_vencimiento || v.vtv || v.VTV || null;
                  const fechaOblea = v.oblea_vencimiento || v.oblea_vencimiento || v.oblea || v.OBLEA || null;

                  return (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-300">
                          {patente}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800 capitalize">{modelo}</span>
                          <span className="text-xs text-slate-400">{anio}</span>
                        </div>
                      </td>
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