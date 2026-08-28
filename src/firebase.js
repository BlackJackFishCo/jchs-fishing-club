import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAo-zgFqPFM20XaEnsPp8xjTSg3jfsGPV0',
  authDomain: 'jchs-fishing-club.firebaseapp.com',
  projectId: 'jchs-fishing-club',
  storageBucket: 'jchs-fishing-club.firebasestorage.app',
  messagingSenderId: '640453341913',
  appId: '1:640453341913:web:16027853c78f8ffbe104c8',
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
