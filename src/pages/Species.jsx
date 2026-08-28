import { useState } from 'react'
import {
  TOTAL_SPECIES,
  CATEGORIES,
  useSpeciesBoard,
  saveEntry,
  addSubmission,
  removeSubmission,
} from '../data/species.js'
import logo from '../assets/logo.png'
import './Species.css'

const CHALLENGE_RULES = [
  'All submitted fish must have been caught by a student angler enrolled in the fishing club.',
  'Students must practice proper handling techniques by holding the fish horizontal and broadside.',
  'Photos should be taken promptly after being caught.',
  'All fish submitted must be clearly identifiable to be an approved catch.',
  'After documenting the catch all fish submitted must be immediately released alive in the same water system where they were caught.',
  'Length and width measurements are not required.',
  'All submitted fish must be caught during the school year. Fish caught before the start of the school year will not be accepted.',
  'Fish must be caught in Florida state waters, in federal waters extending directly outward of Florida state line boundaries or landed in Florida.',
  'Any club who submits fish caught by a student not enrolled in the club, uses photos from the internet or generative AI platforms to submit catches as their own will be disqualified.',
]

function resizeImage(file, maxSize = 640) {
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
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

function CatchModal({ entry, onClose }) {
  const [current, setCurrent] = useState(entry)
  const [species, setSpecies] = useState(entry.species)
  const [angler, setAngler] = useState('')
  const [date, setDate] = useState('')
  const [photo, setPhoto] = useState('')
  const [busy, setBusy] = useState(false)

  const commit = (patch) => {
    const updated = { ...current, species, ...patch }
    saveEntry(updated)
    setCurrent(updated)
  }

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      setPhoto(await resizeImage(file))
    } finally {
      setBusy(false)
    }
  }

  const addCatch = (e) => {
    e.preventDefault()
    if (!photo) return
    const board = addSubmission(current.id, { angler, date, photo })
    setCurrent(board.find((r) => r.id === current.id))
    setAngler('')
    setDate('')
    setPhoto('')
  }

  const deleteCatch = (submissionId) => {
    const board = removeSubmission(current.id, submissionId)
    setCurrent(board.find((r) => r.id === current.id))
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal card" onClick={(e) => e.stopPropagation()}>
        <h3>
          {current.species || `Species #${current.id}`}
          {current.category && <span className="modal__category">{current.category}</span>}
        </h3>

        <label className="field">
          <span>Species</span>
          <input
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            onBlur={() => commit({})}
            placeholder="e.g. Snook"
          />
        </label>

        <div className="modal__divider">
          Catches Logged ({current.submissions.length})
        </div>

        {current.submissions.length > 0 && (
          <ul className="modal__catch-list">
            {current.submissions.map((sub) => (
              <li key={sub.id} className="modal__catch-row">
                <img src={sub.photo} alt={current.species || 'Catch'} />
                <div className="modal__catch-info">
                  <strong>{sub.angler || 'Angler not logged'}</strong>
                  <span>{sub.date || 'No date logged'}</span>
                </div>
                <button
                  type="button"
                  className="modal__catch-remove"
                  aria-label="Remove this catch"
                  onClick={() => deleteCatch(sub.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <form className="modal__add-form" onSubmit={addCatch}>
          <div className="modal__divider">Add a Catch</div>

          <label className="field">
            <span>Angler</span>
            <input value={angler} onChange={(e) => setAngler(e.target.value)} placeholder="Angler name" />
          </label>

          <label className="field">
            <span>Date caught</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>

          <label className="field">
            <span>Photo</span>
            <input type="file" accept="image/*" onChange={handlePhoto} />
          </label>

          {photo && <img className="modal__preview" src={photo} alt="New catch preview" />}

          <div className="modal__actions">
            <button type="button" className="btn" onClick={onClose}>
              Done
            </button>
            <button type="submit" className="btn btn-solid" disabled={busy || !photo}>
              {busy ? 'Processing…' : 'Add Catch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SpeciesCard({ entry, onEdit }) {
  const submissions = entry.submissions
  const latest = submissions[submissions.length - 1]

  return (
    <button
      className={`species-card card ${submissions.length > 0 ? 'is-caught' : ''}`}
      onClick={() => onEdit(entry)}
    >
      <div className="species-card__thumb">
        {submissions.length > 0 ? (
          <div className="species-card__scroll">
            {submissions.map((sub) => (
              <img key={sub.id} src={sub.photo} alt={entry.species || `Catch #${entry.id}`} />
            ))}
          </div>
        ) : (
          <span className="species-card__placeholder">#{entry.id}</span>
        )}
        {submissions.length > 0 && <span className="species-card__badge">Caught</span>}
        {submissions.length > 1 && (
          <span className="species-card__count">{submissions.length} photos</span>
        )}
      </div>
      <div className="species-card__body">
        <strong>{entry.species || `Species #${entry.id} — TBD`}</strong>
        {latest ? (
          <>
            <span>{latest.angler || 'Angler not logged'}</span>
            <span className="species-card__date">{latest.date || 'No date logged'}</span>
          </>
        ) : (
          <span>No catches logged yet</span>
        )}
      </div>
    </button>
  )
}

function CategorySection({ category, entries, onEdit }) {
  return (
    <section className="species-category">
      <div className="species-category__head">
        <h2 className="species-category__title">{category}</h2>
      </div>
      <div className="species-grid">
        {entries.map((entry) => (
          <SpeciesCard key={entry.id} entry={entry} onEdit={onEdit} />
        ))}
      </div>
    </section>
  )
}

function Species() {
  const board = useSpeciesBoard()
  const [editingId, setEditingId] = useState(null)
  const caughtCount = board.filter((r) => r.submissions.length > 0).length
  const pct = Math.round((caughtCount / TOTAL_SPECIES) * 100)
  const uncategorized = board.filter((r) => !CATEGORIES.includes(r.category))
  const editing = editingId ? board.find((r) => r.id === editingId) : null

  return (
    <div className="page species-page">
      <div className="species-page__head">
        <div>
          <p className="eyebrow">Species Challenge</p>
          <h1 className="section-title">Species Catch List 2026-2027</h1>
          <p className="species-page__intro">
            Click any card to log a catch — species, angler, date, and a photo. This board
            tracks progress toward all {TOTAL_SPECIES} species for the club.
          </p>
        </div>
        <img className="species-page__logo" src={logo} alt="JCHS Fishing Club crest" />
      </div>

      <div className="ticker card">
        <div className="ticker__count">
          {caughtCount} <span>/ {TOTAL_SPECIES}</span>
        </div>
        <div className="ticker__bar">
          <div className="ticker__fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="ticker__pct">{pct}% complete</div>
      </div>

      <section className="species-rules card">
        <h2>Fishing Challenge Rules</h2>
        <ul>
          {CHALLENGE_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      {CATEGORIES.map((category) => (
        <CategorySection
          key={category}
          category={category}
          entries={board.filter((r) => r.category === category)}
          onEdit={(entry) => setEditingId(entry.id)}
        />
      ))}

      {uncategorized.length > 0 && (
        <CategorySection
          category="Other"
          entries={uncategorized}
          onEdit={(entry) => setEditingId(entry.id)}
        />
      )}

      {editing && <CatchModal entry={editing} onClose={() => setEditingId(null)} />}
    </div>
  )
}

export default Species
