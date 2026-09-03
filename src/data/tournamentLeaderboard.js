import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
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

// Records one admin action against a catch so it can be reviewed later on
// the Admin page instead of needing to open the Firestore console.
function logCatchActivity({ catchData, action, field, oldValue, newValue, admin }) {
  return addDoc(collection(db, 'tournamentCatchLogs'), {
    catchId: catchData.id,
    teamId: catchData.teamId,
    species: catchData.species,
    angler: catchData.angler || null,
    action,
    field,
    oldValue: oldValue ?? null,
    newValue: newValue ?? null,
    adminUid: admin?.uid || null,
    adminEmail: admin?.email || null,
    at: serverTimestamp(),
  })
}

export function useCatchActivityLog(entryLimit = 200) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'tournamentCatchLogs'), orderBy('at', 'desc'), limit(entryLimit))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return () => unsub()
  }, [entryLimit])

  return { entries, loading }
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

export async function setCatchVerified(catchData, verified, admin) {
  await updateDoc(doc(db, 'tournamentCatches', catchData.id), { verified })
  await logCatchActivity({
    catchData,
    action: verified ? 'verify' : 'unverify',
    field: 'verified',
    oldValue: catchData.verified,
    newValue: verified,
    admin,
  }).catch(() => {})
}

// Admin correction only — intentionally does not touch submittedAt, since
// that timestamp is used as the tiebreak order and shouldn't move just
// because an admin fixed a measurement.
export async function setCatchInches(catchData, inches, admin) {
  await updateDoc(doc(db, 'tournamentCatches', catchData.id), { inches })
  await logCatchActivity({
    catchData,
    action: 'edit_inches',
    field: 'inches',
    oldValue: catchData.inches,
    newValue: inches,
    admin,
  }).catch(() => {})
}

export async function removeCatch(catchData, admin) {
  await updateDoc(doc(db, 'tournamentCatches', catchData.id), {
    deleted: true,
    deletedAt: serverTimestamp(),
  })
  await logCatchActivity({
    catchData,
    action: 'remove',
    field: 'deleted',
    oldValue: false,
    newValue: true,
    admin,
  }).catch(() => {})
}

export async function restoreCatch(catchData, admin) {
  await updateDoc(doc(db, 'tournamentCatches', catchData.id), {
    deleted: false,
    deletedAt: null,
  })
  await logCatchActivity({
    catchData,
    action: 'restore',
    field: 'deleted',
    oldValue: true,
    newValue: false,
    admin,
  }).catch(() => {})
}

export async function permanentlyDeleteCatch(catchData, admin) {
  await logCatchActivity({
    catchData,
    action: 'purge',
    field: 'deleted',
    oldValue: true,
    newValue: 'purged',
    admin,
  }).catch(() => {})
  await deleteDoc(doc(db, 'tournamentCatches', catchData.id))
  if (catchData.photoPath) {
    try {
      await deleteObject(ref(storage, catchData.photoPath))
    } catch {
      // photo may already be gone; not fatal
    }
  }
}

export function computeTeamTotal(catches) {
  if (!catches) return 0
  return CATCH_SPECIES.reduce((sum, species) => sum + (catches[species]?.inches || 0), 0)
}
