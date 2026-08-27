import { Link } from 'react-router-dom'
import { useCaughtCount } from '../data/species.js'
import './Home.css'

function Home() {
  const { caught, total } = useCaughtCount()

  return (
    <div className="page home">
      <section className="hero">
        <p className="eyebrow">John Carroll High School &middot; Fort Pierce, FL</p>
        <h1>JCHS Fishing Club</h1>
        <p className="hero__lede">
          A student club for anglers of every skill level &mdash; chasing the required
          species list, giving back through habitat &amp; conservation projects, and
          competing together on the water.
        </p>
        <div className="hero__actions">
          <Link className="btn btn-solid" to="/species">
            See the Species Board
          </Link>
          <Link className="btn" to="/tournament">
            Tournament Info
          </Link>
        </div>
      </section>

      <section className="card mission">
        <p className="eyebrow">Our Mission</p>
        <h2>Mission Statement</h2>
        <p className="mission__text">
          The John Carroll Fishing Club was created for students who are interested in
          learning how to become effective, conservation-minded anglers. The goal is to
          teach students about ethical angling, conservation, Florida&apos;s aquatic
          habitats, basic fishing gear, and general fishing concepts to help create
          confident and responsible anglers.
        </p>
      </section>

      <section className="stat-strip card">
        <div>
          <span className="stat-strip__number">
            {caught} / {total}
          </span>
          <span className="stat-strip__label">Required species caught</span>
        </div>
        <Link className="btn" to="/species">
          View the board &rarr;
        </Link>
      </section>

      <section className="quick-links">
        <Link to="/species" className="quick-links__card card">
          <h3>Species Board</h3>
          <p>Track all 40 required catches with angler, date, and species logged.</p>
        </Link>
        <Link to="/volunteer" className="quick-links__card card">
          <h3>Volunteer Projects</h3>
          <p>Habitat cleanups, mangrove restoration, and community service hours.</p>
        </Link>
        <Link to="/tournament" className="quick-links__card card">
          <h3>Tournament Info</h3>
          <p>Rules, dates, and results for JCHS Fishing Club tournaments.</p>
        </Link>
      </section>
    </div>
  )
}

export default Home
