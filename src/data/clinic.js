import { useEffect, useState } from 'react'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.js'

export function useClinicWaivers() {
  const [waivers, setWaivers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'clinicWaivers'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setWaivers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return () => unsub()
  }, [])

  return { waivers, loading }
}

export async function addClinicWaiver(data) {
  await addDoc(collection(db, 'clinicWaivers'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}
