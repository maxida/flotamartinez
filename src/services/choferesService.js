import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from './firebase'

const choferesCol = collection(db, 'choferes')

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
