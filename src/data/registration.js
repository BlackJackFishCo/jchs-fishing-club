import { useEffect, useState } from 'react'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.js'

export const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL']
export const MAX_ANGLERS = 4

export function useRegistrations() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'tournamentRegistrations'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setRegistrations(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return () => unsub()
  }, [])

  return { registrations, loading }
}

export async function addRegistration(anglers) {
  await addDoc(collection(db, 'tournamentRegistrations'), {
    anglers,
    createdAt: serverTimestamp(),
  })
}
