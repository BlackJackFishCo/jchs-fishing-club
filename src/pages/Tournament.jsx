import { useState } from 'react'
import { addRegistration, MAX_ANGLERS, SHIRT_SIZES } from '../data/registration.js'
import { useAdminAuth } from '../data/auth.js'
import {
  CATCH_SPECIES,
  useTournamentTeams,
  useTournamentCatches,
  submitCatch,
  setCatchVerified,
  setCatchInches,
  removeCatch,
  computeTeamTotal,
} from '../data/tournamentLeaderboard.js'
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
      'Company Logo on Event Banners and Live Leaderboard',
      'Company Logo and Website Link on JCHS Fishing Club Website',
      '2 Social Media Mentions on JCHS Fishing Club Accounts',
      'In Person Activation Space at the Inshore Slam',
      'Ability to Distribute Marketing Materials or Samples in Tournament Team Buckets',
    ],
  },
  {
    name: 'Snook',
    price: '$2,500',
    perks: [
      '2 Tournament Entries (2 Boats)',
      '15 Raffle Tickets',
      'Company Logo on Event Banner and Live Leaderboard',
      'Company Logo and Website Link on JCHS Fishing Club Website',
      'In Person Activation Space at the Inshore Slam',
      'Ability to Distribute Marketing Materials or Samples in Tournament Team Buckets',
    ],
  },
  {
    name: 'Redfish',
    price: '$1,000',
    perks: [
      '1 Tournament Entry (1 Boat)',
      '10 Raffle Tickets',
      'Company Logo on Event Banners and Leader Board',
      'Company Logo and Website Link on JCHS Fishing Club Website',
      'Ability to Distribute Marketing Materials or Samples in Tournament Team Buckets',
    ],
  },
  {
    name: 'Trout',
    price: '$500',
    perks: [
      '1 Tournament Entry',
      '5 Raffle Tickets',
      'Company Logo and Website Link on JCHS Fishing Club Website',
      'Ability to Distribute Marketing Materials or Samples in Tournament Team Buckets',
    ],
  },
]

const EMPTY_ANGLER = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  shirtSize: '',
  isJunior: false,
  isClubMember: false,
  isFemale: false,
}

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
      <p className="registration__price">$250.00 per Boat Registration</p>

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

          <div className="registration__row">
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

            <div className="field registration__questions">
              <span>Angler Details</span>
              <label className="registration__checkbox">
                <input
                  type="checkbox"
                  checked={angler.isJunior}
                  onChange={(e) => updateAngler(index, 'isJunior', e.target.checked)}
                />
                Junior Angler (16 or Under)
              </label>
              <label className="registration__checkbox">
                <input
                  type="checkbox"
                  checked={angler.isClubMember}
                  onChange={(e) => updateAngler(index, 'isClubMember', e.target.checked)}
                />
                JCHS Fishing Club Member
              </label>
              <label className="registration__checkbox">
                <input
                  type="checkbox"
                  checked={angler.isFemale}
                  onChange={(e) => updateAngler(index, 'isFemale', e.target.checked)}
                />
                Lady Angler
              </label>
            </div>
          </div>
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

const RULES_INTRO = [
  'These rules are subject to the sole interpretation, application, and discretion of the Tournament Director.',
  'This is a catch-and-release team format tournament up to 4 anglers and does not require that any fish be killed for a team to accumulate points. Please handle all fish with the upmost care for the best survival upon release.',
  'Anglers will target Snook, Redfish, and Trout. Each fish will be measured by its Total Length. There is no minimum slot size.',
]

const RULES_EQUIPMENT = [
  'Smartphone',
  'A tournament-issued ruler at the captains meeting',
]

