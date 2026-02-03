import React, { useState, useMemo } from 'react'
import useCollection from '../hooks/useCollection'
import { db } from '../services/firebase'
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'

// --- HELPER FUNCTIONS ---
const formatDate = (dateValue) => {
  if (!dateValue) return null;
  if (typeof dateValue.toDate === 'function') return dateValue.toDate();
  if (typeof dateValue === 'string') {
    const cleanDate = dateValue.trim();
    if (cleanDate.includes('/')) {
      const parts = cleanDate.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        return new Date(year, month - 1, day);
      }
      if (parts.length === 2) { // Caso MM/AAAA
        const month = parseInt(parts[0], 10);
        const year = parseInt(parts[1], 10);
        return new Date(year, month, 0); 
      }
    }
  }
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? null : date;
}

const formatKm = (value) => {
  if (value === undefined || value === null || value === '') return 'N/A';
  // Normalize strings that may include dots or commas as thousand/decimal separators
  const cleaned = String(value).replace(/\./g, '').replace(/,/g, '');
  const num = Number(cleaned);
  return isNaN(num) ? String(value) : num.toLocaleString('es-AR');
}

// Badge de Vencimiento
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

// NUEVO: Badge Simple para Fecha de Trabajo (Gris/Neutro)
const RenderWorkDate = ({ dateRaw }) => {
    const date = formatDate(dateRaw);
    if (!date) return <span className="text-gray-400 text-sm">-</span>;
    return (
      <span className="text-slate-700 text-sm font-medium bg-slate-100 px-2 py-1 rounded border border-slate-200">
        📅 {date.toLocaleDateString('es-AR')}
      </span>
    );
};

