import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__note">
          Built by the JCHS Fishing Club &middot; {new Date().getFullYear()}
          {' '}&middot;{' '}
          <Link to="/admin" className="site-footer__admin">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  )
}

export default Footer
