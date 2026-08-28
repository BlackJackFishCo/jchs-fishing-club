import { useState } from 'react'
import './Tournament.css'

const SECTIONS = ['Registration', 'Rules', 'Sponsorship']

const CONTACT_EMAIL = 'Jstelmacki@gmail.com'

const SPONSOR_TIERS = [
  {
    name: 'Title',
    price: '$15,000',
    perks: [
      'Company Name in Official Event Logo',
      '4 Captains with Boats/Bait/Gear, 12 Anglers',
      '48 JCHS Fishing Club Tickets',
      'Company Logo and Website Link on JCHS Fishing Club Website',
      'Company Logo on Ribbon Board during the JCHS Fishing Club Tournament',
      '2 Social Media Mentions on JCHS Fishing Club Accounts',
      '10x10 Activation Space at the Fishing Tournament',
      '1 Feature in the JCHS Fishing Club Newsletter',
    ],
  },
  {
    name: 'Slam',
    price: '$10,000',
    perks: [
      '1 Captain with Boat/Bait/Gear, 3 Anglers',
      'Company Logo on Event Banner',
      '12 JCHS Fishing Club Tickets',
      'Company Logo and Website Link on JCHS Fishing Club Website',
      'Company Logo on Ribbon Board during the JCHS Fishing Club Tournament',
      '1 Social Media Mention on JCHS Fishing Club Accounts',
      '10x10 Activation Space at the Fishing Tournament',
    ],
  },
  {
    name: 'Snook',
    price: '$7,500',
    perks: [
      '1 Captain with Boat/Bait/Gear, 3 Anglers',
      'Company Logo on Event Banner',
      '12 JCHS Fishing Club Tickets',
      'Company Logo and Website Link on JCHS Fishing Club Website',
      'Company Logo on Ribbon Board during the JCHS Fishing Club Tournament',
    ],
  },
  {
    name: 'Redfish',
    price: '$5,000',
    perks: [
      '1 Captain with Boat/Bait/Gear, 3 Anglers',
      'Company Logo on Event Banner',
      '6 JCHS Fishing Club Tickets',
      'Company Logo and Website Link on JCHS Fishing Club Website',
    ],
  },
  {
    name: 'Trout',
    price: '$2,500',
    perks: ['1 Captain with Boat/Bait/Gear, 3 Anglers', '6 JCHS Fishing Club Tickets'],
  },
  {
    name: 'Angler',
    price: '$1,500',
    perks: ['1 Captain w/ Boat/Bait/Gear, 3 Anglers'],
  },
]

function SponsorshipSection() {
  return (
    <div className="sponsorship">
      <p className="sponsorship__intro">
        All participants will receive a gift bag, including an event shirt and other goodies. We
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
                `JCHS Fishing Club Tournament Sponsorship — ${tier.name}`,
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
      <h1 className="section-title">JCHS Fishing Tournament</h1>

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

      {active === 'Sponsorship' ? (
        <SponsorshipSection />
      ) : (
        <section className="card tournament-tbd">
          <p className="tournament-tbd__label">{active}</p>
          <p className="tournament-tbd__text">Coming Soon</p>
        </section>
      )}
    </div>
  )
}

export default Tournament
