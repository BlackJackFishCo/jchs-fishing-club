import { useEffect, useState } from 'react'

export const TOTAL_SPECIES = 40
const STORAGE_KEY = 'jchs-fishing-club:species-board:v1'
const UPDATE_EVENT = 'jchs-species-updated'

function defaultEntry(id) {
  return {
    id,
    species: '',
    angler: '',
    date: '',
    photo: '',
    caught: false,
  }
}

function defaultBoard() {
  return Array.from({ length: TOTAL_SPECIES }, (_, i) => defaultEntry(i + 1))
}

export function loadBoard() {
  if (typeof window === 'undefined') return defaultBoard()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultBoard()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length !== TOTAL_SPECIES) return defaultBoard()
    return parsed
  } catch {
    return defaultBoard()
  }
}

export function saveBoard(board) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(board))
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: board }))
}

export function saveEntry(entry) {
  const board = loadBoard()
  const next = board.map((row) => (row.id === entry.id ? entry : row))
  saveBoard(next)
  return next
}

export function useSpeciesBoard() {
  const [board, setBoard] = useState(loadBoard)

  useEffect(() => {
    const onUpdate = (e) => setBoard(e.detail ?? loadBoard())
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setBoard(loadBoard())
    }
    window.addEventListener(UPDATE_EVENT, onUpdate)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(UPDATE_EVENT, onUpdate)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  return board
}

export function useCaughtCount() {
  const board = useSpeciesBoard()
  const caught = board.filter((row) => row.caught).length
  return { caught, total: TOTAL_SPECIES }
}
