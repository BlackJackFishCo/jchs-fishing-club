import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <strong>JCHS Fishing Club</strong>
          <p>John Carroll High School &middot; Fort Pierce, Florida</p>
        </div>
        <p className="site-footer__note">
          Built by the JCHS Fishing Club &middot; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}

export default Footer
