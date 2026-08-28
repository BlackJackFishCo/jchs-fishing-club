import { useState } from 'react'
import { TOTAL_SPECIES, CATEGORIES, useSpeciesBoard, addSubmission, removeSubmission } from '../data/species.js'
import { useRoster } from '../data/roster.js'
import { useAdminAuth } from '../data/auth.js'
import logo from '../assets/logo.png'
import fwcLogo from '../assets/fwc-logo.png'
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

function CatchModal({ entry, isAdmin, roster, onClose }) {
  const [anglerId, setAnglerId] = useState('')
  const [date, setDate] = useState('')
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handlePhoto = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  const addCatch = async (e) => {
    e.preventDefault()
    if (!file || !anglerId) return
    setBusy(true)
    setError('')
    try {
      const anglerName = roster.find((r) => r.id === anglerId)?.name || anglerId
      await addSubmission(entry.id, { anglerId, angler: anglerName, date, file })
      setAnglerId('')
      setDate('')
      setFile(null)
      setPreviewUrl('')
    } catch (err) {
      setError(err.message || 'Could not add catch. Try again.')
    } finally {
      setBusy(false)
    }
  }

  const deleteCatch = async (submissionId, photoPath) => {
    try {
      await removeSubmission(submissionId, photoPath)
    } catch {
      setError('Could not remove that catch. Try again.')
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal card" onClick={(e) => e.stopPropagation()}>
        <h3>
          {entry.species}
          <span className="modal__category">{entry.category}</span>
        </h3>

        <div className="modal__divider">Catches Logged ({entry.submissions.length})</div>

        {entry.submissions.length > 0 && (
          <ul className="modal__catch-list">
            {entry.submissions.map((sub) => (
              <li key={sub.id} className="modal__catch-row">
                <img src={sub.photo} alt={entry.species} />
                <div className="modal__catch-info">
                  <strong>{sub.angler || 'Angler not logged'}</strong>
                  <span>{sub.date || 'No date logged'}</span>
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    className="modal__catch-remove"
                    aria-label="Remove this catch"
                    onClick={() => deleteCatch(sub.id, sub.photoPath)}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <form className="modal__add-form" onSubmit={addCatch}>
          <div className="modal__divider">Add a Catch</div>

          {roster.length === 0 ? (
            <p className="modal__note">
              No roster entries yet. Ask a club admin to add anglers before catches can be logged.
            </p>
          ) : (
            <label className="field">
              <span>Angler</span>
              <select value={anglerId} onChange={(e) => setAnglerId(e.target.value)} required>
                <option value="" disabled>
                  Select your name
                </option>
                {roster.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="field">
            <span>Date caught</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>

          <label className="field">
            <span>Photo</span>
            <input type="file" accept="image/*" onChange={handlePhoto} required />
          </label>

          {previewUrl && <img className="modal__preview" src={previewUrl} alt="New catch preview" />}

          {error && <p className="modal__error">{error}</p>}

          <div className="modal__actions">
            <button type="button" className="btn" onClick={onClose}>
              Done
            </button>
            <button type="submit" className="btn btn-solid" disabled={busy || !file || !anglerId}>
              {busy ? 'Uploading…' : 'Add Catch'}
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
              <img key={sub.id} src={sub.photo} alt={entry.species} />
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
        <strong>{entry.species}</strong>
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
  const { board, loading } = useSpeciesBoard()
  const { roster } = useRoster()
  const { isAdmin } = useAdminAuth()
  const [editingId, setEditingId] = useState(null)
  const caughtCount = board.filter((r) => r.submissions.length > 0).length
  const pct = Math.round((caughtCount / TOTAL_SPECIES) * 100)
  const activeRoster = roster.filter((r) => r.active)
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
        <div className="species-rules__layout">
          <div className="species-rules__content">
            <h2>FWC - Fishing Challenge Rules</h2>
            <ul>
              {CHALLENGE_RULES.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
          <div className="species-rules__side">
            <a
              className="fish-id-box"
              href="https://myfwc.com/wildlifehabitats/profiles/#!categoryid=1306&subcategoryid=&status="
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="fish-id-box__icon">🔍</span>
              <span className="fish-id-box__label">FISH ID</span>
            </a>
            <a href="https://myfwc.com/" target="_blank" rel="noopener noreferrer">
              <img
                className="species-rules__fwc-logo"
                src={fwcLogo}
                alt="Florida Fish and Wildlife Conservation Commission logo"
              />
            </a>
          </div>
        </div>
      </section>

      {loading ? (
        <p className="species-page__loading">Loading catch board…</p>
      ) : (
        CATEGORIES.map((category) => (
          <CategorySection
            key={category}
            category={category}
            entries={board.filter((r) => r.category === category)}
            onEdit={(entry) => setEditingId(entry.id)}
          />
        ))
      )}

      {editing && (
        <CatchModal
          entry={editing}
          isAdmin={isAdmin}
          roster={activeRoster}
          onClose={() => setEditingId(null)}
        />
      )}
    </div>
  )
}

export default Species
