import './Tournament.css'

const rules = [
  'Open to all JCHS Fishing Club members in good standing.',
  'All Florida fishing regulations, seasons, and size/bag limits apply.',
  'Fish must be measured and photographed on an official bump board for verification.',
  'Catch-photo-release format — no fish are kept out of the water longer than necessary.',
  'Anglers must be accompanied by a parent, guardian, or approved chaperone on the water.',
  'Scoring and species categories will be announced before each tournament.',
]

function Tournament() {
  return (
    <div className="page tournament-page">
      <p className="eyebrow">Compete</p>
      <h1 className="section-title">Fishing Tournament</h1>
      <p className="tournament-page__intro">
        Tournament details for the JCHS Fishing Club will be posted here as they&apos;re
        finalized. Check back for dates, locations, and results.
      </p>

      <section className="card tournament-next">
        <span className="eyebrow">Next Tournament</span>
        <h2>Date &amp; Location TBD</h2>
        <p>Details will be announced to club members soon &mdash; check back here.</p>
      </section>

      <section className="tournament-rules card">
        <h3>General Rules</h3>
        <ul>
          {rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="tournament-results card">
        <h3>Past Results</h3>
        <p>No tournaments have been recorded yet. Results will be posted after each event.</p>
      </section>
    </div>
  )
}

export default Tournament
