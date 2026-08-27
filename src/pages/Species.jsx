import { useState } from 'react'
import { TOTAL_SPECIES, CATEGORIES, useSpeciesBoard, saveEntry } from '../data/species.js'
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

function EditModal({ entry, onClose, onSave }) {
  const [form, setForm] = useState(entry)
  const [busy, setBusy] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const dataUrl = await resizeImage(file)
      setForm((f) => ({ ...f, photo: dataUrl }))
    } finally {
      setBusy(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    const caught = Boolean(form.species && form.angler && form.date) || form.caught
    onSave({ ...form, caught })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal card" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3>
          {form.species || `Catch #${entry.id}`}
          {form.category && <span className="modal__category">{form.category}</span>}
        </h3>

        <label className="field">
          <span>Species</span>
          <input value={form.species} onChange={update('species')} placeholder="e.g. Snook" />
        </label>

        <label className="field">
          <span>Category</span>
          <select value={form.category || ''} onChange={update('category')}>
            <option value="">—</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Angler</span>
          <input value={form.angler} onChange={update('angler')} placeholder="Angler name" />
        </label>

        <label className="field">
          <span>Date caught</span>
          <input type="date" value={form.date} onChange={update('date')} />
        </label>

        <label className="field">
          <span>Photo</span>
          <input type="file" accept="image/*" onChange={handlePhoto} />
        </label>

        {form.photo && (
          <img className="modal__preview" src={form.photo} alt={form.species || 'Catch preview'} />
        )}

        <label className="field field--checkbox">
          <input
            type="checkbox"
            checked={form.caught}
            onChange={(e) => setForm({ ...form, caught: e.target.checked })}
          />
          <span>Mark as caught</span>
        </label>

        <div className="modal__actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-solid" disabled={busy}>
            {busy ? 'Processing…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

function SpeciesCard({ entry, onEdit }) {
  return (
    <button
      className={`species-card card ${entry.caught ? 'is-caught' : ''}`}
      onClick={() => onEdit(entry)}
    >
      <div className="species-card__thumb">
        {entry.photo ? (
          <img src={entry.photo} alt={entry.species || `Catch #${entry.id}`} />
        ) : (
          <span className="species-card__placeholder">#{entry.id}</span>
        )}
        {entry.caught && <span className="species-card__badge">Caught</span>}
      </div>
      <div className="species-card__body">
        <strong>{entry.species || `Species #${entry.id} — TBD`}</strong>
        <span>{entry.angler || 'No angler logged'}</span>
        <span className="species-card__date">{entry.date || 'No date logged'}</span>
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
  const [editing, setEditing] = useState(null)
  const caughtCount = board.filter((r) => r.caught).length
  const pct = Math.round((caughtCount / TOTAL_SPECIES) * 100)
  const uncategorized = board.filter((r) => !CATEGORIES.includes(r.category))

  return (
    <div className="page species-page">
      <p className="eyebrow">Required Species Challenge</p>
      <h1 className="section-title">Species Catch List</h1>
      <p className="species-page__intro">
        Click any card to log a catch — species, angler, date, and a photo. This board
        tracks progress toward all {TOTAL_SPECIES} required species for the club.
      </p>

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
          onEdit={setEditing}
        />
      ))}

      {uncategorized.length > 0 && (
        <CategorySection category="Other" entries={uncategorized} onEdit={setEditing} />
      )}

      {editing && (
        <EditModal
          entry={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => {
            saveEntry(updated)
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}

export default Species