const RULES_SECTIONS = [
  {
    title: 'Fishing',
    items: [
      'Lines in, and the start of fishing shall begin at 6am on Saturday, MONTH 00, 2027.',
      'Lines out, there is no lines out time, however all fish must be logged into the JCHS Inshore Slam Tournament Page no later than 4 p.m. on MONTH 00, 2027 to count for tournament. Website will lock at 4pm for submissions.',
      'In the event of tournament site outage it is your teams responsibility to still log your catch on the tournament ruler by picture on your phone followed by a screen shot of the time. All photos must be text to tournament committee by 4pm MONTH 00.2027.',
      'North Boundary ¼ Mile North of Sebastian Inlet 27°51.850’N',
      'South Boundary ¼ Mile South of St. Lucie Inlet 27°09.720’N',
      'No East or West Boundary',
      'All anglers must have a valid Florida Fishing License.',
      'Same angler must hook, fight and bring fish up to point of landing from the boat. No passing the rod. No wade fishing.',
      'Maximum 4 rods fishing at any time.',
      'All anglers must abide by all local, State, and Federal Rules and licensing restrictions on fishing for game fish with hook and line.',
      'Anglers may use live, dead, and artificial bait.',
      'Live chumming is allowed.',
      'No fishing is allowed in an active marina or boat ramp.',
    ],
  },
  {
    title: 'Fish Photos',
    items: [
      'No slot size is required for photo submission.',
      'Figure 1: Correct Measurement for Fish in Boat (Measuring Device on Boat Deck NOT ON FISH).',
      'Photographs that do not allow the Tournament Director to view the tape measure or entire fish may be excluded at the sole discretion of the Tournament Director.',
      'If a fish or measurement is partially obstructed, the Tournament Director has the sole authority to decide whether to exclude a fish in its entirety or give credit for the visible part of the fish.',
    ],
    photoPlaceholders: 2,
  },
  {
    title: 'Leader Board',
    items: [
      'Teams (including individual anglers) can only win one award category. Example: If your team wins Top Team, no one on your team can also win Top Snook or Top Lady Angler.',
      'Only the top scoring fish will be scored per species.',
      'No rotten or mutilated fish will be counted.',
      'Any technical difficulties with digital equipment will be dealt with on a case-by-case basis by the Tournament Director and Rules Committee.',
      'In the event of a tie, the winner will be the first to log all of their fish. If there is a tie for the largest of a species, the first fish logged wins.',
      'Cheaters will be disqualified. You and your team will also be banned from all future events. This is a Charity Tournament!',
    ],
  },
  {
    title: 'Weather',
    items: [
      'It is up to the discretion of the registered anglers to determine whether his or her craft is seaworthy for that day’s weather conditions. Participants are encouraged to keep abreast of any marine or weather warnings.',
      'In the case of tournament cancelation and no fish have been logged due to weather, prizes will turn into raffle format with each team in the raffle one time. If Fish have been logged. Winners will be determined at 4pm MONTH 00. 2027.',
      'No refund of entry fees.',
    ],
  },
]

