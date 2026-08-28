import { useState } from 'react'
import './Tournament.css'

const SECTIONS = ['Registration', 'Rules', 'Sponsorship']

function Tournament() {
  const [active, setActive] = useState(SECTIONS[0])

  return (
    <div className="page tournament-page">
      <p className="eyebrow">Compete</p>
      <h1 className="section-title">JCHS Fishing Tournament</h1>

      <div className="tournament-tabs">
        {SECTIONS.map((section) => (
          <button
            key={section}
            type="button"
            className={`tournament-tabs__btn ${active === section ? 'is-active' : ''}`}
            onClick={() => setActive(section)}
          >
            {section}
          </button>
        ))}
      </div>

      <section className="card tournament-tbd">
        <p className="tournament-tbd__label">{active}</p>
        <p className="tournament-tbd__text">Coming Soon</p>
      </section>
    </div>
  )
}

export default Tournament
