import { collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore'
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

export async function deleteOrden(id) {
  try {
    await deleteDoc(doc(db, 'ordenes', id))
    return { id }
  } catch (err) {
    console.error('deleteOrden error', err)
    throw err
  }
}

export async function updateOrden(id, payload) {
  try {
    const ref = doc(db, 'ordenes', id)
    // If payload.fecha_ingreso is Date, convert to Timestamp
    const data = { ...payload }
    if (payload.fecha_ingreso instanceof Date) {
      data.fecha_ingreso = Timestamp.fromDate(payload.fecha_ingreso)
    }
    await updateDoc(ref, data)
    return { id }
  } catch (err) {
    console.error('updateOrden error', err)
    throw err
  }
}

export async function deleteFinalizados() {
  try {
    const q = query(collection(db, 'ordenes'), where('estado_trabajo', '==', 'FINALIZADO'))
    const snap = await getDocs(q)
    const deletions = snap.docs.map(d => deleteDoc(doc(db, 'ordenes', d.id)))
    await Promise.all(deletions)
    return { deleted: snap.size }
  } catch (err) {
    console.error('deleteFinalizados error', err)
    throw err
  }
}
