import { useEffect, useState } from 'react'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from '../firebase.js'

export function slugifyName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function useRoster() {
  const [roster, setRoster] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'roster'), orderBy('name'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setRoster(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return () => unsub()
  }, [])

  return { roster, loading }
}

export async function addRosterName(name) {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Name is required')
  const id = slugifyName(trimmed)
  if (!id) throw new Error('Name must contain letters or numbers')
  await setDoc(doc(db, 'roster', id), {
    name: trimmed,
    active: true,
    addedAt: serverTimestamp(),
  })
  return id
}

export async function removeRosterName(id) {
  await deleteDoc(doc(db, 'roster', id))
}
