// src/services/firebase.js (o donde lo tengas)
import { initializeApp } from 'firebase/app'
import { getFirestore, Timestamp } from 'firebase/firestore'

// Esta configuración lee automáticamente lo que pongas en el archivo .env.local
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Validación rápida por si falta el archivo .env
if (!firebaseConfig.projectId) {
  console.error('Faltan las variables de entorno. Revisa el archivo .env.local');
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db, Timestamp }