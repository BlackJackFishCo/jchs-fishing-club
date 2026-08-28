import { useState } from 'react'
import { useAdminAuth, signIn, signOutAdmin } from '../data/auth.js'
import { useRoster, addRosterName, removeRosterName } from '../data/roster.js'
import { useSpeciesBoard, TOTAL_SPECIES } from '../data/species.js'
import './Admin.css'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(email, password)
    } catch {
      setError('Could not sign in. Check the email and password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="admin-login card" onSubmit={submit}>
      <h2>Admin Sign In</h2>
      <label className="field">
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error && <p className="modal__error">{error}</p>}
      <button type="submit" className="btn btn-solid" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}

function RosterManager() {
  const { roster } = useRoster()
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    setError('')
    try {
      await addRosterName(name)
      setName('')
    } catch (err) {
      setError(err.message || 'Could not add that name.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id) => {
    try {
      await removeRosterName(id)
    } catch {
      setError('Could not remove that name.')
    }
  }

  return (
    <section className="admin-roster card">
      <h2>Roster ({roster.length})</h2>
      <p className="admin-roster__note">
        Only anglers on this roster can be selected when logging a catch on the Species Catch
        List.
      </p>

      <form className="admin-roster__add" onSubmit={submit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name (e.g. Jordan Smith)"
        />
        <button type="submit" className="btn btn-solid" disabled={busy || !name.trim()}>
          Add
        </button>
      </form>

      {error && <p className="modal__error">{error}</p>}

      {roster.length === 0 ? (
        <p className="admin-roster__empty">No anglers on the roster yet.</p>
      ) : (
        <ul className="admin-roster__list">
          {roster.map((r) => (
            <li key={r.id}>
              <span>{r.name}</span>
              <button type="button" className="admin-roster__remove" onClick={() => remove(r.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function CatchReport() {
  const { board, loading } = useSpeciesBoard()
  const { roster } = useRoster()

  const allCatches = board.flatMap((entry) =>
    entry.submissions.map((sub) => ({ ...sub, species: entry.species, category: entry.category })),
  )

  const rows = roster
    .map((r) => {
      const catches = allCatches
        .filter((c) => c.anglerId === r.id)
        .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
        .reverse()
      const distinctSpecies = new Set(catches.map((c) => c.speciesId)).size
      return { ...r, catches, distinctSpecies }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const orphanCatches = allCatches.filter((c) => !roster.some((r) => r.id === c.anglerId))

  return (
    <section className="admin-report card">
      <h2>Catch Report</h2>
      <p className="admin-roster__note">
        Every rostered angler and the species they&apos;ve logged, for tracking progress toward
        the {TOTAL_SPECIES}-species challenge.
      </p>

      {loading ? (
        <p className="species-page__loading">Loading catch data…</p>
      ) : rows.length === 0 ? (
        <p className="admin-roster__empty">No anglers on the roster yet.</p>
      ) : (
        <div className="admin-report__list">
          {rows.map((r) => (
            <div key={r.id} className="admin-report__angler">
              <div className="admin-report__angler-head">
                <strong>{r.name}</strong>
                <span>
                  {r.distinctSpecies} / {TOTAL_SPECIES} species
                </span>
              </div>
              {r.catches.length === 0 ? (
                <p className="admin-report__empty">No catches logged yet.</p>
              ) : (
                <table className="admin-report__table">
                  <thead>
                    <tr>
                      <th>Species</th>
                      <th>Category</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.catches.map((c) => (
                      <tr key={c.id}>
                        <td>{c.species}</td>
                        <td>{c.category}</td>
                        <td>{c.date || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}

      {orphanCatches.length > 0 && (
        <div className="admin-report__angler">
          <div className="admin-report__angler-head">
            <strong>Other (no longer on roster)</strong>
          </div>
          <table className="admin-report__table">
            <thead>
              <tr>
                <th>Angler</th>
                <th>Species</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orphanCatches.map((c) => (
                <tr key={c.id}>
                  <td>{c.angler}</td>
                  <td>{c.species}</td>
                  <td>{c.date || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function Admin() {
  const { user, isAdmin, loading } = useAdminAuth()

  return (
    <div className="page admin-page">
      <p className="eyebrow">Club Admin</p>
      <h1 className="section-title">Admin</h1>

      {!user && <LoginForm />}

      {user && loading && <p className="species-page__loading">Checking admin access…</p>}

      {user && !loading && !isAdmin && (
        <div className="card admin-denied">
          <p>
            Signed in as <strong>{user.email}</strong>, but this account isn&apos;t an admin.
          </p>
          <button type="button" className="btn" onClick={signOutAdmin}>
            Sign Out
          </button>
        </div>
      )}

      {user && isAdmin && (
        <>
          <div className="admin-status">
            <span>
              Signed in as <strong>{user.email}</strong>
            </span>
            <button type="button" className="btn" onClick={signOutAdmin}>
              Sign Out
            </button>
          </div>
          <RosterManager />
          <CatchReport />
        </>
      )}
    </div>
  )
}

export default Admin
