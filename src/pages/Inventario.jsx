import React, { useState, useMemo } from 'react'
import useCollection from '../hooks/useCollection'
import { addInventario, updateInventario, deleteInventario, changeStock } from '../services/inventarioService'

export default function Inventario() {
  const { data: items, loading, error } = useCollection('inventario')
  const sortedItems = useMemo(() => {
    if (!Array.isArray(items)) return []
    return [...items].sort((a, b) => {
      const na = (a.nombre || '').toString()
      const nb = (b.nombre || '').toString()
      return na.localeCompare(nb, 'es', { sensitivity: 'base' })
    })
  }, [items])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [form, setForm] = useState({ nombre: '', categoria: '', compatibilidad: '', stock: 0 })

  const openNew = () => {
    setEditing(null)
    setForm({ nombre: '', categoria: '', compatibilidad: '', stock: 0 })
    setShowForm(true)
  }

  const openEdit = (it) => {
    setEditing(it)
    setForm({ nombre: it.nombre || '', categoria: it.categoria || '', compatibilidad: it.compatibilidad || '', stock: it.stock || 0 })
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e && e.preventDefault()
    setBusy(true)
    try {
      const payload = { ...form, stock: Number(form.stock) || 0 }
      if (editing && editing.id) {
        await updateInventario(editing.id, payload)
        alert('Repuesto actualizado')
      } else {
        const res = await addInventario(payload)
        if (res?.id) alert('Repuesto creado')
      }
      setShowForm(false)
    } catch (err) {
      console.error(err)
      alert('Error al guardar')
    } finally { setBusy(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar artículo?')) return
    try {
      await deleteInventario(id)
      alert('Eliminado')
    } catch (err) {
      console.error(err)
      alert('Error eliminando')
    }
  }

  const adjustStock = async (id, delta) => {
    setUpdatingId(id)
    try {
      await changeStock(id, delta)
    } catch (err) {
      console.error(err)
      alert('Error actualizando stock')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Control de Inventario</h1>
          <p className="text-slate-500 text-sm">Administra el stock de repuestos</p>
        </div>
        <div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={openNew}>+ Nuevo Repuesto</button>
        </div>
      </div>

      {loading && <p>Cargando inventario...</p>}
      {error && <p className="text-red-600">Error: {error.message}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-xs font-bold border-b border-slate-200">
                  <th className="px-6 py-3">Artículo</th>
                  <th className="px-6 py-3">Categoría</th>
                  <th className="px-6 py-3">Compatibilidad</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {Array.isArray(sortedItems) && sortedItems.map(it => (
                  <tr key={it.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-700">{it.nombre}</td>
                    <td className="px-6 py-3 text-slate-600">{it.categoria || '-'}</td>
                    <td className="px-6 py-3 text-slate-600">{it.compatibilidad || '-'}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <button disabled={updatingId === it.id} className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-60" onClick={() => adjustStock(it.id, -1)}>-</button>
                        <div className="w-10 text-center">
                          {(() => {
                            const s = (it.stock ?? 0)
                            return (
                              <span className={s === 0 ? 'text-red-600 font-semibold' : 'text-slate-900 font-bold'}>{s}</span>
                            )
                          })()}
                        </div>
                        <button disabled={updatingId === it.id} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 disabled:opacity-60" onClick={() => adjustStock(it.id, 1)}>+</button>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <button className="px-2 py-1 bg-slate-100 text-slate-700 rounded" onClick={() => openEdit(it)}>Editar</button>
                        <button className="px-2 py-1 bg-red-100 text-red-700 rounded" onClick={() => handleDelete(it.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!items || items.length === 0) && (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-400 italic">No hay repuestos en inventario.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form onSubmit={handleSave} className="w-full max-w-lg bg-white rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editing ? 'Editar Repuesto' : 'Agregar Nuevo Repuesto'}</h3>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="text-slate-500">X</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm text-slate-600">Nombre del Artículo *</label>
                <input required className="w-full px-3 py-2 border rounded" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value })} placeholder="Ej: Bujía NGK" />
              </div>
              <div>
                <label className="block text-sm text-slate-600">Categoría</label>
                <select className="w-full px-3 py-2 border rounded" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value })}>
                  <option value="">-- Seleccionar --</option>
                  <option>Filtros</option>
                  <option>Fluidos</option>
                  <option>Frenos</option>
                  <option>Motor</option>
                  <option>Suspensión</option>
                  <option>Electricidad</option>
                  <option>varios</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-600">Stock Inicial</label>
                <input type="number" className="w-full px-3 py-2 border rounded" value={form.stock} onChange={e => setForm({...form, stock: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-slate-600">Compatibilidad / Modelos (Opcional)</label>
                <input className="w-full px-3 py-2 border rounded" value={form.compatibilidad} onChange={e => setForm({...form, compatibilidad: e.target.value })} placeholder="Ej: Universal, VW Amarok, etc." />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="px-4 py-2 rounded border">Cancelar</button>
              <button type="submit" disabled={busy} className="px-4 py-2 rounded bg-indigo-600 text-white">{busy ? 'Guardando...' : (editing ? 'Guardar' : 'Guardar Repuesto')}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
