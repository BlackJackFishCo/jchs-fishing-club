import { Link } from 'react-router-dom'
import { useCaughtCount } from '../data/species.js'
import logo from '../assets/logo.png'
import snookCatch from '../assets/snook-catch.jpg'
import volunteerCleanup from '../assets/volunteer-cleanup.jpg'
import './Home.css'

const tiles = [
  {
    to: '/species',
    label: 'Species Catch List',
    photo: snookCatch,
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path
          d="M6 32c8-14 22-20 34-14 6 3 11 8 14 14-3 6-8 11-14 14-12 6-26 0-34-14Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <circle cx="20" cy="28" r="2.4" fill="currentColor" />
        <path d="M46 24c4 2 8 5 12 8-4 3-8 6-12 8" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M12 38c3 3 6 5 10 6M12 26c3-3 6-5 10-6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    to: '/volunteer',
    label: 'Volunteer Events',
    photo: volunteerCleanup,
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path
          d="M32 10c8 8 12 16 12 22a12 12 0 1 1-24 0c0-6 4-14 12-22Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path d="M24 36c1 4 4 7 8 8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 48h36M20 54h24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/tournament',
    label: 'Charity Fishing Tournament',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path
          d="M20 12h24v12a12 12 0 0 1-24 0V12Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path d="M20 16h-6a6 6 0 0 0 6 10M44 16h6a6 6 0 0 1-6 10" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M32 36v8M24 52h16M27 52c0-4 1.5-6 5-8 3.5 2 5 4 5 8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

function Home() {
  const { caught, total } = useCaughtCount()

  return (
    <div className="page home">
      <section className="hero">
        <Link to="/species" className="hero__picture" aria-label="View the Species Catch List">
          <img src={logo} alt="John Carroll High School Fishing Club crest" />
        </Link>
        <p className="hero__tagline">
          Ethical angling &middot; conservation &middot; the waters of Fort Pierce, Florida
        </p>
      </section>

      <section className="tile-grid">
        {tiles.map((tile) => (
          <Link
            key={tile.to}
            to={tile.to}
            className={`tile card ${tile.photo ? 'tile--photo' : ''}`}
          >
            {tile.photo && (
              <img className="tile__photo" src={tile.photo} alt="" aria-hidden="true" />
            )}
            {!tile.photo && <span className="tile__icon">{tile.icon}</span>}
            <span className="tile__label">{tile.label}</span>
            {tile.to === '/species' && (
              <span className="tile__meta">
                {caught} / {total} caught
              </span>
            )}
          </Link>
        ))}
      </section>

      <section className="card mission">
        <p className="eyebrow">Our Mission</p>
        <p className="mission__text">
          The John Carroll Fishing Club was created for students who are interested in
          learning how to become effective, conservation-minded anglers. The goal is to
          teach students about ethical angling, conservation, Florida&apos;s aquatic
          habitats, basic fishing gear, and general fishing concepts to help create
          confident and responsible anglers.
        </p>
      </section>
    </div>
  )
}

export default Home
