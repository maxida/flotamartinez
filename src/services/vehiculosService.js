import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from './firebase'

const vehiculosCol = collection(db, 'vehiculos')

export async function getVehiculos() {
  try {
    const snap = await getDocs(vehiculosCol)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error('getVehiculos error', err)
    throw err
  }
}

export async function addVehiculo(payload) {
  try {
    const ref = await addDoc(vehiculosCol, payload)
    return { id: ref.id }
  } catch (err) {
    console.error('addVehiculo error', err)
    throw err
  }
}
