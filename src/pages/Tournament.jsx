import { useState } from 'react'
import { addRegistration, MAX_ANGLERS, SHIRT_SIZES } from '../data/registration.js'
import logo from '../assets/logo.png'
import snookFish from '../assets/sponsor-tier-snook.png'
import redfishFish from '../assets/sponsor-tier-redfish.png'
import troutFish from '../assets/sponsor-tier-trout.png'
import offTheGridLogo from '../assets/sponsor-off-the-grid.png'
import dancoLogo from '../assets/sponsor-danco.png'
import nlbnLogo from '../assets/sponsor-nlbn.png'
import bajioLogo from '../assets/sponsor-bajio.png'
import './Tournament.css'

const TIER_FISH = {
  Title: logo,
  Snook: snookFish,
  Redfish: redfishFish,
  Trout: troutFish,
}

const SECTIONS = ['Home', 'Registration', 'Rules', 'Awards', 'Photo Gallery', 'Sponsorship']

const CONTACT_EMAIL = 'Jstelmacki@gmail.com'
const REGISTRATION_OPEN = false

const SPONSOR_TIERS = [
  {
    name: 'Title',
    price: '$5,000',
    perks: [
      'Company Name in Official Event Logo as Title Sponsor',
      '4 Tournament Entries (4 Boats)',
      '25 Raffle Tickets',
      'Company Logo and Website Link on JCHS Fishing Club Website',
      'Company Logo on Leader Board during the John Carroll High School Inshore Slam',
      '2 Social Media Mentions on JCHS Fishing Club Accounts',
      'In Person Activation Space at the Inshore Slam',
    ],
  },
  {
    name: 'Snook',
    price: '$2,500',
    perks: [
      '2 Tournament Entries',
      'Company Logo on Event Banner',
      '15 JCHS Fishing Club Tickets',
      'Company Logo and Website Link on JCHS Fishing Club Website',
      'Company Logo on Ribbon Board during the John Carroll High School Inshore Slam',
      'In Person Activation Space at the Inshore Slam',
    ],
  },
  {
    name: 'Redfish',
    price: '$1,000',
    perks: [
      '1 Tournament Entry',
      'Company Logo on Event Banners and Leader Board',
      '10 JCHS Fishing Club Raffle Tickets',
      'Company Logo and Website Link on JCHS Fishing Club Website',
    ],
  },
  {
    name: 'Trout',
    price: '$500',
    perks: [
      '1 Tournament Entry',
      '5 JCHS Fishing Club Raffle Tickets',
      'Company Logo and Website Link on JCHS Fishing Club Website',
    ],
  },
]

const EMPTY_ANGLER = { firstName: '', lastName: '', email: '', phone: '', shirtSize: '' }

function RegistrationSection() {
  const [anglers, setAnglers] = useState(
    Array.from({ length: MAX_ANGLERS }, () => ({ ...EMPTY_ANGLER })),
  )
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const updateAngler = (index, field, value) => {
    setAnglers((prev) => prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)))
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const filled = anglers.filter((a) => a.firstName.trim())
      await addRegistration(filled)
      setAnglers(Array.from({ length: MAX_ANGLERS }, () => ({ ...EMPTY_ANGLER })))
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Could not submit registration. Try again.')
    } finally {
      setBusy(false)
    }
  }

  if (success) {
    return (
      <section className="card registration-success">
        <p className="registration-success__text">
          Registration submitted! We&apos;ll be in touch with next steps.
        </p>
        <button type="button" className="btn" onClick={() => setSuccess(false)}>
          Register Another Boat
        </button>
      </section>
    )
  }

  return (
    <form className="registration card" onSubmit={submit}>
      <p className="registration__intro">
        Please register your boat&apos;s anglers below. You can register up to {MAX_ANGLERS}{' '}
        anglers.
      </p>

      {!REGISTRATION_OPEN && (
        <p className="registration__notice">Registration is not open yet. Check back soon!</p>
      )}

      {anglers.map((angler, index) => (
        <fieldset key={index} className="registration__angler">
          <legend>{index === 0 ? 'Angler 1 / Captain' : `Angler ${index + 1}`}</legend>

          <div className="registration__row">
            <label className="field">
              <span>First Name{index === 0 ? '*' : ''}</span>
              <input
                value={angler.firstName}
                onChange={(e) => updateAngler(index, 'firstName', e.target.value)}
                required={index === 0}
              />
            </label>
            <label className="field">
              <span>Last Name{index === 0 ? '*' : ''}</span>
              <input
                value={angler.lastName}
                onChange={(e) => updateAngler(index, 'lastName', e.target.value)}
                required={index === 0}
              />
            </label>
          </div>

          <div className="registration__row">
            <label className="field">
              <span>Email{index === 0 ? '*' : ''}</span>
              <input
                type="email"
                value={angler.email}
                onChange={(e) => updateAngler(index, 'email', e.target.value)}
                required={index === 0}
              />
            </label>
            <label className="field">
              <span>Phone Number{index === 0 ? '*' : ''}</span>
              <input
                type="tel"
                value={angler.phone}
                onChange={(e) => updateAngler(index, 'phone', e.target.value)}
                required={index === 0}
              />
            </label>
          </div>

          <label className="field registration__shirt">
            <span>Shirt Size{index === 0 ? '*' : ''}</span>
            <select
              value={angler.shirtSize}
              onChange={(e) => updateAngler(index, 'shirtSize', e.target.value)}
              required={index === 0}
            >
              <option value="" disabled>
                Select size
              </option>
              {SHIRT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
      ))}

      {error && <p className="modal__error">{error}</p>}

      <button type="submit" className="btn btn-solid" disabled={busy || !REGISTRATION_OPEN}>
        {busy ? 'Submitting…' : REGISTRATION_OPEN ? 'Submit Registration' : 'Registration Not Open Yet'}
      </button>
    </form>
  )
}

