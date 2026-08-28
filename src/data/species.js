import { useEffect, useState } from 'react'

export const TOTAL_SPECIES = 40
export const CATEGORIES = ['Saltwater', 'Freshwater']
const STORAGE_KEY = 'jchs-fishing-club:species-board:v3'
const UPDATE_EVENT = 'jchs-species-updated'

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

function defaultEntry(id, species = '', category = '') {
  return {
    id,
    species,
    category,
    submissions: [],
  }
}

function defaultBoard() {
  const saltwater = SALTWATER_SPECIES.map((species, i) => defaultEntry(i + 1, species, 'Saltwater'))
  const freshwater = FRESHWATER_SPECIES.map((species, i) =>
    defaultEntry(i + 1 + SALTWATER_SPECIES.length, species, 'Freshwater'),
  )
  return [...saltwater, ...freshwater]
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

export function addSubmission(entryId, submission) {
  const board = loadBoard()
  const next = board.map((row) =>
    row.id === entryId
      ? { ...row, submissions: [...row.submissions, { id: `${Date.now()}-${Math.random()}`, ...submission }] }
      : row,
  )
  saveBoard(next)
  return next
}

export function removeSubmission(entryId, submissionId) {
  const board = loadBoard()
  const next = board.map((row) =>
    row.id === entryId
      ? { ...row, submissions: row.submissions.filter((s) => s.id !== submissionId) }
      : row,
  )
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
  const caught = board.filter((row) => row.submissions.length > 0).length
  return { caught, total: TOTAL_SPECIES }
}
