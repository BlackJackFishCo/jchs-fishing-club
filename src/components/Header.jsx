import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/species', label: 'Species Board' },
  { to: '/volunteer', label: 'Volunteer Projects' },
  { to: '/tournament', label: 'Tournament Info' },
]

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <NavLink to="/" className="site-header__brand" onClick={() => setOpen(false)}>
          <span className="site-header__badge" aria-hidden="true">
            JC
          </span>
          <span className="site-header__title">
            <strong>JCHS Fishing Club</strong>
            <small>John Carroll High School &middot; Fort Pierce, FL</small>
          </span>
        </NavLink>

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
              className={({ isActive }) => (isActive ? 'is-active' : '')}
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
