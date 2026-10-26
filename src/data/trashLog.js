import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '../firebase.js'
import { resizeToBlob, getClientIp, getExifDateTaken } from './photoUpload.js'

export function useTrashLog() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'trashLog'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return () => unsub()
  }, [])

  return { entries, loading }
}

export async function addTrashEntry({ anglerId, angler, date, file }) {
  const [blob, ip, photoTakenAt] = await Promise.all([
    resizeToBlob(file),
    getClientIp(),
    getExifDateTaken(file),
  ])
  const path = `trash/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' })
  const photo = await getDownloadURL(storageRef)

  await addDoc(collection(db, 'trashLog'), {
    anglerId,
    angler,
    date: date || '',
    photo,
    photoPath: path,
    ip,
    photoTakenAt,
    createdAt: serverTimestamp(),
  })
}

export async function removeTrashEntry(entryId, photoPath) {
  await deleteDoc(doc(db, 'trashLog', entryId))
  if (photoPath) {
    try {
      await deleteObject(ref(storage, photoPath))
    } catch {
      // photo may already be gone; not fatal
    }
  }
}
