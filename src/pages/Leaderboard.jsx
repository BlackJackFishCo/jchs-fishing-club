import { useRoster } from '../data/roster.js'
import { useSpeciesBoard, TOTAL_SPECIES } from '../data/species.js'
import logo from '../assets/logo.png'
import fwcLogo from '../assets/fwc-logo.png'
import './Leaderboard.css'

function Leaderboard() {
  const { roster, loading: rosterLoading } = useRoster()
  const { board, loading: boardLoading } = useSpeciesBoard()
  const loading = rosterLoading || boardLoading

  const allCatches = board.flatMap((entry) =>
    entry.submissions.map((sub) => ({ ...sub, species: entry.species })),
  )

  const rows = roster
    .filter((r) => r.active)
    .map((r) => {
      const caught = allCatches.filter((c) => c.anglerId === r.id)
      const speciesCaught = [...new Map(caught.map((c) => [c.speciesId, c.species])).values()].sort(
        (a, b) => a.localeCompare(b),
      )
      return { id: r.id, name: r.name, distinctSpecies: speciesCaught.length, speciesCaught }
    })
    .sort((a, b) => b.distinctSpecies - a.distinctSpecies || a.name.localeCompare(b.name))

  return (
    <div className="page leaderboard-page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Top Anglers</p>
          <h1 className="section-title">Club Leaderboard 2026-2027</h1>
          <p className="volunteer-page__intro">
            Rostered anglers ranked by how many of the {TOTAL_SPECIES} species they&apos;ve
            logged on the Species Catch List.
          </p>
        </div>
        <div className="page-head__logos">
          <img className="species-rules__fwc-logo" src={fwcLogo} alt="Florida Fish and Wildlife Conservation Commission logo" />
          <img className="page-head__logo" src={logo} alt="JCHS Fishing Club crest" />
        </div>
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
                <div className="leaderboard-row__top">
                  <span className="leaderboard-row__rank">{i + 1}</span>
                  <span className="leaderboard-row__name">{r.name}</span>
                  <span className="leaderboard-row__bar">
                    <span className="leaderboard-row__fill" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="leaderboard-row__count">
                    {r.distinctSpecies} / {TOTAL_SPECIES}
                  </span>
                </div>

                {r.speciesCaught.length > 0 ? (
                  <ul className="leaderboard-row__species">
                    {r.speciesCaught.map((species) => (
                      <li key={species}>{species}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="leaderboard-row__empty">No catches logged yet.</p>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

export default Leaderboard
