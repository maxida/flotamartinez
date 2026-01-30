import React from 'react'
import useCollection from '../hooks/useCollection'
export default function Choferes() {
  const { data: choferes, loading, error } = useCollection('choferes')

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Choferes</h2>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">Error: {error.message}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 uppercase text-xs font-bold">
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Estado</th>
                <th className="px-3 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {choferes.map((c) => (
                <tr key={c.id} className="border-b last:border-b-0 hover:bg-slate-50">
                  <td className="px-3 py-3 align-top">{c.nombre || c.name || '-'}</td>
                  <td className="px-3 py-3 align-top">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold text-green-700 bg-green-100">Activo</span>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <button
                      type="button"
                      title="Editar"
                      className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-100 text-slate-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4h6m2 2v6M4 20l4-4 10-10a2.828 2.828 0 114 4L12 20H4z" />
                      </svg>
                    </button>
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
