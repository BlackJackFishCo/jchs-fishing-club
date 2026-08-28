import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__note">
          Built by the JCHS Fishing Club &middot; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}

export default Footer
