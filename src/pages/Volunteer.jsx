import { useState } from 'react'
import mangLogo from '../assets/sponsor-mang.png'
import seaSafeLogo from '../assets/sponsor-project-seasafe.png'
import elcLogo from '../assets/sponsor-elc.png'
import wabassoLogo from '../assets/sponsor-wabasso-school-of-fish.png'
import waterwayCleanupFlyer from '../assets/waterway-cleanup-flyer.jpg'
import { useRoster } from '../data/roster.js'
import { useAdminAuth } from '../data/auth.js'
import { useTrashLog, addTrashEntry, removeTrashEntry } from '../data/trashLog.js'
import './Volunteer.css'

const PREFERS_REDUCED_MOTION =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

const projects = [
  {
    title: 'Kids Fishing Clinic',
    status: '8am-11am, November 28, 2026',
    location: 'Vero Beach, FL',
    description:
      'Club members partner with the Environmental Learning Center (ELC) and the Wabasso School of Fish to mentor local kids on casting, knot-tying, and basic tackle at a hands-on fishing clinic.',
    hours: 'Service hours available',
    agenda: [{ text: 'https://www.discoverelc.org/family-fishing-day/', href: 'https://www.discoverelc.org/family-fishing-day/' }],
    sponsors: [
      {
        logo: elcLogo,
        alt: 'Environmental Learning Center logo',
        href: 'https://www.discoverelc.org/',
        imgClassName: 'volunteer-card__sponsor-img--small',
      },
      {
        logo: wabassoLogo,
        alt: 'Wabasso School of Fish logo',
        imgClassName: 'volunteer-card__sponsor-img--small',
      },
    ],
  },
  {
    title: 'Project SeaSafe 2027',
    status: 'April 22-25, 2027',
    location: 'Grant, FL',
    description:
      'Join Star brite’s Project SeaSafe initiative for a hands-on push to clean and protect our local waterways, shorelines, and wildlife.',
    hours: 'Service hours available',
    sponsors: [
      {
        logo: seaSafeLogo,
        alt: 'Star brite Project SeaSafe logo',
        href: 'https://www.projectseasafe.com/',
      },
    ],
  },
  {
    title: 'Virtual Waterway Clean-up',
    status: 'November 21 – 22, 2026',
    hours: 'Service hours available',
    trashLog: true,
    flyer: '/jchsfc-waterway-cleanup-flyer.pdf',
    flyerImage: waterwayCleanupFlyer,
  },
  {
    title: 'Mangrove Restoration Days',
    status: 'Date TBD',
    location: 'West Palm Beach, FL',
    description:
      'Working with local conservation partners to plant and maintain mangroves, which provide critical nursery habitat for snook, redfish, and juvenile game fish.',
    hours: 'Service hours available',
    sponsors: [
      {
        logo: mangLogo,
        alt: 'MANG logo',
        href: 'https://www.manggear.com/pages/our-mission',
      },
    ],
  },
]

function TrashPhotoThumb({ entries }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const active = entries[activeIndex] ?? entries[entries.length - 1]
  const isPulsing = entries.length > 1 && !PREFERS_REDUCED_MOTION

  return (
    <div className="volunteer-card__thumb">
      {active ? (
        <img
          key={active.id}
          className={`volunteer-card__thumb-photo${isPulsing ? ' volunteer-card__thumb-photo--pulsing' : ''}`}
          src={active.photo}
          alt="Trash collected by a club member"
          onAnimationEnd={
            isPulsing ? () => setActiveIndex((i) => (i + 1) % entries.length) : undefined
          }
        />
      ) : (
        <span className="volunteer-card__thumb-placeholder">No trash logged yet</span>
      )}
      <span className="volunteer-card__thumb-badge">Trash</span>
      {entries.length > 1 && (
        <span className="volunteer-card__thumb-count">
          {activeIndex + 1} / {entries.length}
        </span>
      )}
    </div>
  )
}

function FlyerThumb({ image, href }) {
  return (
    <a
      className="volunteer-card__thumb volunteer-card__flyer-thumb"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      <img src={image} alt="Virtual Meetup Waterway Cleanup instructions flyer" />
      <span className="volunteer-card__thumb-badge">PDF</span>
    </a>
  )
}

