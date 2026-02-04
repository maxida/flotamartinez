import React, { useState, useEffect } from 'react'
import useCollection from '../hooks/useCollection'
import { addChofer, updateChofer, deleteChofer } from '../services/choferesService'

export default function Choferes() {
  const { data: choferes, loading, error } = useCollection('chofer')

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null) // chofer being edited
  const [form, setForm] = useState({ nombre: '', telefono: '', estado: 'Activo', observacion: '' })
  const [busy, setBusy] = useState(false)
  const [filterName, setFilterName] = useState('')
  const [sortField, setSortField] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  useEffect(() => {
    if (editing) {
      // prefill form with existing values (support older keys)
      setForm({
        nombre: editing.nombre || editing.name || '',
        telefono: editing.telefono || editing.phone || '',
        estado: editing.estado || 'Activo',
        observacion: editing.observacion || editing.obs || ''
      })
    } else {
      setForm({ nombre: '', telefono: '', estado: 'Activo', observacion: '' })
    }
  }, [editing])

  async function handleSave(e) {
    e && e.preventDefault()
    setBusy(true)
    try {
      const payload = {
        nombre: form.nombre,
        telefono: form.telefono,
        estado: form.estado,
        observacion: form.observacion
      }

      if (editing) {
        await updateChofer(editing.id, payload)
      } else {
        await addChofer(payload)
      }

      setShowForm(false)
      setEditing(null)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Save chofer error', err)
      alert('Error al guardar chofer')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar chofer? Esta acción no se puede deshacer.')) return
    setBusy(true)
    try {
      await deleteChofer(id)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Delete chofer error', err)
      alert('Error al eliminar chofer')
    } finally { setBusy(false) }
  }

  // --- Filter + Sort helpers
  function getValueByField(item, field) {
    if (!item) return ''
    switch (field) {
      case 'nombre':
        return (item.nombre || item.name || '').toString()
      case 'telefono':
        return (item.telefono || item.phone || '').toString()
      case 'estado':
        return (item.estado || '').toString()
      case 'observacion':
        return (item.observacion || item.obs || '').toString()
      default:
        return (item[field] || '').toString()
    }
  }

  function getDisplayedChoferes(list) {
    let arr = Array.isArray(list) ? list.slice() : []
    const f = filterName && filterName.trim() ? filterName.trim().toLowerCase() : null
    if (f) {
      arr = arr.filter((c) => (getValueByField(c, 'nombre') || '').toLowerCase().includes(f))
    }

    if (sortField) {
      const dir = sortDir === 'asc' ? 1 : -1
      arr.sort((a, b) => {
        const av = (getValueByField(a, sortField) || '').toLowerCase()
        const bv = (getValueByField(b, sortField) || '').toLowerCase()
        return av.localeCompare(bv) * dir
      })
    }
    return arr
  }

  function toggleSort(field) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  function sortIndicator(field) {
    if (sortField !== field) return ''
    return sortDir === 'asc' ? '▲' : '▼'
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Personal de Conducción</h1>
          <p className="text-slate-500 text-sm">Gestión de choferes activos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border text-sm text-slate-600">
            Total: <span className="font-bold text-indigo-600">{choferes ? choferes.length : 0}</span> Choferes
          </div>
          <button
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded text-sm"
            onClick={() => { setEditing(null); setShowForm(true) }}
          >
            Agregar chofer
          </button>
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
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Filtrar por nombre:</label>
              <input
                className="border rounded px-3 py-1 text-sm"
                placeholder="Buscar nombre..."
                value={filterName}
                onChange={e => setFilterName(e.target.value)}
              />
            </div>
            <div className="text-sm text-slate-600">Mostrando: <span className="font-medium text-slate-800">{getDisplayedChoferes(choferes).length}</span></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                  <th className="px-6 py-4 cursor-pointer" onClick={() => toggleSort('nombre')}>Nombre {sortIndicator('nombre')}</th>
                  <th className="px-6 py-4 cursor-pointer" onClick={() => toggleSort('telefono')}>Teléfono {sortIndicator('telefono')}</th>
                  <th className="px-6 py-4 cursor-pointer" onClick={() => toggleSort('estado')}>Estado {sortIndicator('estado')}</th>
                  <th className="px-6 py-4 cursor-pointer" onClick={() => toggleSort('observacion')}>Observación {sortIndicator('observacion')}</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {getDisplayedChoferes(choferes).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{c.nombre || c.name || 'Sin Nombre'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{c.telefono || c.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        (c.estado === 'activo' || c.estado === 'Activo')
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {c.estado || 'Activo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{c.observacion || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          className="text-slate-400 hover:text-indigo-600 transition-colors p-2"
                          title="Editar"
                          onClick={() => { setEditing(c); setShowForm(true) }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="text-red-400 hover:text-red-600 transition-colors p-2"
                          title="Eliminar"
                          onClick={() => handleDelete(c.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {getDisplayedChoferes(choferes).length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400 italic">No hay choferes en la colección "chofer".</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-[720px] max-w-full">
            <form onSubmit={handleSave} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{editing ? 'Editar chofer' : 'Agregar chofer'}</h3>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="text-slate-500">Cerrar</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Nombre</label>
                  <input className="w-full border rounded px-3 py-2" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Teléfono</label>
                  <input className="w-full border rounded px-3 py-2" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Estado</label>
                  <select className="w-full border rounded px-3 py-2" value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}>
                    <option>Activo</option>
                    <option>Inactivo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Observación</label>
                  <input className="w-full border rounded px-3 py-2" value={form.observacion} onChange={e => setForm({ ...form, observacion: e.target.value })} />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="px-4 py-2 rounded border">Cancelar</button>
                <button type="submit" disabled={busy} className="px-4 py-2 rounded bg-indigo-600 text-white">{busy ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
