import { useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../firebase.js'

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function createAccount(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export function signOutAdmin() {
  return signOut(auth)
}

export function useAdminAuth() {
  const [user, setUser] = useState(undefined)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u)
      if (!u) {
        setIsAdmin(false)
        setChecking(false)
      } else {
        setChecking(true)
      }
    })
    return () => unsubAuth()
  }, [])

  useEffect(() => {
    if (!user) return undefined
    const unsubDoc = onSnapshot(
      doc(db, 'admins', user.uid),
      (snap) => {
        setIsAdmin(snap.exists())
        setChecking(false)
      },
      () => {
        setIsAdmin(false)
        setChecking(false)
      },
    )
    return () => unsubDoc()
  }, [user])

  return { user, isAdmin, loading: checking }
}
