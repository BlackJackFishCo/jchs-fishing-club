import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase.js'

export const CLINIC_CAPACITY = 20
const CLINIC_SPOTS_DOC = 'clinicMeta/spots'

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

export function useClinicSpotCount() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, CLINIC_SPOTS_DOC),
      (snap) => {
        setCount(snap.exists() ? snap.data().count || 0 : 0)
        setLoading(false)
      },
      () => setLoading(false),
    )
    return () => unsub()
  }, [])

  return { count, loading }
}

export async function addClinicWaiver(data) {
  const spotsRef = doc(db, CLINIC_SPOTS_DOC)
  const waiverRef = doc(collection(db, 'clinicWaivers'))

  await runTransaction(db, async (tx) => {
    const spotsSnap = await tx.get(spotsRef)
    const count = spotsSnap.exists() ? spotsSnap.data().count || 0 : 0
    if (count >= CLINIC_CAPACITY) {
      throw new Error('Registration is full.')
    }
    tx.set(spotsRef, { count: count + 1 })
    tx.set(waiverRef, { ...data, createdAt: serverTimestamp() })
  })
}
