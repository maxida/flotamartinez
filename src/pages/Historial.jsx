import React, { useState, useMemo } from 'react'
import useCollection from '../hooks/useCollection'
import { addOrden, updateOrden, deleteOrden, deleteFinalizados } from '../services/ordenesService'

// Función para formatear fechas desde Firebase
const formatDate = (timestamp) => {
  if (!timestamp) return '-';
  // Si es un Timestamp de Firestore
  if (timestamp.toDate) return timestamp.toDate().toLocaleDateString('es-AR');
  // Si es un objeto Date o string
  return new Date(timestamp).toLocaleDateString('es-AR');
}
// Render small badge for estado_trabajo
const renderEstadoBadge = (estado) => {
  const v = (estado || '').toString().trim().toUpperCase()
  if (!v) return <span className="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">-</span>

  if (v === 'FINALIZADO') {
    return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">FINALIZADO</span>
  }

  // EN PROCESO / TALLER variants
  if (v === 'EN PROCESO' || v === 'EN_PROCESO' || v === 'EN_CURSO' || v === 'ENCURSO' || v === 'TALLER' || v === 'EN_CURSO') {
    return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">{estado}</span>
  }

  if (v === 'PENDIENTE') {
    return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 font-medium">PENDIENTE</span>
  }

  // Default: neutral badge
  return <span className="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">{estado}</span>
}
export default function Historial() {
  // Traemos TODAS las órdenes de la base de datos
  const { data: ordenes, loading, error } = useCollection('ordenes')
  const [patenteFilter, setPatenteFilter] = useState('')
  const [choferFilter, setChoferFilter] = useState('')

  const [sortField, setSortField] = useState('fecha_ingreso')
  const [sortDir, setSortDir] = useState('desc') // 'asc' | 'desc'

  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null) // orden object or null
  const [includedIds, setIncludedIds] = useState([]) // keep recently created/edited ids visible
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState({
    vehiculo_patente: '', chofer_nombre: '', fecha: '', km_ingreso: '', estado_trabajo: 'FINALIZADO', detalle_reparacion: '', observaciones: ''
  })

  // Mostramos todas las órdenes (no filtradas por estado) y aplicamos orden/filtrado en memoria

  // Helpers: get displayed ordenes after applying filters and sort
  const getValueByField = (item, field) => {
    if (!item) return ''
    if (field === 'fecha_ingreso') return item.fecha_ingreso?.toDate ? item.fecha_ingreso.toDate().getTime() : (new Date(item.fecha_ingreso || 0)).getTime()
    return (item[field] || '').toString().toLowerCase()
  }

  const filteredAndSorted = useMemo(() => {
    if (!ordenes) return []
    // start from all orders (copy array to avoid mutating source)
    let list = Array.isArray(ordenes) ? [...ordenes] : []
    // apply patente / chofer filters
    list = list.filter(o => {
      const pMatch = !patenteFilter || (o.vehiculo_patente || '').toLowerCase().includes(patenteFilter.toLowerCase())
      const cMatch = !choferFilter || (o.chofer_nombre || '').toLowerCase().includes(choferFilter.toLowerCase())
      return pMatch && cMatch
    })

    list.sort((a, b) => {
      const va = getValueByField(a, sortField)
      const vb = getValueByField(b, sortField)
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [ordenes, patenteFilter, choferFilter, sortField, sortDir, includedIds])

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const sortIndicator = (field) => {
    if (sortField !== field) return ''
    return sortDir === 'asc' ? '↑' : '↓'
  }

  const openNew = () => {
    setEditing(null)
    setForm({ vehiculo_patente: '', chofer_nombre: '', fecha: '', km_ingreso: '', estado_trabajo: 'FINALIZADO', detalle_reparacion: '', observaciones: '' })
    setShowForm(true)
  }

  const openEdit = (orden) => {
    setEditing(orden)
    const fechaVal = orden.fecha_ingreso?.toDate ? orden.fecha_ingreso.toDate().toISOString().slice(0,10) : ''
    setForm({
      vehiculo_patente: orden.vehiculo_patente || '',
      chofer_nombre: orden.chofer_nombre || '',
      fecha: fechaVal,
      km_ingreso: orden.km_ingreso || '',
      estado_trabajo: orden.estado_trabajo || 'FINALIZADO',
      detalle_reparacion: typeof orden.detalle_reparacion === 'object' ? JSON.stringify(orden.detalle_reparacion) : (orden.detalle_reparacion || ''),
      observaciones: orden.observaciones || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta orden? Esta acción es irreversible.')) return
    try {
      await deleteOrden(id)
      alert('Orden eliminada')
    } catch (err) {
      console.error(err)
      alert('Error eliminando orden')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        vehiculo_patente: form.vehiculo_patente,
        chofer_nombre: form.chofer_nombre,
        fecha_ingreso: form.fecha ? new Date(form.fecha) : new Date(),
        fecha_salida: form.fecha ? new Date(form.fecha) : new Date(),
        km_ingreso: Number(form.km_ingreso) || 0,
        estado_trabajo: form.estado_trabajo || 'FINALIZADO',
        detalle_reparacion: form.detalle_reparacion || '',
        observaciones: form.observaciones || ''
      }
      if (editing && editing.id) {
        await updateOrden(editing.id, payload)
        // ensure the just-edited record remains visible even if its estado changed
        setIncludedIds(prev => prev.includes(editing.id) ? prev : [...prev, editing.id])
        alert('Orden actualizada')
      } else {
        console.debug('[Historial] addOrden payload', payload)
        const res = await addOrden(payload)
        console.debug('[Historial] addOrden result', res)
        if (res?.id) setIncludedIds(prev => prev.includes(res.id) ? prev : [...prev, res.id])
        alert('Orden creada')
      }
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      console.error(err)
      alert('Error guardando orden')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Historial de Reparaciones</h1>
          <p className="text-slate-500 text-sm">Registro histórico y órdenes finalizadas</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border text-sm font-bold text-indigo-600">
            Total: {filteredAndSorted.length} Registros
          </div>
            <button className="bg-emerald-500 text-white px-3 py-1 rounded text-sm" onClick={openNew}>Agregar orden</button>
            <button disabled={deleting} onClick={async () => {
              if (!confirm('¿Eliminar TODO el historial de órdenes finalizadas? Esta acción es irreversible.')) return
              setDeleting(true)
              try {
                const res = await deleteFinalizados()
                alert(`Se eliminaron ${res.deleted || 0} registros finalizados.`)
                // clear any included ids we were keeping
                setIncludedIds([])
              } catch (err) {
                console.error(err)
                alert('Error eliminando historial')
              } finally {
                setDeleting(false)
              }
            }} className="bg-red-500 text-white px-3 py-1 rounded text-sm">{deleting ? 'Eliminando...' : 'Eliminar historial'}</button>
        </div>
      </div>

      <div className="mb-4 flex gap-3">
        <input placeholder="Filtrar por patente" value={patenteFilter} onChange={e=>setPatenteFilter(e.target.value)} className="px-3 py-2 border rounded" />
        <input placeholder="Filtrar por chofer" value={choferFilter} onChange={e=>setChoferFilter(e.target.value)} className="px-3 py-2 border rounded" />
      </div>

     

      {loading && <p className="text-center py-4">Cargando historial...</p>}
      {error && <p className="text-red-600">Error: {error.message}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" style={{ marginLeft: '-1cm' }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 uppercase text-xs font-bold border-b border-slate-200">
                <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('fecha_ingreso')}>Fecha {sortIndicator('fecha_ingreso')}</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('vehiculo_patente')}>Vehículo {sortIndicator('vehiculo_patente')}</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('chofer_nombre')}>Chofer {sortIndicator('chofer_nombre')}</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('estado_trabajo')}>Estado {sortIndicator('estado_trabajo')}</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('detalle_reparacion')}>Detalle Reparación {sortIndicator('detalle_reparacion')}</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('observaciones')}>Novedad / Observación {sortIndicator('observaciones')}</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAndSorted.map((orden) => (
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
                  <td className="px-6 py-3">
                    {renderEstadoBadge(orden.estado_trabajo)}
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
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm" onClick={() => openEdit(orden)}>Editar</button>
                      <button className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm" onClick={() => handleDelete(orden.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal / Form para agregar / editar orden */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{editing ? 'Editar Orden' : 'Nueva Orden'}</h2>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="text-slate-500">Cerrar</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600">Patente</label>
                <input className="w-full px-3 py-2 border rounded" value={form.vehiculo_patente} onChange={e => setForm({...form, vehiculo_patente: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-slate-600">Chofer</label>
                <input className="w-full px-3 py-2 border rounded" value={form.chofer_nombre} onChange={e => setForm({...form, chofer_nombre: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-slate-600">Fecha</label>
                <input type="date" className="w-full px-3 py-2 border rounded" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-slate-600">Km ingreso</label>
                <input type="number" className="w-full px-3 py-2 border rounded" value={form.km_ingreso} onChange={e => setForm({...form, km_ingreso: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-slate-600">Estado</label>
                <select className="w-full px-3 py-2 border rounded" value={form.estado_trabajo} onChange={e => setForm({...form, estado_trabajo: e.target.value})}>
                  <option value="FINALIZADO">FINALIZADO</option>
                  <option value="EN PROCESO">EN PROCESO</option>
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="TALLER">TALLER</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-slate-600">Detalle Reparación</label>
                <textarea className="w-full px-3 py-2 border rounded" rows={3} value={form.detalle_reparacion} onChange={e => setForm({...form, detalle_reparacion: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-slate-600">Observaciones</label>
                <textarea className="w-full px-3 py-2 border rounded" rows={2} value={form.observaciones} onChange={e => setForm({...form, observaciones: e.target.value})} />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="px-4 py-2 rounded border">Cancelar</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-indigo-600 text-white">{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}