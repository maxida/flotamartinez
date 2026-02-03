import React from 'react'
import useCollection from '../hooks/useCollection'

export default function Choferes() {
  // CORRECCIÓN: Usamos 'chofer' (singular) como se ve en tu imagen de Firebase
  const { data: choferes, loading, error } = useCollection('chofer')

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header con estilo consistente */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Personal de Conducción</h1>
          <p className="text-slate-500 text-sm">Gestión de choferes activos</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border text-sm text-slate-600">
          Total: <span className="font-bold text-indigo-600">{choferes ? choferes.length : 0}</span> Choferes
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      )}
      
      {error && <p className="text-red-600 mb-4">Error: {error.message}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Teléfono</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {choferes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">
                        {/* Buscamos 'name' (visto en foto) o 'nombre' */}
                        {c.name || c.nombre || 'Sin Nombre'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {/* Agregamos el teléfono visto en la imagen */}
                      {c.phone || c.telefono || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        (c.estado === 'activo' || c.estado === 'Activo')
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {c.estado || 'Activo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        className="text-slate-400 hover:text-indigo-600 transition-colors p-2"
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}

                {choferes.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-400 italic">
                      No hay choferes en la colección "chofer".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
