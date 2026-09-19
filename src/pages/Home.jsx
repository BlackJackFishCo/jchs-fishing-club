import { Link } from 'react-router-dom'
import logo from '../assets/logo-hero.png'
import tournamentIcon from '../assets/tile-inshore-slam-icon.png'
import offTheGridLogo from '../assets/sponsor-off-the-grid.png'
import dancoLogo from '../assets/sponsor-danco.png'
import nlbnLogo from '../assets/sponsor-nlbn.png'
import bajioLogo from '../assets/sponsor-bajio.png'
import jujuLogo from '../assets/sponsor-juju-cast-nets.png'
import fwcLogo from '../assets/fwc-logo.png'
import ccaStarLogo from '../assets/sponsor-cca-star.png'
import './Home.css'

const tournamentTile = {
  to: '/tournament',
  image: tournamentIcon,
  label: (
    <>
      <span className="tile__label-line">John Carroll</span>{' '}
      <span className="tile__label-line">Inshore Slam</span>
    </>
  ),
  subtitle: 'Fishing Tournament — October 2027',
}

function renderTile(tile, areaClass) {
  return (
    <Link key={tile.to} to={tile.to} className={`tile card ${areaClass}`}>
      <img className="tile__image" src={tile.image} alt="" aria-hidden="true" />
      <div className="tile__text">
        <span className="tile__label">{tile.label}</span>
        {tile.subtitle && <span className="tile__subtitle">{tile.subtitle}</span>}
      </div>
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
            <div className="hero-logos__col">
              <img
                className="hero-logos__sponsor"
                src={fwcLogo}
                alt="Florida Fish and Wildlife Conservation Commission logo"
              />
              <a
                href="https://www.instagram.com/offthegridjohn/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="John Off The Grid on Instagram"
              >
                <img className="hero-logos__sponsor" src={offTheGridLogo} alt='John "Off The Grid" logo' />
              </a>
            </div>

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

            <div className="hero-logos__col">
              <a
                href="https://ccaflstar.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CCA Florida STAR Tournament website"
              >
                <img
                  className="hero-logos__sponsor"
                  src={ccaStarLogo}
                  alt="CCA Florida STAR presented by Yamaha logo"
                />
              </a>
              <img className="hero-logos__sponsor" src={jujuLogo} alt="JuJu Cast Nets logo" />
            </div>
          </div>
        </div>

        <Link to="/species" className="home__log-catch btn btn-solid">
          Log Your Club Catch Here
        </Link>

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
          equipment, techniques, and the fundamentals of sport fishing. Whether you&apos;re
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
