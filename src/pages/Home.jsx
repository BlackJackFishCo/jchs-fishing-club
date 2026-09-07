import { Link } from 'react-router-dom'
import logo from '../assets/logo-hero.png'
import offTheGridLogo from '../assets/sponsor-off-the-grid.png'
import dancoLogo from '../assets/sponsor-danco.png'
import nlbnLogo from '../assets/sponsor-nlbn.png'
import bajioLogo from '../assets/sponsor-bajio.png'
import jujuLogo from '../assets/sponsor-juju-cast-nets.png'
import fishingCenterLogo from '../assets/sponsor-fishing-center.png'
import blackjackLogo from '../assets/sponsor-blackjack-fish-co.png'
import bassProLogo from '../assets/sponsor-bass-pro-shops.png'
import mangLogo from '../assets/sponsor-mang.png'
import ccaLogo from '../assets/sponsor-cca.png'
import './Home.css'

const tournamentTile = {
  to: '/tournament',
  label: (
    <>
      <span className="tile__label-line">John Carroll High School</span>{' '}
      <span className="tile__label-line">Inshore Slam</span>
    </>
  ),
  subtitle: 'Fishing Tournament',
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
}

function renderTile(tile, areaClass) {
  return (
    <Link key={tile.to} to={tile.to} className={`tile card ${areaClass}`}>
      <span className="tile__icon">{tile.icon}</span>
      <span className="tile__label">{tile.label}</span>
      {tile.subtitle && <span className="tile__subtitle">{tile.subtitle}</span>}
    </Link>
  )
}

function Home() {
  return (
    <div className="page home">
      <div className="home__hero">
        <div className="home__logo-col">
          <Link to="/species" className="hero__picture" aria-label="View the Species Catch List">
            <img src={logo} alt="John Carroll High School Fishing Club crest" />
          </Link>

          <div className="hero-logos">
            <a
              href="https://www.instagram.com/offthegridjohn/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="John Off The Grid on Instagram"
            >
              <img className="hero-logos__sponsor" src={offTheGridLogo} alt='John "Off The Grid" logo' />
            </a>

            <a
              href="https://nlbn.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="NLBN - No Live Bait Needed website"
            >
              <img className="hero-logos__sponsor" src={nlbnLogo} alt="NLBN - No Live Bait Needed logo" />
            </a>

            <a
              href="https://www.dancopliers.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Danco Pliers website"
            >
              <img className="hero-logos__sponsor" src={dancoLogo} alt="Danco Pliers logo" />
            </a>

            <a
              href="https://bajiosunglasses.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bajío Sunglasses website"
            >
              <img className="hero-logos__sponsor" src={bajioLogo} alt="Bajío Sunglasses logo" />
            </a>

            <img className="hero-logos__sponsor" src={jujuLogo} alt="JuJu Cast Nets logo" />
          </div>

          <div className="hero-logos">
            <a
              href="https://www.thefishingcenterfl.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="The Fishing Center website"
            >
              <img className="hero-logos__sponsor" src={fishingCenterLogo} alt="The Fishing Center - Fort Pierce, Florida logo" />
            </a>
            <a
              href="https://blackjackfishco.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Black Jack Fish Co website"
            >
              <img className="hero-logos__sponsor" src={blackjackLogo} alt="Black Jack Fish Co logo" />
            </a>
            <a
              href="https://www.basspro.com/home"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bass Pro Shops website"
            >
              <img className="hero-logos__sponsor" src={bassProLogo} alt="Bass Pro Shops logo" />
            </a>
            <a
              href="https://www.manggear.com/pages/our-mission"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MANG website"
            >
              <img className="hero-logos__sponsor" src={mangLogo} alt="MANG logo" />
            </a>
            <a
              href="https://www.joincca.org/our-story/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join CCA - Coastal Conservation Association website"
            >
              <img className="hero-logos__sponsor" src={ccaLogo} alt="Join CCA - Coastal Conservation Association logo" />
            </a>
          </div>
        </div>

        {renderTile(tournamentTile, 'home__area-inshore')}
      </div>

      <section className="mission">
        <p className="eyebrow">Club Mission</p>
        <p className="mission__text">
          The John Carroll Fishing Club is a community for students who share a passion for
          fishing, the outdoors, and Florida&apos;s incredible aquatic environments. Our mission
          is to help students become confident, skilled, and conservation-minded anglers while
          building friendships and creating unforgettable experiences on the water.
        </p>
        <p className="mission__text">
          Through hands-on experiences and club activities, students will learn about ethical
          and responsible angling, fish conservation, Florida&apos;s aquatic habitats, fishing
          equipment and techniques, and the fundamentals of sport fishing. Whether you&apos;re
          an experienced angler or have never picked up a fishing rod, there&apos;s a place for
          you in our club!
        </p>
        <p className="mission__tagline">Learn. Fish. Conserve. Have Fun.</p>
      </section>

      <Link to="/admin" className="admin-quiet-link" aria-label="Admin access">
        Admin
      </Link>
    </div>
  )
}

export default Home
