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

export const TOTAL_SPECIES = 40
export const CATEGORIES = ['Saltwater', 'Freshwater']

const SALTWATER_SPECIES = [
  'Bluefish',
  'Catfish – Gafftopsail Catfish',
  'Catfish – Hardhead Catfish',
  'Drum – Black Drum',
  'Drum – Red Drum',
  'Drum – Spotted Seatrout',
  'Drum – Whiting',
  'Flounder',
  'Grunt – White Grunt',
  'Jack – Crevalle Jack',
  'Jack – Blue Runner',
  'Ladyfish',
  'Mackerel – Little Tunny',
  'Mackerel – King Mackerel',
  'Mackerel – Spanish Mackerel',
  'Pompano – Permit',
  'Pompano – Florida Pompano',
  'Porgy – Sheepshead',
  'Snapper – Mangrove/Gray Snapper',
  'Snook',
]

const FRESHWATER_SPECIES = [
  'Black Bass – Florida Bass',
  'Black Bass – Spotted Bass',
  'Temperate Bass – Striped Bass',
  'Temperate Bass – Sunshine Bass',
  'Temperate Bass – White Bass',
  'Catfish – Brown Bullhead',
  'Catfish – Yellow Bullhead',
  'Catfish – Channel Catfish',
  'Catfish – White Catfish',
  'Panfish – Bluegill',
  'Panfish – Redbreast Sunfish',
  'Panfish – Redear Sunfish',
  'Panfish – Spotted Sunfish',
  'Panfish – Warmouth',
  'Panfish – Black Crappie',
  'Cichlid – Butterfly Peacock Bass',
  'Cichlid – Blue/Nile Tilapia',
  'Cichlid – Mayan',
  'Gar – Florida/Spotted',
  'Chain Pickerel',
]

export const SPECIES_LIST = [
  ...SALTWATER_SPECIES.map((species, i) => ({ id: i + 1, species, category: 'Saltwater' })),
  ...FRESHWATER_SPECIES.map((species, i) => ({
    id: i + 1 + SALTWATER_SPECIES.length,
    species,
    category: 'Freshwater',
  })),
]

function resizeToBlob(file, maxSize = 1000) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.85)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export function useSpeciesBoard() {
  const [submissionsBySpecies, setSubmissionsBySpecies] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'submissions'), orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        const grouped = {}
        snap.docs.forEach((d) => {
          const data = { id: d.id, ...d.data() }
          if (!grouped[data.speciesId]) grouped[data.speciesId] = []
          grouped[data.speciesId].push(data)
        })
        setSubmissionsBySpecies(grouped)
        setLoading(false)
      },
      () => setLoading(false),
    )
    return () => unsub()
  }, [])

  const board = SPECIES_LIST.map((entry) => ({
    ...entry,
    submissions: submissionsBySpecies[entry.id] || [],
  }))

  return { board, loading }
}

export function useCaughtCount() {
  const { board } = useSpeciesBoard()
  const caught = board.filter((row) => row.submissions.length > 0).length
  return { caught, total: TOTAL_SPECIES }
}

export async function addSubmission(speciesId, { anglerId, angler, date, file }) {
  const blob = await resizeToBlob(file)
  const path = `catches/${speciesId}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' })
  const photo = await getDownloadURL(storageRef)

  await addDoc(collection(db, 'submissions'), {
    speciesId,
    anglerId,
    angler,
    date: date || '',
    photo,
    photoPath: path,
    createdAt: serverTimestamp(),
  })
}

export async function removeSubmission(submissionId, photoPath) {
  await deleteDoc(doc(db, 'submissions', submissionId))
  if (photoPath) {
    try {
      await deleteObject(ref(storage, photoPath))
    } catch {
      // photo may already be gone; not fatal
    }
  }
}
