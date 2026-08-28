import { useState } from 'react'
import { addRegistration, MAX_ANGLERS, SHIRT_SIZES } from '../data/registration.js'
import logo from '../assets/logo.png'
import './Tournament.css'

const SECTIONS = ['Home', 'Registration', 'Rules', 'Sponsorship']

const CONTACT_EMAIL = 'Jstelmacki@gmail.com'

const SPONSOR_TIERS = [
  {
    name: 'Title',
    price: '$5,000',
    perks: [
      'Company Name in Official Event Logo',
      '4 Boat Entries - Up to 12 Anglers',
      '50 Raffle Tickets',
      'Company Logo and Website Link on JCHS Fishing Club Website',
      'Company Logo on Leader Board during the John Carroll High School Inshore Summer Slam',
      '2 Social Media Mentions on JCHS Fishing Club Accounts',
      '10x10 Activation Space at the Inshore Summer Slam',
    ],
  },
  {
    name: 'Snook',
    price: '$2,500',
    perks: [
      '1 Captain with Boat/Bait/Gear, 3 Anglers',
      'Company Logo on Event Banner',
      '12 JCHS Fishing Club Tickets',
      'Company Logo and Website Link on JCHS Fishing Club Website',
      'Company Logo on Ribbon Board during the John Carroll High School Inshore Summer Slam',
    ],
  },
  {
    name: 'Redfish',
    price: '$1,000',
    perks: [
      '1 Captain with Boat/Bait/Gear, 3 Anglers',
      'Company Logo on Event Banner',
      '6 JCHS Fishing Club Tickets',
      'Company Logo and Website Link on JCHS Fishing Club Website',
    ],
  },
  {
    name: 'Trout',
    price: '$500',
    perks: ['1 Captain with Boat/Bait/Gear, 3 Anglers', '6 JCHS Fishing Club Tickets'],
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
    <div className="registration-wrap">
      <img className="registration__logo" src={logo} alt="JCHS Fishing Club crest" />
      <form className="registration card" onSubmit={submit}>
      <p className="registration__intro">
        Please register your boat&apos;s anglers below. You can register up to {MAX_ANGLERS}{' '}
        anglers.
      </p>

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

      <button type="submit" className="btn btn-solid" disabled={busy}>
        {busy ? 'Submitting…' : 'Submit Registration'}
      </button>
      </form>
    </div>
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
            <div className="sponsor-card__head">
              <h3>{tier.name}</h3>
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
                `John Carroll High School Inshore Summer Slam Sponsorship — ${tier.name}`,
              )}`}
            >
              Get in Touch
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

function Tournament() {
  const [active, setActive] = useState(SECTIONS[0])

  return (
    <div className="page tournament-page">
      <p className="eyebrow">Compete</p>
      <h1 className="section-title">John Carroll High School Inshore Summer Slam</h1>

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

      {active === 'Registration' && <RegistrationSection />}

      {active === 'Sponsorship' && <SponsorshipSection />}

      {active !== 'Registration' && active !== 'Sponsorship' && (
        <section className="card tournament-tbd">
          <p className="tournament-tbd__label">{active}</p>
          <p className="tournament-tbd__text">Coming Soon</p>
        </section>
      )}
    </div>
  )
}

export default Tournament
