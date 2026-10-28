import { useEffect, useState } from 'react'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.js'
import { addTeamFromRegistration } from './tournamentLeaderboard.js'

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

export async function addRegistration({ teamName, anglers, waiverAccepted }) {
  const ref = await addDoc(collection(db, 'tournamentRegistrations'), {
    teamName,
    anglers,
    waiverAccepted: Boolean(waiverAccepted),
    waiverAcceptedAt: waiverAccepted ? serverTimestamp() : null,
    createdAt: serverTimestamp(),
  })

  // Best-effort: pre-fill a pending team from this registration so an admin
  // only has to review and confirm it instead of re-typing it from scratch.
  // The registration itself is already saved either way.
  try {
    await addTeamFromRegistration({ name: teamName, anglers, registrationId: ref.id })
  } catch (err) {
    console.error('Could not auto-create a pending tournament team from registration', err)
  }
}