export default function Vehiculos() {
  const { data: vehiculos, loading, error } = useCollection('vehiculo')

  // Agrupar por patente y mantener sólo el registro más reciente según fecha de trabajo
  const getLatestByPatente = (items) => {
    if (!Array.isArray(items)) return [];
    const map = new Map();

    const normalizePatente = (p) => (p || '').toString().trim().toUpperCase();

    for (const it of items) {
      const patenteRaw = it.patente || it.dominio || it.patent || it.id || '';
      const key = normalizePatente(patenteRaw) || `__no_patente__${it.id || Math.random()}`;

      const existing = map.get(key);

      const dateA = formatDate(it.fecha_trabajo || it.fecha || it.fechaTrabajo || it.updatedAt || null);
      const dateB = existing ? formatDate(existing.fecha_trabajo || existing.fecha || existing.fechaTrabajo || existing.updatedAt || null) : null;

      // Si no hay fecha, lo consideramos menos prioritario que uno con fecha
      let takeNew = false;
      if (dateA && dateB) {
        takeNew = dateA > dateB;
      } else if (dateA && !dateB) {
        takeNew = true;
      } else if (!dateA && !dateB) {
        // ninguno tiene fecha: preferir el más reciente en el array (reemplaza)
        takeNew = true;
      }

      if (!existing || takeNew) {
        map.set(key, it);
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      const da = formatDate(a.fecha_trabajo || a.fecha || a.fechaTrabajo || a.updatedAt || null);
      const db = formatDate(b.fecha_trabajo || b.fecha || b.fechaTrabajo || b.updatedAt || null);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return db - da; // ordenar descendente por fecha (más reciente primero)
    });
  };

  const latestVehiculos = useMemo(() => getLatestByPatente(vehiculos), [vehiculos]);

  // Search and sorting state
  const [searchPatente, setSearchPatente] = useState('');
  const [sortKey, setSortKey] = useState(null); // e.g. 'patente', 'modelo', 'anio', 'fecha_trabajo', 'kilometros'
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const getSortValue = (item, key) => {
    if (!item) return null;
    switch (key) {
      case 'patente':
        return (item.patente || item.dominio || '').toString().toUpperCase();
      case 'modelo':
        return (item.modelo || '').toString().toLowerCase();
      case 'anio':
        return item.anio === undefined || item.anio === null || item.anio === '' ? -Infinity : Number(item.anio);
      case 'kilometros':
      case 'km':
        // try numeric fields first
        const raw = item.kilometros ?? item.km ?? item.KM ?? null;
        if (raw === null || raw === undefined || raw === '') return -Infinity;
        // If stored as string like "131.354", remove dots
        const num = Number(String(raw).replace(/\./g, '').replace(/,/g, ''));
        return Number.isNaN(num) ? -Infinity : num;
      case 'fecha_trabajo':
      case 'fecha':
        const d = formatDate(item.fecha_trabajo || item.fecha || null);
        return d ? d.getTime() : 0;
      case 'vtv':
        const vtv = formatDate(item.vtv || item.VTV || item.vtv_vencimiento || null);
        return vtv ? vtv.getTime() : 0;
      case 'oblea':
        const ob = formatDate(item.oblea || item.oblea_vencimiento || item.OBLEA || null);
        return ob ? ob.getTime() : 0;
      default:
        return item[key] ?? '';
    }
  };

  const displayedVehiculos = useMemo(() => {
    let list = Array.isArray(latestVehiculos) ? [...latestVehiculos] : [];
    // Filter by patente
    if (searchPatente && searchPatente.trim() !== '') {
      const q = searchPatente.trim().toUpperCase();
      list = list.filter(v => (v.patente || v.dominio || '').toString().toUpperCase().includes(q));
    }
    // Sort
    if (sortKey) {
      list.sort((a, b) => {
        const va = getSortValue(a, sortKey);
        const vb = getSortValue(b, sortKey);
        if (va === vb) return 0;
        if (va === -Infinity || va === null) return 1;
        if (vb === -Infinity || vb === null) return -1;
        if (typeof va === 'number' && typeof vb === 'number') {
          return sortOrder === 'asc' ? va - vb : vb - va;
        }
        // string compare
        return sortOrder === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
      });
    }
    return list;
  }, [latestVehiculos, searchPatente, sortKey, sortOrder]);

  // CRUD modal state
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ patente: '', modelo: '', anio: '', km: '', fecha_trabajo: '', vtv: '', oblea: '' });

  const toDateInputValue = (dateRaw) => {
    const d = formatDate(dateRaw);
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const openNew = () => {
    setForm({ patente: '', modelo: '', anio: '', km: '', fecha_trabajo: '', vtv: '', oblea: '' });
    setEditMode(false);
    setShowModal(true);
  };

  const openEdit = (v) => {
    setForm({
      patente: v.patente || '',
      modelo: v.modelo || '',
      anio: v.anio || '',
      km: v.kilometros ?? v.km ?? '',
      fecha_trabajo: toDateInputValue(v.fecha_trabajo || v.fecha || null),
      vtv: toDateInputValue(v.vtv || v.VTV || v.vtv_vencimiento || v.vtv_vencimiento),
      oblea: toDateInputValue(v.oblea || v.OBLEA || v.oblea_vencimiento || v.oblea_vencimiento)
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleChange = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.patente || form.patente.trim() === '') {
      alert('La patente es obligatoria');
      return;
    }
    const id = form.patente.trim();
    const ref = doc(db, 'vehiculo', id);
    const payload = {
      patente: id,
      modelo: form.modelo || null,
      anio: form.anio ? Number(form.anio) : null,
      kilometros: form.km ? Number(String(form.km).replace(/\./g, '').replace(/,/g, '')) : null,
      fecha_trabajo: form.fecha_trabajo || null,
      vtv_vencimiento: form.vtv || null,
      oblea_vencimiento: form.oblea || null
    };

    try {
      if (editMode) {
        // updateDoc
        await updateDoc(ref, payload);
      } else {
        // create with setDoc
        await setDoc(ref, payload, { merge: true });
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('Error al guardar. Revisa la consola.');
    }
  };

  const handleDelete = async (pat) => {
    if (!window.confirm(`Eliminar vehículo ${pat}? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteDoc(doc(db, 'vehiculo', pat));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar. Revisa la consola.');
    }
  };

  return (
    <div className="w-full flex flex-col px-6 pb-6 pt-2 bg-slate-50 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mt-0">Flota de Vehículos</h1>
          <p className="text-slate-500 text-sm">Estado general de VTV, Obleas y Kilometraje</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border text-sm text-slate-600">
            Total: <span className="font-bold text-indigo-600">{displayedVehiculos ? displayedVehiculos.length : 0}</span> Unidades
            <span className="text-xs text-slate-400 ml-2">(únicas: {latestVehiculos ? latestVehiculos.length : 0})</span>
          </div>
          <button onClick={openNew} className="bg-emerald-600 text-white px-4 py-2 rounded shadow-sm">Nuevo Vehículo</button>
        </div>
      </div>

      {/* Search filter */}
      <div className="mb-4">
        <input
          type="text"
          value={searchPatente}
          onChange={(e) => setSearchPatente(e.target.value)}
          placeholder="Filtrar por patente..."
          className="w-64 px-3 py-2 border rounded-md text-sm shadow-sm"
        />
      </div>

      {error && <p className="text-red-600">Error: {error.message}</p>}
      {loading && <div className="text-center py-4">Cargando flota...</div>}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                  <th className="px-6 py-4">
                    <button onClick={() => handleSort('patente')} className="flex items-center gap-2">
                      <span>Patente</span>
                      <span className="text-xs">{sortKey === 'patente' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</span>
                    </button>
                  </th>
                  <th className="px-6 py-4">
                    <button onClick={() => handleSort('modelo')} className="flex items-center gap-2">
                      <span>Vehículo</span>
                      <span className="text-xs">{sortKey === 'modelo' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</span>
                    </button>
                  </th>
                  <th className="px-6 py-4">
                    <button onClick={() => handleSort('fecha_trabajo')} className="flex items-center gap-2">
                      <span>Ultima Fecha Trabajo</span>
                      <span className="text-xs">{sortKey === 'fecha_trabajo' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</span>
                    </button>
                  </th>
                  <th className="px-6 py-4">
                    <button onClick={() => handleSort('kilometros')} className="flex items-center gap-2">
                      <span>Kilometraje</span>
                      <span className="text-xs">{(sortKey === 'kilometros' || sortKey === 'km') ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</span>
                    </button>
                  </th>
                  <th className="px-6 py-4">
                    <button onClick={() => handleSort('vtv')} className="flex items-center gap-2">
                      <span>Vencimiento VTV</span>
                      <span className="text-xs">{sortKey === 'vtv' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</span>
                    </button>
                  </th>
                  <th className="px-6 py-4">
                    <button onClick={() => handleSort('oblea')} className="flex items-center gap-2">
                      <span>Vencimiento GNC</span>
                      <span className="text-xs">{sortKey === 'oblea' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</span>
                    </button>
                  </th>
                  <th className="px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedVehiculos.map((v) => {
                  const patente = v.patente || v.dominio || v.id || 'S/D';
                  const modelo = v.modelo || 'Desconocido';
                  const anio = v.anio || '';
                  const km = v.kilometros ?? v.km ?? null;
                  const fechaVTV = v.VTV || v.vtv || v.vtv_vencimiento || null;
                  const fechaOblea = v.oblea || v.OBLEA || v.oblea_vencimiento || null;
                  // Nueva variable para la fecha de trabajo
                  const fechaTrabajo = v.fecha_trabajo || v.fecha || null;

                  return (
                    <tr key={patente} className="hover:bg-slate-50 transition-colors">
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
                      {/* NUEVA CELDA */}
                      <td className="px-6 py-4">
                        <RenderWorkDate dateRaw={fechaTrabajo} />
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">{formatKm(km)}</td>
                      <td className="px-6 py-4"><RenderDateBadge dateRaw={fechaVTV} /></td>
                      <td className="px-6 py-4"><RenderDateBadge dateRaw={fechaOblea} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(v)} className="px-2 py-1 bg-indigo-50 rounded text-indigo-600">✏️</button>
                          <button onClick={() => handleDelete(patente)} className="px-2 py-1 bg-red-50 rounded text-red-600">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[600px] p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4">{editMode ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-600">Patente</label>
                <input value={form.patente} onChange={(e) => handleChange('patente', e.target.value)} disabled={editMode} className="w-full border px-2 py-2 rounded" />
              </div>
              <div>
                <label className="block text-xs text-slate-600">Modelo</label>
                <input value={form.modelo} onChange={(e) => handleChange('modelo', e.target.value)} className="w-full border px-2 py-2 rounded" />
              </div>
              <div>
                <label className="block text-xs text-slate-600">Año</label>
                <input type="number" value={form.anio} onChange={(e) => handleChange('anio', e.target.value)} className="w-full border px-2 py-2 rounded" />
              </div>
              <div>
                <label className="block text-xs text-slate-600">KM</label>
                <input value={form.km} onChange={(e) => handleChange('km', e.target.value)} className="w-full border px-2 py-2 rounded" />
              </div>
              <div>
                <label className="block text-xs text-slate-600">Última Fecha Trabajo</label>
                <input type="date" value={form.fecha_trabajo} onChange={(e) => handleChange('fecha_trabajo', e.target.value)} className="w-full border px-2 py-2 rounded" />
              </div>
              <div>
                <label className="block text-xs text-slate-600">VTV (fecha)</label>
                <input type="date" value={form.vtv} onChange={(e) => handleChange('vtv', e.target.value)} className="w-full border px-2 py-2 rounded" />
              </div>
              <div>
                <label className="block text-xs text-slate-600">Oblea (fecha)</label>
                <input type="date" value={form.oblea} onChange={(e) => handleChange('oblea', e.target.value)} className="w-full border px-2 py-2 rounded" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded border">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 rounded bg-emerald-600 text-white">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}