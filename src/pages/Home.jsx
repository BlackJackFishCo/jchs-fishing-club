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
import heroBackground from '../assets/home-hero-photo.jpg'
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
      <section className="home-hero-banner" style={{ '--home-hero-photo': `url(${heroBackground})` }}>
        <Link to="/species" className="hero__picture" aria-label="View the Species Catch List">
          <img src={logo} alt="John Carroll High School Fishing Club crest" />
        </Link>

        <div className="home-hero-banner__content">
          <div className="home-hero-banner__mission">
            <p className="eyebrow">Club Mission</p>
            <p className="mission__text">
              The John Carroll Fishing Club is a community for students who share a passion for
              fishing, the outdoors, and Florida&apos;s incredible aquatic environments. Our
              mission is to help students become confident, skilled, and conservation-minded
              anglers while building friendships and creating unforgettable experiences on the
              water.
            </p>
            <p className="mission__text">
              Through hands-on experiences and club activities, students will learn about ethical
              and responsible angling, fish conservation, Florida&apos;s aquatic habitats,
              fishing equipment, techniques, and the fundamentals of sport fishing. Whether
              you&apos;re an experienced angler or have never picked up a fishing rod,
              there&apos;s a place for you in our club!
            </p>
            <p className="mission__tagline">Learn. Fish. Conserve. Have Fun.</p>
          </div>

          <Link to="/species" className="home__log-catch btn btn-solid">
            Log Your Club Catch Here
          </Link>
        </div>

        <svg
          className="home-hero-banner__wave"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,22 Q180,48 280,65 Q380,82 500,72 Q620,62 720,42 Q820,22 930,34 Q1040,46 1150,57 Q1260,68 1350,63 L1440,58 L1440,100 L0,100 Z"
            fill="#ffffff"
          />
          <path
            d="M0,18 Q180,37.9 280,52 Q380,66.2 500,54.3 Q620,42.4 720,22.4 Q820,2.4 930,16.1 Q1040,29.7 1150,43.8 Q1260,57.9 1350,56 L1440,54 L1440,54 Q1260,61.7 1150,49.5 Q1040,37.4 930,24.8 Q820,12.1 720,32.1 Q620,52.1 500,62.8 Q380,73.6 280,57.6 Q180,41.7 90,29.9 L0,18 Z"
            fill="rgba(245, 197, 24, 0.35)"
          />
        </svg>
      </section>

      <section className="home-white-section">
        <div className="home-sponsor-strip__row">
          <span className="home-sponsor-strip__logo">
            <img src={fwcLogo} alt="Florida Fish and Wildlife Conservation Commission logo" />
          </span>

          <a
            href="https://www.instagram.com/offthegridjohn/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="John Off The Grid on Instagram"
            className="home-sponsor-strip__logo"
          >
            <img src={offTheGridLogo} alt='John "Off The Grid" logo' />
          </a>

          <a
            href="https://nlbn.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="NLBN - No Live Bait Needed website"
            className="home-sponsor-strip__logo"
          >
            <img
              className="home-sponsor-strip__logo--nlbn"
              src={nlbnLogo}
              alt="NLBN - No Live Bait Needed logo"
            />
          </a>

          <a
            href="https://www.dancopliers.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Danco Pliers website"
            className="home-sponsor-strip__logo"
          >
            <img src={dancoLogo} alt="Danco Pliers logo" />
          </a>

          <a
            href="https://bajiosunglasses.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bajío Sunglasses website"
            className="home-sponsor-strip__logo"
          >
            <img src={bajioLogo} alt="Bajío Sunglasses logo" />
          </a>

          <span className="home-sponsor-strip__logo">
            <img src={jujuLogo} alt="JuJu Cast Nets logo" />
          </span>

          <a
            href="https://ccaflstar.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CCA Florida STAR Tournament website"
            className="home-sponsor-strip__logo"
          >
            <img src={ccaStarLogo} alt="CCA Florida STAR presented by Yamaha logo" />
          </a>
        </div>

        <div className="home__hero home__hero--tile-only">
          {renderTile(tournamentTile, 'home__area-inshore')}
        </div>

        <Link to="/admin" className="admin-quiet-link" aria-label="Admin access">
          Admin
        </Link>
      </section>
    </div>
  )
}

export default Home
