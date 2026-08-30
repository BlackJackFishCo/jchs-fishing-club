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
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '../firebase.js'

export const CATCH_SPECIES = ['Snook', 'Redfish', 'Trout']
export const MAX_TEAM_ANGLERS = 4
export const SEED_TEAM_COUNT = 20

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

export function useTournamentTeams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'tournamentTeams'), orderBy('order'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setTeams(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return () => unsub()
  }, [])

  return { teams, loading }
}

export async function seedPlaceholderTeams() {
  const batch = writeBatch(db)
  for (let i = 1; i <= SEED_TEAM_COUNT; i++) {
    const teamRef = doc(db, 'tournamentTeams', `team-${i}`)
    batch.set(teamRef, {
      name: `Team ${i}`,
      anglers: [],
      order: i,
      createdAt: serverTimestamp(),
    })
  }
  await batch.commit()
}

export async function addTeam(name) {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Team name is required')
  const id = `team-${Date.now()}`
  await setDoc(doc(db, 'tournamentTeams', id), {
    name: trimmed,
    anglers: [],
    order: Date.now(),
    createdAt: serverTimestamp(),
  })
  return id
}

export async function updateTeam(teamId, { name, anglers }) {
  const cleanedAnglers = anglers.map((a) => a.trim()).filter(Boolean)
  if (cleanedAnglers.length > MAX_TEAM_ANGLERS) {
    throw new Error(`A team can have at most ${MAX_TEAM_ANGLERS} anglers`)
  }
  const trimmedName = name.trim()
  if (!trimmedName) throw new Error('Team name is required')
  await updateDoc(doc(db, 'tournamentTeams', teamId), {
    name: trimmedName,
    anglers: cleanedAnglers,
  })
}

export async function removeTeam(teamId) {
  await deleteDoc(doc(db, 'tournamentTeams', teamId))
}

export function useTournamentCatches() {
  const [allCatches, setAllCatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'tournamentCatches'), orderBy('submittedAt', 'asc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setAllCatches(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return () => unsub()
  }, [])

  const catchesByTeam = {}
  const deletedCatches = []
  allCatches.forEach((c) => {
    if (c.deleted) {
      deletedCatches.push(c)
    } else {
      if (!catchesByTeam[c.teamId]) catchesByTeam[c.teamId] = {}
      catchesByTeam[c.teamId][c.species] = c
    }
  })
  deletedCatches.sort((a, b) => (b.deletedAt?.toMillis?.() || 0) - (a.deletedAt?.toMillis?.() || 0))

  return { catchesByTeam, deletedCatches, loading }
}

export async function submitCatch({ teamId, species, angler, inches, file }) {
  const blob = await resizeToBlob(file)
  const path = `tournament-catches/${teamId}/${species}-${Date.now()}.jpg`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' })
  const photo = await getDownloadURL(storageRef)

  await setDoc(doc(db, 'tournamentCatches', `${teamId}_${species}`), {
    teamId,
    species,
    angler,
    inches,
    photo,
    photoPath: path,
    verified: false,
    deleted: false,
    submittedAt: serverTimestamp(),
  })
}

export async function setCatchVerified(catchId, verified) {
  await updateDoc(doc(db, 'tournamentCatches', catchId), { verified })
}

export async function removeCatch(catchId) {
  await updateDoc(doc(db, 'tournamentCatches', catchId), {
    deleted: true,
    deletedAt: serverTimestamp(),
  })
}

export async function restoreCatch(catchId) {
  await updateDoc(doc(db, 'tournamentCatches', catchId), {
    deleted: false,
    deletedAt: null,
  })
}

export async function permanentlyDeleteCatch(catchId, photoPath) {
  await deleteDoc(doc(db, 'tournamentCatches', catchId))
  if (photoPath) {
    try {
      await deleteObject(ref(storage, photoPath))
    } catch {
      // photo may already be gone; not fatal
    }
  }
}

export function computeTeamTotal(catches) {
  if (!catches) return 0
  return CATCH_SPECIES.reduce((sum, species) => sum + (catches[species]?.inches || 0), 0)
}