function SponsorshipSection() {
  return (
    <div className="sponsorship">
      <p className="sponsorship__intro">
        All participants will receive a team bucket, including an event shirt and other goodies.
        We
        have many different sponsorship opportunities and can customize to fit your budget. For
        inquiries and to register for the event, please contact{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <div className="sponsor-grid">
        {SPONSOR_TIERS.map((tier) => (
          <div key={tier.name} className="sponsor-card card">
            {TIER_FISH[tier.name] && (
              <img
                className={`sponsor-card__fish sponsor-card__fish--${tier.name.toLowerCase()}`}
                src={TIER_FISH[tier.name]}
                alt={tier.name === 'Title' ? 'JCHS Fishing Club crest' : `${tier.name} illustration`}
              />
            )}
            <div className="sponsor-card__body">
              <div className="sponsor-card__head">
                <h3>{tier.name} Sponsor</h3>
                <span className="sponsor-card__price">{tier.price}</span>
              </div>
              <ul className="sponsor-card__perks">
                {tier.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
              <a
                className="sponsor-card__cta"
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  `John Carroll High School Inshore Slam Sponsorship — ${tier.name}`,
                )}`}
              >
                Get in Touch
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HomeSection() {
  return (
    <section className="card tournament-home">
      <h2 className="tournament-home__heading">JCHS Inshore Slam Fishing Tournament</h2>
      <p>
        Think you&apos;ve got what it takes to boat the biggest inshore SLAM on the Treasure Coast?
      </p>
      <p className="tournament-home__prove">Prove it.</p>
      <p>
        Join us for the John Carroll High School Inshore Slam, a charity inshore fishing tournament
        battling it out for the biggest Snook, Redfish, and Trout. 100% of proceeds go to
        supporting the JCHS fishing club — helping the next generation of anglers learn the water,
        the regulations, and the sport we love.
      </p>
      <p>
        Grab your rods, load the boat, and see if you&apos;ve got what it takes to take home the
        title this year.
      </p>
      <p className="tournament-home__proceeds">Let&apos;s go fishing!</p>
    </section>
  )
}

const EVENT_INFO = [
  { label: 'Registration Ends', value: '00/2027' },
  { label: 'Captains Meeting', value: '0:00pm 00/2027' },
  { label: 'Lines In', value: '0:00am 00/2027' },
  { label: 'Lines Out', value: '0:00pm 00/2027' },
  { label: 'Awards', value: '0:00pm 00/2026' },
]

function EventInfoRow() {
  return (
    <div className="tournament-info-grid">
      {EVENT_INFO.map((item) => (
        <div key={item.label} className="tournament-info-card">
          <span className="tournament-info-card__label">{item.label}</span>
          <span className="tournament-info-card__value">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

function HeroLogos() {
  return (
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

      <span className="hero__picture">
        <img src={logo} alt="John Carroll High School Fishing Club crest" />
      </span>

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
    </div>
  )
}

function Tournament() {
  const [active, setActive] = useState(SECTIONS[0])

  return (
    <div className="page tournament-page">
      <p className="eyebrow">Compete</p>
      <h1 className="section-title">John Carroll High School Inshore Slam</h1>

      <div className="tournament-tabs">
        {SECTIONS.map((section) => (
          <button
            key={section}
            type="button"
            className={`tournament-tabs__btn ${active === section ? 'is-active' : ''}`}
            onClick={() => setActive(section)}
          >
            {section}
          </button>
        ))}
      </div>

      {active === 'Home' && (
        <>
          <HomeSection />
          <EventInfoRow />
          <HeroLogos />
        </>
      )}

      {active === 'Registration' && <RegistrationSection />}

      {active === 'Sponsorship' && <SponsorshipSection />}

      {active !== 'Home' && active !== 'Registration' && active !== 'Sponsorship' && (
        <section className="card tournament-tbd">
          <p className="tournament-tbd__label">{active}</p>
          <p className="tournament-tbd__text">Coming Soon</p>
        </section>
      )}
    </div>
  )
}

export default Tournament