function RulesSubsection({ subsection }) {
  return (
    <div className="rules-subsection">
      <h4 className="rules-subsection__title">{subsection.title}</h4>
      <ul className="rules-list">
        {subsection.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {subsection.callout && <p className="rules-callout">{subsection.callout}</p>}
    </div>
  )
}

function RulesSection() {
  return (
    <section className="card tournament-awards tournament-rules">
      <h2 className="tournament-awards__heading">Rules</h2>

      {RULES_INTRO.map((paragraph) => (
        <p key={paragraph} className="tournament-awards__rule">
          {paragraph}
        </p>
      ))}

      <div className="rules-equipment">
        <h3 className="tournament-awards__group-title">Each Team Must Be Equipped With</h3>
        <ol className="rules-list rules-list--numbered">
          {RULES_EQUIPMENT.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>

      {RULES_SECTIONS.map((section) => (
        <div key={section.title} className="rules-section">
          <h3 className="tournament-awards__group-title">{section.title}</h3>
          {section.callout && <p className="rules-callout">{section.callout}</p>}
          {section.items && (
            <ul className="rules-list">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {section.subsections?.map((subsection) => (
            <RulesSubsection key={subsection.title} subsection={subsection} />
          ))}
          {section.photoPlaceholders > 0 && (
            <div className="rules-photo-grid">
              {Array.from({ length: section.photoPlaceholders }).map((_, i) => (
                <AwardPhotoPlaceholder key={i} />
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  )
}

const TOP_TEAM_AWARD = {
  name: 'Top Team',
  description:
    "Highest combined inches for your team's largest Snook, Redfish, and Trout — you don't need to catch all three species, just have the highest combined inches total.",
}

const INDIVIDUAL_AWARDS = [
  {
    name: 'Top Junior Angler (Under 16)',
    description:
      "Individual Award — Highest combined inches for the Junior Angler's largest Snook, Redfish, and Trout. You do not need to catch all three to qualify for this award.",
  },
  {
    name: 'Top JCHS Fishing Club Member',
    description:
      "Individual Award — Highest combined inches for the JCHS Fishing Club Member's largest Snook, Redfish, and Trout. You do not need to catch all three to qualify for this award.",
  },
  {
    name: 'Top Lady Angler',
    description:
      "Individual Award — Highest combined inches for this Lady Angler's largest Snook, Redfish, and Trout. You do not need to catch all three to qualify for this award.",
  },
]

const SPECIES_AWARDS = [
  { name: 'Top Snook', description: 'Longest single Snook.' },
  { name: 'Top Redfish', description: 'Longest single Redfish.' },
  { name: 'Top Trout', description: 'Longest single Trout.' },
]

const BONUS_AWARD = {
  name: '40" Club',
  description: 'Awarded to each angler who catches a 40" or longer Snook.',
}

function AwardPhotoPlaceholder({ featured }) {
  return (
    <div
      className={`award-photo-placeholder ${featured ? 'award-photo-placeholder--featured' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64">
        <rect x="8" y="18" width="48" height="34" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M20 18l3.5-5h17l3.5 5" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="32" cy="35" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </svg>
      <span>Photo Coming Soon</span>
    </div>
  )
}

function AwardCard({ award, featured }) {
  return (
    <div className={`award-card ${featured ? 'award-card--featured' : ''}`}>
      <AwardPhotoPlaceholder featured={featured} />
      <div className="award-card__body">
        <h4 className="award-card__title">{award.name}</h4>
        <p className="award-card__desc">{award.description}</p>
      </div>
    </div>
  )
}

function AwardsSection() {
  return (
    <section className="card tournament-awards">
      <h2 className="tournament-awards__heading">Awards</h2>
      <p className="tournament-awards__rule">
        Teams (including individual anglers) can only win one award category.
      </p>
      <p className="tournament-awards__example">
        Example: If your team wins Top Team, no one on your team can also win Top Snook or Top
        Lady Angler.
      </p>

      <div className="award-grid award-grid--featured">
        <AwardCard award={TOP_TEAM_AWARD} featured />
      </div>

      <h3 className="tournament-awards__group-title">Individual Categories</h3>
      <div className="award-grid">
        {INDIVIDUAL_AWARDS.map((award) => (
          <AwardCard key={award.name} award={award} />
        ))}
      </div>

      <h3 className="tournament-awards__group-title">Species Categories</h3>
      <div className="award-grid">
        {SPECIES_AWARDS.map((award) => (
          <AwardCard key={award.name} award={award} />
        ))}
      </div>

      <h3 className="tournament-awards__group-title">Bonus Award</h3>
      <div className="award-grid award-grid--single">
        <AwardCard award={BONUS_AWARD} />
      </div>
    </section>
  )
}

const EVENT_INFO = [
  { label: 'Registration Ends', value: '00/2027' },
  { label: 'Captains Meeting', value: '0:00pm 00/2027' },
  { label: 'Lines In', value: '0:00am 00/2027' },
  { label: 'All Photos Submitted', value: '0:00pm 00/2027' },
  { label: 'Awards', value: '0:00pm 00/2027' },
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

function LogCatchModal({ teams, catchesByTeam, onClose }) {
  const [species, setSpecies] = useState('')
  const [teamId, setTeamId] = useState('')
  const [angler, setAngler] = useState('')
  const [inches, setInches] = useState('')
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const team = teams.find((t) => t.id === teamId)
  const existing = teamId ? catchesByTeam[teamId]?.[species] : null

  const submit = async (e) => {
    e.preventDefault()
    if (!species || !teamId || !angler || !inches || !file || existing?.verified) return
    if (Math.round(Number(inches) * 2) !== Number(inches) * 2) {
      setError('Length must be in half-inch increments (e.g. 20, 20.5, 21).')
      return
    }
    setBusy(true)
    setError('')
    try {
      await submitCatch({ teamId, species, angler, inches: Number(inches), file })
      onClose()
    } catch (err) {
      setError(err.message || 'Could not submit catch. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal card" onClick={(e) => e.stopPropagation()}>
        <h3>Log a Catch</h3>

        <form className="modal__add-form" onSubmit={submit}>
          <div className="field">
            <span>Species</span>
            <div className="catch-species-toggle">
              {CATCH_SPECIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`catch-species-toggle__btn ${species === s ? 'is-active' : ''}`}
                  onClick={() => setSpecies(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <label className="field">
            <span>Team</span>
            <select
              value={teamId}
              onChange={(e) => {
                setTeamId(e.target.value)
                setAngler('')
              }}
              required
            >
              <option value="" disabled>
                Select your team
              </option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>

          {team &&
            (team.anglers.length === 0 ? (
              <p className="modal__note">
                This team has no anglers yet. Ask a club admin to add them.
              </p>
            ) : (
              <fieldset className="catch-angler-picker">
                <legend>Angler</legend>
                {team.anglers.map((name) => (
                  <label key={name} className="catch-angler-picker__option">
                    <input
                      type="radio"
                      name="angler"
                      value={name}
                      checked={angler === name}
                      onChange={() => setAngler(name)}
                    />
                    {name}
                  </label>
                ))}
              </fieldset>
            ))}

          {existing && (
            <p className="modal__note">
              {existing.verified
                ? `Already verified: ${existing.angler} — ${existing.inches}" — this can't be changed.`
                : `Currently on file: ${existing.angler} — ${existing.inches}". Submitting will replace it.`}
            </p>
          )}

          <label className="field">
            <span>Length (inches)</span>
            <input
              type="number"
              min="1"
              step="0.5"
              value={inches}
              onChange={(e) => setInches(e.target.value)}
              required
            />
            <span className="field__hint">
              Measured to the closest ½ inch — e.g. 20, 20.5, or 30.
            </span>
          </label>

          <label className="field">
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </label>

          {error && <p className="modal__error">{error}</p>}

          <div className="modal__actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-solid"
              disabled={
                busy || !species || !teamId || !angler || !inches || !file || existing?.verified
              }
            >
              {busy ? 'Submitting…' : 'Submit Catch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function formatCatchTimestamp(submittedAt) {
  if (!submittedAt?.toDate) return null
  return submittedAt.toDate().toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function PhotoLightbox({ catchData, onClose }) {
  return (
    <div className="modal-backdrop photo-lightbox" onClick={onClose}>
      <div className="photo-lightbox__inner" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="photo-lightbox__close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <img
          className="photo-lightbox__img"
          src={catchData.photo}
          alt={`${catchData.species} catch`}
        />
        <p className="photo-lightbox__caption">
          {catchData.species} — {catchData.inches}&quot; — {catchData.angler}
        </p>
      </div>
    </div>
  )
}

function CatchCell({ catchData, isAdmin, onVerify, onEditInches, onRemove, onZoom }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  if (!catchData) {
    return <div className="catch-cell catch-cell--empty">—</div>
  }

  const timestamp = formatCatchTimestamp(catchData.submittedAt)

  const startEdit = () => {
    setDraft(String(catchData.inches))
    setEditing(true)
  }

  const saveEdit = () => {
    const value = Number(draft)
    if (!draft || Number.isNaN(value) || value <= 0 || Math.round(value * 2) !== value * 2) {
      window.alert('Length must be a number in half-inch increments (e.g. 20, 20.5, 21).')
      return
    }
    onEditInches(catchData, value)
    setEditing(false)
  }

  return (
    <div className="catch-cell">
      <button
        type="button"
        className="catch-cell__photo-btn"
        onClick={() => onZoom(catchData)}
        aria-label={`Zoom in on ${catchData.species} catch photo`}
      >
        <img className="catch-cell__photo" src={catchData.photo} alt={`${catchData.species} catch`} />
      </button>
      <span className="catch-cell__inches">
        {editing ? (
          <input
            type="number"
            step="0.5"
            min="1"
            className="catch-cell__inches-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
        ) : (
          <>
            {catchData.inches}&quot;
            {catchData.verified && (
              <span className="catch-cell__check" title="Verified by admin">
                ✓
              </span>
            )}
          </>
        )}
      </span>
      <span className="catch-cell__angler">{catchData.angler}</span>
      {timestamp && <span className="catch-cell__time">{timestamp}</span>}
      {isAdmin && (
        <div className="catch-cell__admin">
          {editing ? (
            <>
              <button type="button" onClick={saveEdit}>
                Save
              </button>
              <button type="button" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={startEdit}>
                Edit
              </button>
              <button type="button" onClick={() => onVerify(catchData, !catchData.verified)}>
                {catchData.verified ? 'Unverify' : 'Verify'}
              </button>
              <button type="button" onClick={() => onRemove(catchData)}>
                Remove
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function LiveLeaderboardSection() {
  const { teams, loading: teamsLoading } = useTournamentTeams()
  const { catchesByTeam, loading: catchesLoading } = useTournamentCatches()
  const { user, isAdmin } = useAdminAuth()
  const [showModal, setShowModal] = useState(false)
  const [zoomCatch, setZoomCatch] = useState(null)

  const loading = teamsLoading || catchesLoading
  const admin = user ? { uid: user.uid, email: user.email } : null

  const ranked = teams
    .map((team) => ({
      ...team,
      catches: catchesByTeam[team.id] || {},
      total: computeTeamTotal(catchesByTeam[team.id]),
    }))
    .sort((a, b) => b.total - a.total)

  const verify = (catchData, verified) => {
    setCatchVerified(catchData, verified, admin).catch(() => {})
  }

  const editInches = (catchData, inches) => {
    setCatchInches(catchData, inches, admin).catch(() => {})
  }

  const remove = (catchData) => {
    if (window.confirm("Remove this catch? You can restore it later from the Admin page.")) {
      removeCatch(catchData, admin).catch(() => {})
    }
  }

  return (
    <section className="card tournament-liveboard">
      <div className="tournament-liveboard__head">
        <div>
          <h2 className="tournament-awards__heading">Inshore Slam Live Leaderboard</h2>
          <p className="tournament-awards__rule">
            Each team can log one Snook, one Redfish, and one Trout. A team&apos;s total is the
            combined inches of all three. You can upgrade at anytime but time stamp of upgrade
            will be used for a tie if needed.
          </p>
        </div>
        <button type="button" className="btn btn-solid" onClick={() => setShowModal(true)}>
          Log a Catch
        </button>
      </div>

      {loading ? (
        <p className="species-page__loading">Loading leaderboard…</p>
      ) : teams.length === 0 ? (
        <p className="admin-roster__empty">No teams yet. Check back soon.</p>
      ) : (
        <div className="liveboard-scroll">
          <div className="liveboard-table">
            <div className="liveboard-table__row liveboard-table__row--head">
              <span>Rank</span>
              <span>Team</span>
              <span>Snook</span>
              <span>Redfish</span>
              <span>Trout</span>
              <span>Total</span>
            </div>
            {ranked.map((team, i) => (
              <div key={team.id} className="liveboard-table__row">
                <span className="liveboard-table__rank">{i + 1}</span>
                <span className="liveboard-table__team">{team.name}</span>
                <CatchCell
                  catchData={team.catches.Snook}
                  isAdmin={isAdmin}
                  onVerify={verify}
                  onEditInches={editInches}
                  onRemove={remove}
                  onZoom={setZoomCatch}
                />
                <CatchCell
                  catchData={team.catches.Redfish}
                  isAdmin={isAdmin}
                  onVerify={verify}
                  onEditInches={editInches}
                  onRemove={remove}
                  onZoom={setZoomCatch}
                />
                <CatchCell
                  catchData={team.catches.Trout}
                  isAdmin={isAdmin}
                  onVerify={verify}
                  onEditInches={editInches}
                  onRemove={remove}
                  onZoom={setZoomCatch}
                />
                <span className="liveboard-table__total">{team.total}&quot;</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <LogCatchModal
          teams={teams}
          catchesByTeam={catchesByTeam}
          onClose={() => setShowModal(false)}
        />
      )}

      {zoomCatch && <PhotoLightbox catchData={zoomCatch} onClose={() => setZoomCatch(null)} />}
    </section>
  )
}

function Tournament() {
  const [active, setActive] = useState(SECTIONS[0])

  return (
    <div className="page tournament-page">
      <p className="eyebrow">Compete</p>
      <h1 className="section-title">John Carroll High School Inshore Slam</h1>

      <div className="tournament-tabs-row">
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

        <button
          type="button"
          className="btn btn-solid tournament-live-leaderboard"
          onClick={() => setActive('Inshore Slam Live Leaderboard')}
        >
          Inshore Slam Live Leaderboard
        </button>
      </div>

      {active === 'Home' && (
        <>
          <HomeSection />
          <EventInfoRow />
          <HeroLogos />
        </>
      )}

      {active === 'Registration' && <RegistrationSection />}

      {active === 'Rules' && <RulesSection />}

      {active === 'Awards' && <AwardsSection />}

      {active === 'Inshore Slam Live Leaderboard' && <LiveLeaderboardSection />}

      {active === 'Sponsorship' && <SponsorshipSection />}

      {active !== 'Home' &&
        active !== 'Registration' &&
        active !== 'Rules' &&
        active !== 'Awards' &&
        active !== 'Inshore Slam Live Leaderboard' &&
        active !== 'Sponsorship' && (
        <section className="card tournament-tbd">
          <p className="tournament-tbd__label">{active}</p>
          <p className="tournament-tbd__text">Coming Soon</p>
        </section>
      )}
    </div>
  )
}

export default Tournament
