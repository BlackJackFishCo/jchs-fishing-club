import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/species', label: 'Species Catch List' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/volunteer', label: 'Volunteer Events' },
  { to: '/calendar', label: 'Calendar' },
  {
    to: '/tournament',
    label: 'John Carroll High School Inshore Slam',
    highlight: true,
  },
]

function Header() {
  const [open, setOpen] = useState(false)

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
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                [isActive ? 'is-active' : '', link.highlight ? 'site-header__nav-highlight' : '']
                  .filter(Boolean)
                  .join(' ')
              }
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
