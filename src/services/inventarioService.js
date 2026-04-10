import { collection, addDoc, deleteDoc, doc, updateDoc, runTransaction } from 'firebase/firestore'
import { db } from './firebase'

const inventarioCol = collection(db, 'inventario')

export async function addInventario(payload) {
  try {
    const ref = await addDoc(inventarioCol, payload)
    return { id: ref.id }
  } catch (err) {
    console.error('addInventario error', err)
    throw err
  }
}

export async function updateInventario(id, payload) {
  try {
    const ref = doc(db, 'inventario', id)
    await updateDoc(ref, payload)
    return { id }
  } catch (err) {
    console.error('updateInventario error', err)
    throw err
  }
}

export async function deleteInventario(id) {
  try {
    await deleteDoc(doc(db, 'inventario', id))
    return { id }
  } catch (err) {
    console.error('deleteInventario error', err)
    throw err
  }
}

export async function changeStock(id, delta) {
  const ref = doc(db, 'inventario', id)
  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref)
      if (!snap.exists()) throw new Error('Item not found')
      const current = snap.data().stock ?? 0
      let next = Number(current) + Number(delta)
      if (isNaN(next)) next = Number(current)
      if (next < 0) next = 0
      await tx.update(ref, { stock: next })
    })
    return { id }
  } catch (err) {
    console.error('changeStock error', err)
    throw err
  }
}
