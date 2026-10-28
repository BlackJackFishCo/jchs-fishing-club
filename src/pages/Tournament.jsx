import { useState } from 'react'
import TopoBackground from '../components/TopoBackground.jsx'
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
  computeIndividualBoard,
  topCatch,
  ANGLER_FLAGS,
} from '../data/tournamentLeaderboard.js'
import logo from '../assets/logo.png'
import inshoreSlamLogo from '../assets/inshore-slam-logo.png'
import snookFish from '../assets/sponsor-tier-snook.png'
import redfishFish from '../assets/sponsor-tier-redfish.png'
import troutFish from '../assets/sponsor-tier-trout.png'
import offTheGridLogo from '../assets/sponsor-off-the-grid.png'
import dancoLogo from '../assets/sponsor-danco.png'
import nlbnLogo from '../assets/sponsor-nlbn.png'
import sailfishBrewingLogo from '../assets/sponsor-sailfish-brewing.png'
import './Tournament.css'

const TIER_FISH = {
  Title: logo,
  Snook: snookFish,
  Redfish: redfishFish,
  Trout: troutFish,
}

const SECTIONS = ['Home', 'Registration', 'Rules', 'Awards', 'Sponsorship']

const CONTACT_EMAIL = 'Jstelmacki@gmail.com'
const REGISTRATION_OPEN = true

