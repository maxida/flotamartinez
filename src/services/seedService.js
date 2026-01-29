import { db, Timestamp } from './firebase'
import { doc, setDoc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore'

function tryParseDate(input) {
  if (!input) return null
  // Try ISO first
  let d = new Date(input)
  if (!isNaN(d)) return d
  // Try dd/mm/yyyy or d/m/yyyy
  const parts = input.split(/[\/\-\.]/)
  if (parts.length === 3) {
    let [a, b, c] = parts
    // detect if format is dd/mm/yyyy when year length is 4 and first part >12
    if (a.length === 4) { // yyyy-mm-dd
      d = new Date(input)
      if (!isNaN(d)) return d
    }
    // assume dd/mm/yyyy
    const day = parseInt(a, 10)
    const month = parseInt(b, 10) - 1
    let year = parseInt(c, 10)
    if (year < 100) year += 2000
    d = new Date(year, month, day)
    if (!isNaN(d)) return d
  }
  return null
}

export async function upsertVehiculoByPatente(vehicle) {
  if (!vehicle || !vehicle.patente) throw new Error('Vehículo sin patente')
  const id = vehicle.patente
  const ref = doc(db, 'vehiculos', id)
  const data = {
    patente: vehicle.patente,
    modelo: vehicle.modelo || null,
    anio: vehicle.anio ? Number(vehicle.anio) : null
  }
  if (vehicle.vtv) {
    const d = tryParseDate(vehicle.vtv)
    if (d) data.vtv_vencimiento = Timestamp.fromDate(d)
  }
  try {
    await setDoc(ref, data, { merge: true })
    return { id }
  } catch (err) {
    console.error('upsertVehiculo error', err)
    throw err
  }
}

export async function ensureChoferByName(nombre) {
  if (!nombre) return null
  try {
    const q = query(collection(db, 'choferes'), where('nombre', '==', nombre))
    const snap = await getDocs(q)
    if (!snap.empty) return { id: snap.docs[0].id, ...snap.docs[0].data() }
    const ref = await addDoc(collection(db, 'choferes'), { nombre, estado: 'Activo' })
    return { id: ref.id, nombre, estado: 'Activo' }
  } catch (err) {
    console.error('ensureChoferByName error', err)
    throw err
  }
}

function buildChecklist(reparacionesObj) {
  const checklist = {
    tren_delantero: 'OK',
    frenos: 'OK',
    mecanica_ligera: 'OK',
    electronica: 'OK'
  }
  if (reparacionesObj && typeof reparacionesObj === 'object') {
    Object.keys(reparacionesObj).forEach(k => {
      if (k in checklist) checklist[k] = reparacionesObj[k]
    })
  }
  return checklist
}

function buildReparacionesArray(reparacionesObj, novedad) {
  const arr = []
  if (reparacionesObj && typeof reparacionesObj === 'object') {
    Object.entries(reparacionesObj).forEach(([k, v]) => {
      arr.push({ item: k, detalle: v || '', costo: 0 })
    })
  }
  if (novedad) {
    arr.push({ item: 'novedad', detalle: novedad, costo: 0 })
  }
  return arr
}

export async function createOrdenFromHistoric(item) {
  try {
    const fechaDate = tryParseDate(item.fecha) || new Date()
    const payload = {
      vehiculo_patente: item.patente || '',
      chofer_nombre: item.chofer || '',
      fecha_ingreso: Timestamp.fromDate(fechaDate),
      km_ingreso: item.km ? Number(item.km) : 0,
      estado_trabajo: 'FINALIZADO',
      checklist_ingreso: buildChecklist(item.reparaciones || {}),
      reparaciones_realizadas: buildReparacionesArray(item.reparaciones || {}, item.novedad)
    }
    const ref = await addDoc(collection(db, 'ordenes'), payload)
    return { id: ref.id }
  } catch (err) {
    console.error('createOrdenFromHistoric error', err)
    throw err
  }
}
