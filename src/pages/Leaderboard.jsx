import { useRoster } from '../data/roster.js'
import { useSpeciesBoard, TOTAL_SPECIES } from '../data/species.js'
import logo from '../assets/logo.png'
import './Leaderboard.css'

function Leaderboard() {
  const { roster, loading: rosterLoading } = useRoster()
  const { board, loading: boardLoading } = useSpeciesBoard()
  const loading = rosterLoading || boardLoading

  const allCatches = board.flatMap((entry) => entry.submissions)

  const rows = roster
    .filter((r) => r.active)
    .map((r) => {
      const distinctSpecies = new Set(
        allCatches.filter((c) => c.anglerId === r.id).map((c) => c.speciesId),
      ).size
      return { id: r.id, name: r.name, distinctSpecies }
    })
    .sort((a, b) => b.distinctSpecies - a.distinctSpecies || a.name.localeCompare(b.name))

  return (
    <div className="page leaderboard-page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Top Anglers</p>
          <h1 className="section-title">Leaderboard</h1>
          <p className="volunteer-page__intro">
            Rostered anglers ranked by how many of the {TOTAL_SPECIES} species they&apos;ve
            logged on the Species Catch List.
          </p>
        </div>
        <img className="page-head__logo" src={logo} alt="JCHS Fishing Club crest" />
      </div>

      {loading ? (
        <p className="species-page__loading">Loading leaderboard…</p>
      ) : rows.length === 0 ? (
        <p className="admin-roster__empty">No anglers on the roster yet.</p>
      ) : (
        <ol className="leaderboard-list">
          {rows.map((r, i) => {
            const pct = Math.round((r.distinctSpecies / TOTAL_SPECIES) * 100)
            return (
              <li key={r.id} className="leaderboard-row">
                <span className="leaderboard-row__rank">{i + 1}</span>
                <span className="leaderboard-row__name">{r.name}</span>
                <span className="leaderboard-row__bar">
                  <span className="leaderboard-row__fill" style={{ width: `${pct}%` }} />
                </span>
                <span className="leaderboard-row__count">
                  {r.distinctSpecies} / {TOTAL_SPECIES}
                </span>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

export default Leaderboard
