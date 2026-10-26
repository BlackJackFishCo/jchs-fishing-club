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

export const TOTAL_SPECIES = 40
export const CATEGORIES = ['Saltwater', 'Freshwater']

const SALTWATER_SPECIES = [
  'Bluefish',
  'Gafftopsail Catfish',
  'Hardhead Catfish',
  'Black Drum',
  'Red Drum',
  'Spotted Seatrout',
  'Whiting',
  'Flounder',
  'White Grunt',
  'Crevalle Jack',
  'Blue Runner',
  'Ladyfish',
  'Little Tunny / Bonita',
  'King Mackerel',
  'Spanish Mackerel',
  'Permit',
  'Florida Pompano',
  'Sheepshead',
  'Mangrove/Gray Snapper',
  'Snook',
]

const FRESHWATER_SPECIES = [
  'Florida Largemouth Bass',
  'Spotted Bass',
  'Striped Bass',
  'Sunshine Bass',
  'White Bass',
  'Brown Bullhead Catfish',
  'Yellow Bullhead Catfish',
  'Channel Catfish',
  'White Catfish',
  'Bluegill',
  'Redbreast Sunfish',
  'Redear Sunfish',
  'Spotted Sunfish',
  'Warmouth',
  'Black Crappie',
  'Butterfly Peacock Bass',
  'Blue/Nile Tilapia',
  'Mayan Cichlid',
  'Florida/Spotted Gar',
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
  const [blob, ip, photoTakenAt] = await Promise.all([
    resizeToBlob(file),
    getClientIp(),
    getExifDateTaken(file),
  ])
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
    ip,
    photoTakenAt,
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
