import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../firebase.js'

export function useAdmins() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'admins'),
      (snap) => {
        setAdmins(snap.docs.map((d) => ({ uid: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return () => unsub()
  }, [])

  return { admins, loading }
}

export async function addAdmin(uid, label) {
  const trimmedUid = uid.trim()
  if (!trimmedUid) throw new Error('User ID is required')
  await setDoc(doc(db, 'admins', trimmedUid), {
    label: label.trim(),
    addedAt: serverTimestamp(),
  })
}

export async function removeAdmin(uid) {
  await deleteDoc(doc(db, 'admins', uid))
}
