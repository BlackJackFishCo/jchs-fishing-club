import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import './Header.css'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/species', label: 'Species Catch List' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/volunteer', label: 'Volunteer Events' },
  { to: '/calendar', label: 'Calendar' },
]

function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isTournamentPage = pathname === '/tournament'

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <button
          className="site-header__toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-header__nav ${open ? 'is-open' : ''}`}>
          {isTournamentPage ? (
            <NavLink to="/" end onClick={() => setOpen(false)}>
              Return to JCHS Club Page
            </NavLink>
          ) : (
            links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? 'is-active' : '')}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
