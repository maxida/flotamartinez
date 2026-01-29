import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db, Timestamp } from './firebase'

const ordenesCol = collection(db, 'ordenes')

export async function getOrdenes() {
  try {
    const snap = await getDocs(ordenesCol)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error('getOrdenes error', err)
    throw err
  }
}

export async function addOrden(payload) {
  try {
    // ensure fecha_ingreso is a Firestore Timestamp
    const data = {
      ...payload,
      fecha_ingreso: payload.fecha_ingreso instanceof Date ? Timestamp.fromDate(payload.fecha_ingreso) : payload.fecha_ingreso
    }
    const ref = await addDoc(ordenesCol, data)
    return { id: ref.id }
  } catch (err) {
    console.error('addOrden error', err)
    throw err
  }
}
