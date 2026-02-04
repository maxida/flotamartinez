import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from './firebase'

// Use singular collection name 'chofer' to match useCollection hook usage
const choferesCol = collection(db, 'chofer')

export async function getChoferes() {
  try {
    const snap = await getDocs(choferesCol)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error('getChoferes error', err)
    throw err
  }
}

export async function addChofer(payload) {
  try {
    const ref = await addDoc(choferesCol, payload)
    return { id: ref.id }
  } catch (err) {
    console.error('addChofer error', err)
    throw err
  }
}

export async function updateChofer(id, payload) {
  try {
    const ref = doc(db, 'chofer', id)
    await updateDoc(ref, payload)
    return { id }
  } catch (err) {
    console.error('updateChofer error', err)
    throw err
  }
}

export async function deleteChofer(id) {
  try {
    const ref = doc(db, 'chofer', id)
    await deleteDoc(ref)
    return { id }
  } catch (err) {
    console.error('deleteChofer error', err)
    throw err
  }
}
