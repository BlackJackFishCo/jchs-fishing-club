import { useState } from 'react'
import { useAdminAuth, signIn, createAccount, signOutAdmin } from '../data/auth.js'
import { useRoster, addRosterName, removeRosterName } from '../data/roster.js'
import { useAdmins, addAdmin, removeAdmin } from '../data/admins.js'
import { useSpeciesBoard, TOTAL_SPECIES } from '../data/species.js'
import { useRegistrations } from '../data/registration.js'
import {
  useTournamentTeams,
  seedPlaceholderTeams,
  addTeam,
  updateTeam,
  removeTeam,
  MAX_TEAM_ANGLERS,
  useTournamentCatches,
  restoreCatch,
  permanentlyDeleteCatch,
  useCatchActivityLog,
} from '../data/tournamentLeaderboard.js'
import './Admin.css'

function LoginForm() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (mode === 'signin') {
        await signIn(email, password)
      } else {
        await createAccount(email, password)
      }
    } catch {
      setError(
        mode === 'signin'
          ? 'Could not sign in. Check the email and password.'
          : 'Could not create that account. Password must be at least 6 characters.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="admin-login card" onSubmit={submit}>
      <h2>{mode === 'signin' ? 'Admin Sign In' : 'Create Account'}</h2>
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
        {busy ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
      </button>
      <button
        type="button"
        className="admin-login__switch"
        onClick={() => {
          setMode(mode === 'signin' ? 'signup' : 'signin')
          setError('')
        }}
      >
        {mode === 'signin'
          ? "Don't have an account? Create one"
          : 'Already have an account? Sign in'}
      </button>
    </form>
  )
}

function AdminsManager({ currentUid }) {
  const { admins } = useAdmins()
  const [label, setLabel] = useState('')
  const [uid, setUid] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!uid.trim()) return
    setBusy(true)
    setError('')
    try {
      await addAdmin(uid, label)
      setLabel('')
      setUid('')
    } catch (err) {
      setError(err.message || 'Could not add that admin.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (adminUid) => {
    try {
      await removeAdmin(adminUid)
    } catch {
      setError('Could not remove that admin.')
    }
  }

  return (
    <section className="admin-roster card">
      <h2>Admins ({admins.length})</h2>
      <p className="admin-roster__note">
        Anyone who wants access first creates an account above, then sends you their User ID
        (shown on their screen once signed in). Paste it here to grant them admin.
      </p>

      <form className="admin-roster__add" onSubmit={submit}>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Name (e.g. Coach Smith)" />
        <input value={uid} onChange={(e) => setUid(e.target.value)} placeholder="User ID" />
        <button type="submit" className="btn btn-solid" disabled={busy || !uid.trim()}>
          Add
        </button>
      </form>

      {error && <p className="modal__error">{error}</p>}

      {admins.length === 0 ? (
        <p className="admin-roster__empty">No admins on record yet.</p>
      ) : (
        <ul className="admin-roster__list">
          {admins.map((a) => (
            <li key={a.uid}>
              <span>{a.label || a.uid}</span>
              <button
                type="button"
                className="admin-roster__remove"
                onClick={() => remove(a.uid)}
                disabled={a.uid === currentUid}
                title={a.uid === currentUid ? "You can't remove yourself" : 'Remove admin'}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
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

function TeamRow({ team }) {
  const [name, setName] = useState(team.name)
  const [anglers, setAnglers] = useState([
    team.anglers[0] || '',
    team.anglers[1] || '',
    team.anglers[2] || '',
    team.anglers[3] || '',
  ])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const dirty = name !== team.name || anglers.some((a, i) => a !== (team.anglers[i] || ''))

  const save = async () => {
    setBusy(true)
    setError('')
    try {
      await updateTeam(team.id, { name, anglers })
    } catch (err) {
      setError(err.message || 'Could not save.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!window.confirm(`Remove ${team.name}? This can't be undone.`)) return
    try {
      await removeTeam(team.id)
    } catch {
      setError('Could not remove team.')
    }
  }

  return (
    <tr>
      <td>
        <input
          className="team-roster__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </td>
      {anglers.map((angler, i) => (
        <td key={i}>
          <input
            className="team-roster__input"
            value={angler}
            placeholder={`Angler ${i + 1}`}
            onChange={(e) =>
              setAnglers((prev) => prev.map((a, idx) => (idx === i ? e.target.value : a)))
            }
          />
        </td>
      ))}
      <td className="team-roster__actions">
        <button type="button" className="btn" disabled={!dirty || busy} onClick={save}>
          {busy ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className="admin-roster__remove" onClick={remove}>
          Remove
        </button>
        {error && <span className="modal__error">{error}</span>}
      </td>
    </tr>
  )
}

function TeamRosterManager() {
  const { teams, loading } = useTournamentTeams()
  const [newTeamName, setNewTeamName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const seed = async () => {
    setBusy(true)
    setError('')
    try {
      await seedPlaceholderTeams()
    } catch (err) {
      setError(err.message || 'Could not seed teams.')
    } finally {
      setBusy(false)
    }
  }

  const submitNewTeam = async (e) => {
    e.preventDefault()
    if (!newTeamName.trim()) return
    setBusy(true)
    setError('')
    try {
      await addTeam(newTeamName)
      setNewTeamName('')
    } catch (err) {
      setError(err.message || 'Could not add team.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="admin-report team-roster card">
      <h2>Tournament Teams ({teams.length})</h2>
      <p className="admin-roster__note">
        Teams and anglers shown here populate the Team and Angler pickers on the Inshore Slam
        Live Leaderboard. Each team can have up to {MAX_TEAM_ANGLERS} anglers.
      </p>

      {!loading && teams.length === 0 && (
        <button type="button" className="btn btn-solid" disabled={busy} onClick={seed}>
          {busy ? 'Adding…' : 'Add 20 Placeholder Teams'}
        </button>
      )}

      <form className="admin-roster__add" onSubmit={submitNewTeam}>
        <input
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="Add another team (e.g. Reel Deal)"
        />
        <button type="submit" className="btn btn-solid" disabled={busy || !newTeamName.trim()}>
          Add
        </button>
      </form>

      {error && <p className="modal__error">{error}</p>}

      {loading ? (
        <p className="species-page__loading">Loading teams…</p>
      ) : teams.length === 0 ? (
        <p className="admin-roster__empty">No teams yet.</p>
      ) : (
        <div className="team-roster__scroll">
          <table className="admin-report__table team-roster__table">
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Angler 1</th>
                <th>Angler 2</th>
                <th>Angler 3</th>
                <th>Angler 4</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <TeamRow key={team.id} team={team} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function DeletedCatchesManager({ admin }) {
  const { teams } = useTournamentTeams()
  const { deletedCatches, loading } = useTournamentCatches()
  const [error, setError] = useState('')

  const teamName = (teamId) => teams.find((t) => t.id === teamId)?.name || teamId

  const restore = async (catchData) => {
    try {
      await restoreCatch(catchData, admin)
    } catch {
      setError('Could not restore that catch.')
    }
  }

  const purge = async (catchData) => {
    if (!window.confirm('Permanently delete this catch? This cannot be undone.')) return
    try {
      await permanentlyDeleteCatch(catchData, admin)
    } catch {
      setError('Could not permanently delete that catch.')
    }
  }

  return (
    <section className="admin-report team-roster card">
      <h2>Recently Deleted Catches ({deletedCatches.length})</h2>
      <p className="admin-roster__note">
        Removing a catch on the Live Leaderboard sends it here instead of erasing it right away.
        Restore a mistake, or permanently delete once you&apos;re sure.
      </p>

      {error && <p className="modal__error">{error}</p>}

      {loading ? (
        <p className="species-page__loading">Loading…</p>
      ) : deletedCatches.length === 0 ? (
        <p className="admin-roster__empty">Nothing deleted.</p>
      ) : (
        <ul className="admin-roster__list">
          {deletedCatches.map((c) => (
            <li key={c.id}>
              <span>
                {teamName(c.teamId)} — {c.species} — {c.angler} — {c.inches}&quot;
              </span>
              <span className="team-roster__actions">
                <button type="button" className="btn" onClick={() => restore(c)}>
                  Restore
                </button>
                <button
                  type="button"
                  className="admin-roster__remove"
                  onClick={() => purge(c)}
                >
                  Delete Forever
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

const ACTIVITY_LOG_LABELS = {
  verify: 'Verified',
  unverify: 'Unverified',
  edit_inches: 'Edited length',
  remove: 'Removed',
  restore: 'Restored',
  purge: 'Permanently deleted',
}

function formatLogTimestamp(at) {
  if (!at?.toDate) return 'Just now'
  return at.toDate().toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  })
}

function formatLogValue(entry, value) {
  if (value === null || value === undefined) return '—'
  if (entry.field === 'inches') return `${value}"`
  if (entry.field === 'verified') return value ? 'Verified' : 'Not verified'
  if (entry.field === 'deleted') {
    if (value === 'purged') return 'Purged'
    return value ? 'Deleted' : 'Active'
  }
  return String(value)
}

function TournamentActivityLog() {
  const { teams } = useTournamentTeams()
  const { entries, loading } = useCatchActivityLog()

  const teamName = (teamId) => teams.find((t) => t.id === teamId)?.name || teamId

  return (
    <section className="admin-report team-roster card">
      <h2>Catch Activity Log</h2>
      <p className="admin-roster__note">
        Every verify, edit, remove, restore, and permanent delete on a logged catch, so you can
        check what happened during a tournament without opening Firestore.
      </p>

      {loading ? (
        <p className="species-page__loading">Loading activity…</p>
      ) : entries.length === 0 ? (
        <p className="admin-roster__empty">No admin activity logged yet.</p>
      ) : (
        <div className="team-roster__scroll admin-report__activity-scroll">
          <table className="admin-report__table">
            <thead>
              <tr>
                <th>When</th>
                <th>Admin</th>
                <th>Team</th>
                <th>Species</th>
                <th>Action</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{formatLogTimestamp(entry.at)}</td>
                  <td>{entry.adminEmail || 'Unknown'}</td>
                  <td>{teamName(entry.teamId)}</td>
                  <td>{entry.species}</td>
                  <td>{ACTIVITY_LOG_LABELS[entry.action] || entry.action}</td>
                  <td>
                    {formatLogValue(entry, entry.oldValue)} → {formatLogValue(entry, entry.newValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

function RegistrationReport() {
  const { registrations, loading } = useRegistrations()

  return (
    <section className="admin-report registration-report card">
      <div className="registration-report__head">
        <div>
          <h2>Tournament Registrations</h2>
          <p className="admin-roster__note">
            Every boat registered for the John Carroll High School Inshore Slam, with
            each angler&apos;s
            contact info, shirt size, and award-eligibility flags.
          </p>
        </div>
        <button
          type="button"
          className="btn registration-report__print"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>

      {loading ? (
        <p className="species-page__loading">Loading registrations…</p>
      ) : registrations.length === 0 ? (
        <p className="admin-roster__empty">No teams registered yet.</p>
      ) : (
        <div className="admin-report__list">
          {registrations.map((reg, i) => (
            <div key={reg.id} className="admin-report__angler">
              <div className="admin-report__angler-head">
                <strong>Team {i + 1}</strong>
                <span>
                  {reg.anglers.length} angler{reg.anglers.length === 1 ? '' : 's'}
                </span>
              </div>
              <table className="admin-report__table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Shirt Size</th>
                    <th>Junior</th>
                    <th>Club Member</th>
                    <th>Female</th>
                  </tr>
                </thead>
                <tbody>
                  {reg.anglers.map((a, j) => (
                    <tr key={j}>
                      <td>
                        {a.firstName} {a.lastName}
                      </td>
                      <td>{a.email}</td>
                      <td>{a.phone}</td>
                      <td>{a.shirtSize || '—'}</td>
                      <td>{a.isJunior ? 'Yes' : 'No'}</td>
                      <td>{a.isClubMember ? 'Yes' : 'No'}</td>
                      <td>{a.isFemale ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function Admin() {
  const { user, isAdmin, loading } = useAdminAuth()
  const admin = user ? { uid: user.uid, email: user.email } : null

  return (
    <div className="page admin-page">
      <p className="eyebrow">Club Admin</p>
      <h1 className="section-title">Admin</h1>

      {!user && <LoginForm />}

      {user && loading && <p className="species-page__loading">Checking admin access…</p>}

      {user && !loading && !isAdmin && (
        <div className="card admin-denied">
          <p>
            Signed in as <strong>{user.email}</strong>, but this account isn&apos;t an admin yet.
          </p>
          <p>
            Send this User ID to an existing admin so they can grant you access:
            <br />
            <code className="admin-denied__uid">{user.uid}</code>
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
          <TeamRosterManager />
          <DeletedCatchesManager admin={admin} />
          <TournamentActivityLog />
          <AdminsManager currentUid={user.uid} />
          <RegistrationReport />
          <CatchReport />
        </>
      )}
    </div>
  )
}

export default Admin