function TrashLogModal({ entries, loading, onClose }) {
  const { roster } = useRoster()
  const { isAdmin } = useAdminAuth()
  const activeRoster = roster.filter((r) => r.active)

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

  const addEntry = async (e) => {
    e.preventDefault()
    if (!file || !anglerId) return
    setBusy(true)
    setError('')
    try {
      const anglerName = activeRoster.find((r) => r.id === anglerId)?.name || anglerId
      await addTrashEntry({ anglerId, angler: anglerName, date, file })
      setAnglerId('')
      setDate('')
      setFile(null)
      setPreviewUrl('')
    } catch (err) {
      setError(err.message || 'Could not log trash. Try again.')
    } finally {
      setBusy(false)
    }
  }

  const deleteEntry = async (entryId, photoPath) => {
    try {
      await removeTrashEntry(entryId, photoPath)
    } catch {
      setError('Could not remove that entry. Try again.')
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal card" onClick={(e) => e.stopPropagation()}>
        <h3>Virtual Waterway Clean-up</h3>

        <div className="modal__divider">Trash Logged ({entries.length})</div>

        {loading ? (
          <p className="modal__note">Loading…</p>
        ) : entries.length > 0 ? (
          <ul className="modal__catch-list">
            {entries.map((entry) => (
              <li key={entry.id} className="modal__catch-row">
                <img src={entry.photo} alt="Logged trash" />
                <div className="modal__catch-info">
                  <strong>{entry.angler || 'Angler not logged'}</strong>
                  <span>{entry.date || 'No date logged'}</span>
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    className="modal__catch-remove"
                    aria-label="Remove this entry"
                    onClick={() => deleteEntry(entry.id, entry.photoPath)}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="modal__note">No trash logged yet.</p>
        )}

        <form className="modal__add-form" onSubmit={addEntry}>
          <div className="modal__divider">Log Trash</div>

          {activeRoster.length === 0 ? (
            <p className="modal__note">
              No roster entries yet. Ask a club admin to add anglers before trash can be logged.
            </p>
          ) : (
            <label className="field">
              <span>Club Member</span>
              <select value={anglerId} onChange={(e) => setAnglerId(e.target.value)} required>
                <option value="" disabled>
                  Select your name
                </option>
                {activeRoster.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="field">
            <span>Date collected</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>

          <label className="field">
            <span>Photo</span>
            <input type="file" accept="image/*" onChange={handlePhoto} required />
          </label>

          {previewUrl && (
            <img className="modal__preview" src={previewUrl} alt="New trash preview" />
          )}

          {error && <p className="modal__error">{error}</p>}

          <div className="modal__actions">
            <button type="button" className="btn" onClick={onClose}>
              Done
            </button>
            <button type="submit" className="btn btn-solid" disabled={busy || !file || !anglerId}>
              {busy ? 'Uploading…' : 'Log Trash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Volunteer() {
  const [trashModalOpen, setTrashModalOpen] = useState(false)
  const { entries: trashEntries, loading: trashLoading } = useTrashLog()

  return (
    <div className="page volunteer-page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Give Back</p>
          <h1 className="section-title">Volunteer Events 2026-2027</h1>
          <p className="volunteer-page__intro">
            The JCHS Fishing Club is committed to protecting the waters we fish. Below are
            our ongoing and upcoming volunteer projects &mdash; details and sign-ups will be
            posted here as dates are confirmed.
          </p>
        </div>
      </div>

      <div className="volunteer-grid">
        {projects.map((p) => (
          <article
            key={p.title}
            className={`volunteer-card card${p.trashLog ? ' volunteer-card--clickable' : ''}`}
            onClick={p.trashLog ? () => setTrashModalOpen(true) : undefined}
            role={p.trashLog ? 'button' : undefined}
            tabIndex={p.trashLog ? 0 : undefined}
            onKeyDown={
              p.trashLog
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setTrashModalOpen(true)
                    }
                  }
                : undefined
            }
          >
            <div className="calendar-card__top-row">
              <span className="volunteer-card__status">{p.status}</span>
              {p.location && <span className="volunteer-card__location">{p.location}</span>}
            </div>
            <h3>{p.title}</h3>
            {p.trashLog && !trashLoading && (
              <div className="volunteer-card__media">
                <TrashPhotoThumb entries={trashEntries} />
                {p.flyerImage && <FlyerThumb image={p.flyerImage} href={p.flyer} />}
              </div>
            )}
            {p.description && <p>{p.description}</p>}
            {p.agenda && (
              <ul className="volunteer-card__agenda">
                {p.agenda.map((item) => (
                  <li key={item.href || item}>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer">
                        {item.text}
                      </a>
                    ) : (
                      item
                    )}
                  </li>
                ))}
              </ul>
            )}
            <span className="volunteer-card__hours">{p.hours}</span>
            {p.sponsors && (
              <div className="volunteer-card__sponsors">
                {p.sponsors.map((sponsor) =>
                  sponsor.href ? (
                    <a
                      key={sponsor.alt}
                      className="volunteer-card__sponsor"
                      href={sponsor.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={sponsor.alt}
                    >
                      <img src={sponsor.logo} alt={sponsor.alt} className={sponsor.imgClassName} />
                    </a>
                  ) : (
                    <span key={sponsor.alt} className="volunteer-card__sponsor">
                      <img src={sponsor.logo} alt={sponsor.alt} className={sponsor.imgClassName} />
                    </span>
                  ),
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      <section className="card volunteer-cta">
        <h3>Want to help organize a project?</h3>
        <p>Talk to your club officers to get a project added to this page.</p>
      </section>

      {trashModalOpen && (
        <TrashLogModal
          entries={trashEntries}
          loading={trashLoading}
          onClose={() => setTrashModalOpen(false)}
        />
      )}
    </div>
  )
}

export default Volunteer