const SPONSOR_TIERS = [
  {
    name: 'Title',
    price: '$5,000',
    perks: [
      'Recognition at the Event and All Media as "JCHS Inshore Slam Presented By..."',
      '2 Tournament Entries (8 Shirts — 2 Tournament Buckets)',
      'Listed as Top Team Award Presented By...',
      'Company Logo on Event Banners and Shirts, Live Leaderboard',
      'Company Logo on Tournament Website Home Page, Live Leaderboard, and JCHS Fishing Club Website',
      'Company Logo on Tournament Measuring Device',
      'In Person Activation Space at the Inshore Slam Captains Meeting and Awards',
      'Ability to Distribute Marketing Materials and Samples in Tournament Team Buckets',
    ],
  },
  {
    name: 'Snook',
    price: '$3,000',
    perks: [
      '1 Tournament Entry (4 Shirts — 1 Tournament Bucket)',
      '15 Raffle Tickets',
      'Listed as the "Award" Presented By... (Choose Either Individual or Species Category)',
      'Company Logo on Tournament Website Home Page and JCHS Fishing Club Website',
      'Company Logo on Tournament Measuring Device',
      'In Person Activation Space at the Inshore Slam Captains Meeting and Awards',
      'Ability to Distribute Marketing Materials or Samples in Tournament Team Buckets',
    ],
  },
  {
    name: 'Redfish',
    price: '$2,000',
    perks: [
      '1 Tournament Entry (4 Shirts — 1 Tournament Bucket)',
      '10 Raffle Tickets',
      'Company Logo on Event Banners and Shirt',
      'Company Logo on Tournament Website Home Page and JCHS Fishing Club Website',
      'Company Logo on Tournament Measuring Device',
      'In Person Activation Space at the Inshore Slam Captains Meeting and Awards',
      'Ability to Distribute Marketing Materials or Samples in Tournament Team Buckets',
    ],
  },
  {
    name: 'Trout',
    price: '$1,000',
    perks: [
      '1 Tournament Entry (4 Shirts — 1 Tournament Bucket)',
      '5 Raffle Tickets',
      'Company Logo on Event Banners and Shirt',
      'Company Logo on Tournament Website Home Page and JCHS Fishing Club Website',
      'Company Logo on Tournament Measuring Device',
      'In Person Activation Space at the Inshore Slam Captains Meeting and Awards',
      'Ability to Distribute Marketing Materials or Samples in Tournament Team Buckets',
    ],
  },
  {
    name: 'Shirt & Media',
    price: '$500',
    perks: [
      'Company Logo on Event Banners and Shirt',
      'Company Logo on Tournament Website Home Page and JCHS Fishing Club Website',
      'Company Logo on Tournament Measuring Device',
      'In Person Activation Space at the Inshore Slam Captains Meeting and Awards',
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

const WAIVER_CHECKBOX_TEXT =
  'I have read and agree to this Release and Waiver of Liability. I confirm that every Boat ' +
  'Participant named on my registration has read and agreed to it, and that a parent or legal ' +
  'guardian has agreed for any Boat Participant under 18. My checkmark serves as my electronic ' +
  'signature.'

const WAIVER_SECTIONS = [
  {
    heading: 'Release and Waiver',
    body: [
      'For consideration of participation in the John Carroll High School (JCHS) Inshore Slam Fishing Tournament to be held on October 9, 2027 (the "Fishing Tournament"), by checking the box on registration, I, on behalf of myself and every Boat Participant (defined below), waive and release John Carroll High School, its chapters, directors, officers, administrators, representatives and executors, past and present employees, volunteers, agents, supervisors, participants, all city and state governments, assigns, all sponsors, their representatives and successors (collectively, the "Releasees"), from any and all claims, liabilities, or causes of action arising out of an injury to me or anyone participating on my boat, and from any and all claims, liabilities, or causes of action arising from my or their participation in or attendance at this event.',
    ],
  },
  {
    heading: 'Boat Captain Agreement on Behalf of All Persons Aboard',
    body: [
      'By checking the box on registration, the registering Boat Captain represents and agrees that:',
      {
        list: [
          'The Captain has given a copy of this Release to every person who will be aboard the Captain\'s vessel during the Fishing Tournament, up to four (4) participants including the Captain ("Boat Participants").',
          'Each Boat Participant age 18 or older has read this Release and agreed to its terms as a condition of participating.',
          "For each Boat Participant under age 18, the Captain has obtained the agreement of that minor's parent or legal guardian.",
          'The Captain has listed the full legal name of every Boat Participant on the registration form.',
          'The Captain will indemnify and hold harmless the Releasees from any claim brought by or on behalf of any Boat Participant arising from the Fishing Tournament, including any claim that a Boat Participant did not agree to this Release.',
        ],
      },
      'No person may board a participating vessel unless they have agreed to this Release. Every reference to "I," "me," or "my" in this Release applies equally to each Boat Participant.',
    ],
  },
  {
    heading: 'Inherent and Potential Risks',
    body: [
      'I understand that the Fishing Tournament involves strenuous physical activity associated with fishing. I understand that physical activity, by its very nature, carries with it certain inherent risks. I assume all risks associated with participating in the Fishing Tournament relating to the risk of strenuous physical activity. I acknowledge that I may incur minor injuries, major injuries, and catastrophic injuries including paralysis and death.',
      'I assume risks from contact with other participants, negligent or wanton acts of other participants, failure of other participants and non-participants to observe the guidelines of the Fishing Tournament, any defects or conditions of premises (including high or low water levels and rough waters), and the effects of weather including high heat, thunderstorms, lightning, precipitation, cold temperatures, high winds, and/or humidity.',
      'I agree to dress appropriately to reduce the risk of physical injury, including, but not limited to, wearing shoes appropriate for the strenuous physical activity involved in the Fishing Tournament and dressing for the weather. I agree that the Releasees are not responsible for any personal items or property lost or stolen before, during, or after the Fishing Tournament.',
    ],
  },
  {
    heading: 'Medical Evaluation',
    body: [
      'I attest that I am medically and physically able to participate in the Fishing Tournament. If I have any doubt about my ability to safely participate in and/or complete the Fishing Tournament, I take full responsibility for consulting a physician. I attest that, if I am pregnant, disabled in any way, or have recently suffered an illness, injury, or impairment, I should have or did consult a physician before participating.',
      'I consent to emergency medical care and transportation to obtain treatment in the event of injury, as medical professionals may deem appropriate. This Release extends to any liability arising out of or in any way connected with the medical treatment and transportation provided in an emergency, including, but not limited to, negligence in emergency rescue operations.',
    ],
  },
  {
    heading: 'Voluntary Participation',
    body: [
      'I am fully aware of the risks connected with participation in the Fishing Tournament, whether specifically listed in this Release or not, and I voluntarily elect to participate knowing that this participation involves these risks. I understand that participation in the Fishing Tournament carries a minimum fundraising obligation for the benefit of JCHS.',
    ],
  },
  {
    heading: 'Assumption of Risk, Waiver of Liability, Release, and Covenant Not to Sue',
    body: [
      'In consideration for being permitted to participate in the Fishing Tournament, I voluntarily agree for myself, my family, heirs, assigns, executors, and administrators to the following:',
      {
        list: [
          'TO ASSUME FULL RESPONSIBILITY FOR ANY RISKS OF LOSS, OR PERSONAL INJURY, INCLUDING DEATH, that may be sustained by me (or my child), or any loss or damage to property owned by me (or my child), as a result of participating in the Fishing Tournament.',
          'TO RELEASE, WAIVE, HOLD HARMLESS, DISCHARGE, AND COVENANT NOT TO SUE the Releasees from any and all liability, claims, actions, demands, expenses, attorney fees, breach of contract actions, breach of statutory duty or other duty of care, warranty, strict liability actions, and causes of action whatsoever, that I might have or may acquire in the future, arising out of or related to any loss, damage, or injury, including death, that may be sustained by me, or to any property belonging to me, while participating in the Fishing Tournament, including, but not limited to, any claim that the act or omission complained of was in whole or in part caused by the negligence or carelessness of the Releasees.',
        ],
      },
    ],
  },
  {
    heading: 'Acknowledgment and Compliance with Rules',
    body: [
      'I agree to observe and obey all rules and safety procedures that accompany the Fishing Tournament and to abide by any decision of an event official relative to my ability to safely compete in the event. I agree to exhibit appropriate behavior at all times and to obey all laws. JCHS and event officials may dismiss me, without refund, should my behavior endanger the safety of or negatively affect an event, person, facility, or property of any kind.',
      'I understand and agree to stock my vessel with one Coast Guard approved Personal Flotation Device (PFD) per person aboard, including captain and crew, in accordance with Coast Guard regulations. For vessels over sixteen (16) feet long, a throwable PFD (such as a boat cushion or life ring) must be on board.',
    ],
  },
  {
    heading: 'Severability',
    body: [
      'I agree that if any portion of this Release is deemed invalid, the remainder of the Release will still be binding and enforceable.',
    ],
  },
  {
    heading: 'Photography Release',
    body: [
      'I grant full permission to JCHS to use, reuse, reproduce, publish, or republish any photographs, motion pictures, recordings, or any other record of my participation in this event, in any medium now known or hereafter developed, alone or with other material, without restriction as to changes or alterations, and to use my name, voice, likeness, and/or other indicia of identity for editorial, educational, promotional, advertising, and commercial purposes, including without limitation the solicitation of contributions and the furtherance of the corporate objectives of JCHS. I relinquish all rights, title, and interest in any photographs, motion pictures, recordings, or other records of the Fishing Tournament I may take or capture to JCHS.',
    ],
  },
  {
    heading: 'Acknowledgment',
    body: [
      'I acknowledge and represent that I have carefully read and understand all terms of this Release and Waiver of Liability, and, as Boat Captain, that each Boat Participant (or their parent or legal guardian) has done the same.',
    ],
  },
  {
    heading: 'Electronic Acceptance',
    body: [
      'The Boat Participants are the people whose names the Boat Captain entered on the registration form for this boat (up to four, including the Captain).',
    ],
  },
]

function WaiverModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal card waiver-modal" onClick={(e) => e.stopPropagation()}>
        <h3>JCHS Inshore Slam Release and Waiver of Liability</h3>
        {WAIVER_SECTIONS.map((section) => (
          <div key={section.heading} className="waiver-modal__section">
            <h4>{section.heading}</h4>
            {section.body.map((item, i) =>
              typeof item === 'string' ? (
                <p key={i}>{item}</p>
              ) : (
                <ul key={i}>
                  {item.list.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              ),
            )}
          </div>
        ))}
        <div className="modal__actions">
          <button type="button" className="btn btn-solid" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Formats digits as the user types into (XXX) XXX-XXXX, capped at 10 digits.
function formatPhoneNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  const areaCode = digits.slice(0, 3)
  const prefix = digits.slice(3, 6)
  const line = digits.slice(6, 10)

  if (digits.length > 6) return `(${areaCode}) ${prefix}-${line}`
  if (digits.length > 3) return `(${areaCode}) ${prefix}`
  if (digits.length > 0) return `(${areaCode}`
  return ''
}

function RegistrationSection() {
  const [teamName, setTeamName] = useState('')
  const [anglers, setAnglers] = useState(
    Array.from({ length: MAX_ANGLERS }, () => ({ ...EMPTY_ANGLER })),
  )
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [waiverAccepted, setWaiverAccepted] = useState(false)
  const [showWaiver, setShowWaiver] = useState(false)

  const updateAngler = (index, field, value) => {
    setAnglers((prev) => prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!waiverAccepted) return
    setBusy(true)
    setError('')
    try {
      const filled = anglers.filter((a) => a.firstName.trim())
      await addRegistration({ teamName, anglers: filled, waiverAccepted: true })
      setTeamName('')
      setAnglers(Array.from({ length: MAX_ANGLERS }, () => ({ ...EMPTY_ANGLER })))
      setWaiverAccepted(false)
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
      <p className="registration__price">$300.00 per Boat Registration</p>

      <p className="registration__intro">
        Please register your boat&apos;s anglers below. You can register up to {MAX_ANGLERS}{' '}
        anglers.
      </p>

      {!REGISTRATION_OPEN && (
        <p className="registration__notice">Registration opens: August 1, 2027</p>
      )}

      {anglers.map((angler, index) => (
        <fieldset key={index} className="registration__angler">
          <legend>{index === 0 ? 'Angler 1 / Captain' : `Angler ${index + 1}`}</legend>

          {index === 0 && (
            <div className="registration__row">
              <label className="field">
                <span>Team Name*</span>
                <input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </label>
            </div>
          )}

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
                onChange={(e) => updateAngler(index, 'phone', formatPhoneNumber(e.target.value))}
                placeholder="(123) 456-7890"
                maxLength={14}
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
                Junior Angler (13 or Under)
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

          {index === 0 && (
            <label className="registration__checkbox registration__waiver">
              <input
                type="checkbox"
                checked={waiverAccepted}
                onChange={(e) => setWaiverAccepted(e.target.checked)}
                required
              />
              <span>
                {WAIVER_CHECKBOX_TEXT}{' '}
                <button
                  type="button"
                  className="registration__waiver-link"
                  onClick={() => setShowWaiver(true)}
                >
                  Read the full Release and Waiver of Liability
                </button>
                .
              </span>
            </label>
          )}
        </fieldset>
      ))}

      {error && <p className="modal__error">{error}</p>}

      <button
        type="submit"
        className="btn btn-solid"
        disabled={busy || !REGISTRATION_OPEN || !waiverAccepted}
      >
        {busy ? 'Submitting…' : REGISTRATION_OPEN ? 'Submit Registration' : 'Registration Not Open Yet'}
      </button>

      {showWaiver && <WaiverModal onClose={() => setShowWaiver(false)} />}
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
      <div className="tournament-home__body">
        <div className="tournament-home__text">
          <h2 className="tournament-home__heading">Fishing Tournament</h2>
          <p>
            Think you&apos;ve got what it takes to boat the biggest inshore SLAM on the Treasure
            Coast?
          </p>
          <p className="tournament-home__prove">Prove it.</p>
          <p>
            Join us for the John Carroll High School Inshore Slam, a charity inshore fishing
            tournament battling it out for the biggest Snook, Redfish, and Trout. 100% of proceeds
            go to supporting the JCHS fishing club and its volunteer restoration and community
            events — helping the next generation of anglers learn and respect the water, the
            regulations, and the sport we love.
          </p>
          <p>
            Grab your rods, load the boat, and see if you&apos;ve got what it takes to take home
            the title this year.
          </p>
          <p className="tournament-home__proceeds">Let&apos;s go fishing!</p>
        </div>
        <img className="tournament-home__logo" src={inshoreSlamLogo} alt="Inshore Slam logo" />
      </div>
    </section>
  )
}

const RULES_INTRO = [
  'This is a catch-and-release team format tournament up to 4 anglers and does not require that any fish be killed for a team to accumulate points. Please handle all fish with the upmost care for the best survival upon release.',
  'Anglers will target Snook, Redfish, and Trout. Each fish will be measured by its total length with pinched tail. There is no minimum slot size to submit a catch.',
]

const RULES_EQUIPMENT = [
  'Smartphone',
  'A tournament-issued ruler at the captains meeting',
]

const RULES_SECTIONS = [
  {
    title: 'Fishing',
    items: [
      'Lines in, and the start of fishing shall begin at 6am on Saturday, October 9, 2027.',
      'Lines out, there is no lines out time, however all fish must be logged into the JCHS Inshore Slam Tournament Page no later than 4 p.m. on October 9, 2027 to count for tournament. Website will lock at 4pm for submissions.',
      'In the event of tournament site outage it is your teams responsibility to still log your catch on the tournament ruler by picture on your phone. All photos must be text to tournament committee by 4pm October 9, 2027. PH (561-859-7165)',
      'North Boundary ¼ Mile North of Sebastian Inlet 27°51.850’N',
      'South Boundary ¼ Mile South of St. Lucie Inlet 27°09.720’N',
      'No East or West Boundary',
      'All anglers must have a valid Florida Fishing License if required by law.',
      'No drones allowed during fishing tournament hours.',
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
      "Logging a fish under another boat's/team's name is prohibited and will result in your team's automatic disqualification.",
      'Any photo that is altered or AI-assisted in any way will result in your team being disqualified.',
      'Photographs that do not allow the Tournament Director to view the tape measure or entire fish may be excluded at the sole discretion of the Tournament Director.',
      'If a fish or measurement is partially obstructed, the Tournament Director has the sole authority to decide whether to exclude a fish in its entirety or give credit for the visible part of the fish.',
    ],
  },
  {
    title: 'Leader Board',
    items: [
      'Only the top scoring fish will be scored per species.',
      'No rotten, mutilated, or caged fish will be counted.',
      'Any technical difficulties with digital equipment will be dealt with on a case-by-case basis by the Tournament Director. It is your responsibility to get time stamped photos to the director.',
      'In the event of a tie, the winner will be the first to log all of their fish. If there is a tie for the largest of a species, the first fish logged wins.',
      'Cheaters will be disqualified. You and your team will also be banned from all future events. This is a Charity Tournament!',
    ],
  },
  {
    title: 'Weather',
    items: [
      'It is up to the discretion of the registered anglers to determine whether his or her craft is seaworthy for that day’s weather conditions. Participants are encouraged to keep abreast of any marine or weather warnings.',
      'In the case of tournament cancelation and no fish have been logged due to weather, prizes will turn into raffle format with each team in the raffle one time. If Fish have been logged. Winners will be determined by normal rules.',
      'Entry fees are non refundable.',
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
        <ul className="rules-list">
          {RULES_EQUIPMENT.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
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
        </div>
      ))}
    </section>
  )
}

const TOP_TEAM_AWARDS = [
  {
    name: 'First Place Team',
    description:
      "Highest combined inches for your team's largest Snook, Redfish, and Trout — you don't need to catch all three to qualify for this award, just have the highest combined inches total.",
  },
  {
    name: 'Second Place Team',
    description:
      "Second-highest combined inches for your team's largest Snook, Redfish, and Trout — you don't need to catch all three to qualify for this award, just have the highest combined inches total.",
  },
  {
    name: 'Third Place Team',
    description:
      "Third-highest combined inches for your team's largest Snook, Redfish, and Trout — you don't need to catch all three to qualify for this award, just have the highest combined inches total.",
  },
]

const INDIVIDUAL_AWARDS = [
  {
    name: 'Top Junior Angler (Under 13)',
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

const BONUS_AWARDS = [
  {
    name: '40" Club',
    description: 'Awarded to the angler who catches the first 40" or longer Snook.',
  },
  {
    name: '50/50 Mystery Fish Calcutta',
    description:
      '(Snook, Redfish, or Trout) — species selected at the Captains Meeting.',
  },
]

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

      <div className="award-grid award-grid--featured">
        {TOP_TEAM_AWARDS.map((award) => (
          <AwardCard key={award.name} award={award} featured />
        ))}
      </div>

      <h3 className="tournament-awards__group-title">Individual Categories</h3>
      <div className="award-grid award-grid--three">
        {INDIVIDUAL_AWARDS.map((award) => (
          <AwardCard key={award.name} award={award} />
        ))}
      </div>

      <h3 className="tournament-awards__group-title">Species Categories</h3>
      <div className="award-grid award-grid--three">
        {SPECIES_AWARDS.map((award) => (
          <AwardCard key={award.name} award={award} />
        ))}
      </div>

      <h3 className="tournament-awards__group-title">Bonus Awards</h3>
      <div className="award-grid">
        {BONUS_AWARDS.map((award) => (
          <AwardCard key={award.name} award={award} />
        ))}
      </div>
    </section>
  )
}

const EVENT_INFO = [
  { label: 'Registration Opens', value: 'August 1, 2027' },
  { label: 'Registration Ends', value: 'September 26, 2027' },
  {
    label: 'Captains Meeting',
    value: 'October 8, 2027 • 6:00 PM',
    location: 'Sailfish Brewery',
    locationUrl: 'https://sailfishbrewingco.com/',
  },
  { label: 'Lines In', value: 'October 9, 2027 • 6:00 AM' },
  { label: 'All Photos Submitted', value: 'October 9, 2027 • 4:00 PM' },
  {
    label: 'Awards',
    value: 'October 10, 2027 • 12:00 PM',
    location: 'Sailfish Brewery',
    locationUrl: 'https://sailfishbrewingco.com/',
  },
]

function EventInfoRow() {
  return (
    <div className="tournament-info-grid">
      {EVENT_INFO.map((item) => (
        <div key={item.label} className="tournament-info-card">
          <span className="tournament-info-card__label">{item.label}</span>
          <span className="tournament-info-card__value">{item.value}</span>
          {item.location && item.locationUrl ? (
            <a
              href={item.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tournament-info-card__location tournament-info-card__location--link"
            >
              {item.location}
            </a>
          ) : (
            item.location && (
              <span className="tournament-info-card__location">{item.location}</span>
            )
          )}
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
        href="https://sailfishbrewingco.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Sailfish Brewing Company website"
      >
        <img
          className="hero-logos__sponsor"
          src={sailfishBrewingLogo}
          alt="Sailfish Brewing Company logo"
        />
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
  const existingForAngler =
    teamId && species && angler
      ? (catchesByTeam[teamId]?.[species] || []).find((c) => c.angler === angler)
      : null

  const submit = async (e) => {
    e.preventDefault()
    if (!species || !teamId || !angler || !inches || !file || existingForAngler?.verified) return
    if (Math.round(Number(inches) * 2) !== Number(inches) * 2) {
      setError('Length must be in half-inch increments (e.g. 20, 20.5, 21).')
      return
    }
    if (existingForAngler && Number(inches) < existingForAngler.inches) {
      setError(
        `You already have a ${existingForAngler.inches}" logged for this species — you can only replace it with a longer fish.`,
      )
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
                {team.anglers.map((a) => (
                  <label key={a.name} className="catch-angler-picker__option">
                    <input
                      type="radio"
                      name="angler"
                      value={a.name}
                      checked={angler === a.name}
                      onChange={() => setAngler(a.name)}
                    />
                    {a.name}
                  </label>
                ))}
              </fieldset>
            ))}

          {existingForAngler && (
            <p className="modal__note">
              {existingForAngler.verified
                ? `Already verified: ${existingForAngler.angler} — ${existingForAngler.inches}" — this can't be changed.`
                : `Currently on file for ${existingForAngler.angler}: ${existingForAngler.inches}". You can only replace it with a longer fish — a teammate's bigger fish for this species is never affected.`}
            </p>
          )}

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
                busy ||
                !species ||
                !teamId ||
                !angler ||
                !inches ||
                !file ||
                existingForAngler?.verified
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

function CatchCell({ catchData, species, isAdmin, onVerify, onEditInches, onRemove, onZoom, categories }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  if (!catchData) {
    return (
      <div className="catch-cell catch-cell--empty">
        <span className="catch-cell__species-label">{species}</span>—
      </div>
    )
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
      <span className="catch-cell__species-label">{species}</span>
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
      <span className="catch-cell__angler">
        <span className="catch-cell__angler-name">{catchData.angler}</span>
        <span className="catch-cell__categories">
          {categories &&
            categories.map((cat) => (
              <span key={cat} className="catch-cell__category-badge">
                {cat}
              </span>
            ))}
        </span>
      </span>
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

// Individual award categories (Junior/Club/Lady) a given angler qualifies
// for, based on the flags set on their team roster slot.
function categoriesForAngler(anglers, anglerName) {
  const angler = (anglers || []).find((a) => a.name === anglerName)
  if (!angler) return []
  return ANGLER_FLAGS.filter((flag) => angler[flag.key]).map((flag) => flag.label.split(' ')[0])
}

const BOARD_VIEWS = [
  { key: 'teams', label: 'Teams' },
  { key: 'isJunior', label: 'Junior Anglers' },
  { key: 'isClubMember', label: 'Club Members' },
  { key: 'isFemale', label: 'Lady Anglers' },
]

function IndividualBoardTable({
  teams,
  catchesByTeam,
  flagKey,
  emptyLabel,
  isAdmin,
  onVerify,
  onEditInches,
  onRemove,
  onZoom,
}) {
  const rows = computeIndividualBoard(teams, catchesByTeam, flagKey)

  if (rows.length === 0) {
    return <p className="admin-roster__empty">{emptyLabel}</p>
  }

  return (
    <div className="liveboard-scroll">
      <div className="liveboard-table">
        <div className="liveboard-table__row liveboard-table__row--head">
          <span>Rank</span>
          <span>Angler</span>
          <span>Snook</span>
          <span>Redfish</span>
          <span>Trout</span>
          <span>Total</span>
        </div>
        {rows.map((r, i) => (
          <div key={`${r.teamId}-${r.angler}`} className="liveboard-table__row">
            <div className="liveboard-table__row-head">
              <span className="liveboard-table__rank">{i + 1}</span>
              <span className="liveboard-table__team">
                <span className="liveboard-table__angler-name">{r.angler}</span>
                <span className="individual-board__team-name">{r.teamName}</span>
              </span>
            </div>
            <div className="liveboard-table__catches">
              {CATCH_SPECIES.map((species) => {
                const entry = r.speciesCaught.find((s) => s.species === species)
                return (
                  <CatchCell
                    key={species}
                    catchData={entry ? entry.catchData : null}
                    species={species}
                    isAdmin={isAdmin}
                    onVerify={onVerify}
                    onEditInches={onEditInches}
                    onRemove={onRemove}
                    onZoom={onZoom}
                  />
                )
              })}
            </div>
            <span className="liveboard-table__total">{r.total}&quot;</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LiveLeaderboardSection() {
  const { teams, loading: teamsLoading } = useTournamentTeams()
  const { catchesByTeam, loading: catchesLoading } = useTournamentCatches()
  const { user, isAdmin } = useAdminAuth()
  const [showModal, setShowModal] = useState(false)
  const [zoomCatch, setZoomCatch] = useState(null)
  const [boardView, setBoardView] = useState('teams')

  const loading = teamsLoading || catchesLoading
  const admin = user ? { uid: user.uid, email: user.email } : null

  // Teams auto-created from a registration start out unconfirmed and stay
  // off the public leaderboard until an admin reviews and confirms them.
  const confirmedTeams = teams.filter((t) => t.confirmed !== false)

  const ranked = confirmedTeams
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
            Any angler on a team can log a Snook, Redfish, and Trout. Only the team&apos;s biggest
            entry per species shows here and counts toward the team total - logging a smaller
            fish never wipes it out, it just moves that fish to a individual angler category -
            Junior, Club Member, Lady Angler board instead. You can upgrade your own catch at any
            time; time stamp of upgrade will be used for a tie if needed.
          </p>
        </div>
      </div>

      <div className="tournament-liveboard__log-btn-row">
        <button
          type="button"
          className="btn btn-solid tournament-liveboard__log-btn"
          onClick={() => setShowModal(true)}
        >
          Log a Catch
        </button>
      </div>

      <div className="liveboard-view-tabs">
        {BOARD_VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            className={`liveboard-view-tabs__btn ${boardView === v.key ? 'is-active' : ''}`}
            onClick={() => setBoardView(v.key)}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="liveboard-panel">
        {loading ? (
          <p className="species-page__loading">Loading leaderboard…</p>
        ) : confirmedTeams.length === 0 ? (
          <p className="admin-roster__empty">No teams yet. Check back soon.</p>
        ) : boardView === 'teams' ? (
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
                  <div className="liveboard-table__row-head">
                    <span className="liveboard-table__rank">{i + 1}</span>
                    <span className="liveboard-table__team">{team.name}</span>
                  </div>
                  <div className="liveboard-table__catches">
                    {CATCH_SPECIES.map((species) => {
                      const counted = topCatch(team.catches[species])
                      return (
                        <CatchCell
                          key={species}
                          catchData={counted}
                          species={species}
                          isAdmin={isAdmin}
                          onVerify={verify}
                          onEditInches={editInches}
                          onRemove={remove}
                          onZoom={setZoomCatch}
                          categories={counted ? categoriesForAngler(team.anglers, counted.angler) : []}
                        />
                      )
                    })}
                  </div>
                  <span className="liveboard-table__total">{team.total}&quot;</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <IndividualBoardTable
            teams={confirmedTeams}
            catchesByTeam={catchesByTeam}
            flagKey={boardView}
            emptyLabel={`No ${BOARD_VIEWS.find((v) => v.key === boardView).label.toLowerCase()} on a team roster yet.`}
            isAdmin={isAdmin}
            onVerify={verify}
            onEditInches={editInches}
            onRemove={remove}
            onZoom={setZoomCatch}
          />
        )}
      </div>

      {showModal && (
        <LogCatchModal
          teams={confirmedTeams}
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
      <TopoBackground />
      <div className="tournament-page__content">
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
            Inshore Slam Log a Catch & Live Leaderboard
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
    </div>
  )
}

export default Tournament
