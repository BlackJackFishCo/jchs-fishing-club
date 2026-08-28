import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import './Header.css'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/species', label: 'Species Catch List' },
  { to: '/volunteer', label: 'Volunteer Events' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/tournament', label: 'JCHS Fishing Tournament' },
]

function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <header className="site-header">
      <div className="site-header__bar">
        {!isHome && (
          <NavLink to="/" className="site-header__brand" onClick={() => setOpen(false)}>
            <img className="site-header__badge" src={logo} alt="JCHS Fishing Club crest" />
            <span className="site-header__title">John Carroll High School Fishing Club</span>
          </NavLink>
        )}

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
