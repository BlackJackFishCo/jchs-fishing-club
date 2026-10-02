import { useState } from 'react'
import { addClinicWaiver, CLINIC_CAPACITY, useClinicSpotCount } from '../data/clinic.js'
import './Volunteer.css'
import './Clinic.css'

const EMPTY_FORM = {
  participantName: '',
  participantAge: '',
  parentName: '',
  parentEmail: '',
  parentPhone: '',
  signature: '',
}

function ClinicSpotsBadge({ count, isFull }) {
  return (
    <span className={`clinic-spots-badge${isFull ? ' clinic-spots-badge--full' : ''}`}>
      {isFull ? 'Registration Full' : `${count} of ${CLINIC_CAPACITY} spots available`}
    </span>
  )
}

function ClinicWaiverForm() {
  const { count, loading: spotsLoading } = useClinicSpotCount()
  const isFull = count >= CLINIC_CAPACITY
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [agreed, setAgreed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!agreed) {
      setError('Please read and agree to the waiver before submitting.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await addClinicWaiver({ ...form, agreedToWaiver: true })
      setForm({ ...EMPTY_FORM })
      setAgreed(false)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Could not submit this form. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (success) {
    return (
      <section className="card clinic-success">
        <p className="clinic-success__text">
          Thank you! The waiver and registration for {form.participantName || 'your angler'} has
          been submitted.
        </p>
        <button type="button" className="btn" onClick={() => setSuccess(false)}>
          Submit Another Waiver
        </button>
      </section>
    )
  }

  if (!spotsLoading && isFull) {
    return (
      <section className="card clinic-form">
        <div className="clinic-form__head">
          <h2>Clinic Waiver &amp; Registration</h2>
          <ClinicSpotsBadge count={count} isFull={isFull} />
        </div>
        <p className="clinic-form__intro">
          This clinic is full. Check back here in case a spot opens up, or contact the club for
          waitlist information.
        </p>
      </section>
    )
  }

  return (
    <form className="card clinic-form" onSubmit={submit}>
      <div className="clinic-form__head">
        <h2>Clinic Waiver &amp; Registration</h2>
        <ClinicSpotsBadge count={count} isFull={isFull} />
      </div>
      <p className="clinic-form__intro">
        One form per participant. If you&apos;re registering more than one child, please submit
        this form again for each one.
      </p>

      <fieldset className="clinic-form__fieldset">
        <legend>Participant</legend>
        <div className="clinic-form__row">
          <label className="field">
            <span>Participant Full Name*</span>
            <input
              value={form.participantName}
              onChange={(e) => update('participantName', e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Participant Age*</span>
            <input
              value={form.participantAge}
              onChange={(e) => update('participantAge', e.target.value)}
              required
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="clinic-form__fieldset">
        <legend>Parent / Guardian</legend>
        <div className="clinic-form__row">
          <label className="field">
            <span>Parent/Guardian Full Name*</span>
            <input
              value={form.parentName}
              onChange={(e) => update('parentName', e.target.value)}
              required
            />
          </label>
        </div>
        <div className="clinic-form__row">
          <label className="field">
            <span>Email*</span>
            <input
              type="email"
              value={form.parentEmail}
              onChange={(e) => update('parentEmail', e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Phone Number*</span>
            <input
              type="tel"
              value={form.parentPhone}
              onChange={(e) => update('parentPhone', e.target.value)}
              required
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="clinic-form__fieldset">
        <legend>Liability Waiver &amp; Release</legend>
        <div className="clinic-form__waiver-text">
          <p className="clinic-form__waiver-caps">
            <strong>NOTICE TO THE MINOR CHILD&apos;S NATURAL GUARDIAN</strong>
            <br />
            READ THIS FORM COMPLETELY AND CAREFULLY. YOU ARE AGREEING TO LET YOUR MINOR CHILD
            ENGAGE IN A POTENTIALLY DANGEROUS ACTIVITY. YOU ARE AGREEING THAT, EVEN IF JOHN
            CARROLL CATHOLIC HIGH SCHOOL, THE JOHN CARROLL HIGH SCHOOL FISHING CLUB, AND THEIR
            AFFILIATES, SPONSORS, AND VOLUNTEERS USE REASONABLE CARE IN PROVIDING THIS ACTIVITY,
            THERE IS A CHANCE YOUR CHILD MAY BE SERIOUSLY INJURED OR KILLED BY PARTICIPATING IN
            THIS ACTIVITY BECAUSE THERE ARE CERTAIN DANGERS INHERENT IN THE ACTIVITY WHICH CANNOT
            BE AVOIDED OR ELIMINATED. BY SIGNING THIS FORM YOU ARE GIVING UP YOUR CHILD&apos;S
            RIGHT AND YOUR RIGHT TO RECOVER FROM JOHN CARROLL CATHOLIC HIGH SCHOOL, THE JOHN
            CARROLL HIGH SCHOOL FISHING CLUB, AND THEIR AFFILIATES, SPONSORS, AND VOLUNTEERS IN A
            LAWSUIT FOR ANY PERSONAL INJURY, INCLUDING DEATH, TO YOUR CHILD OR ANY PROPERTY DAMAGE
            THAT RESULTS FROM THE RISKS THAT ARE A NATURAL PART OF THE ACTIVITY. YOU HAVE THE
            RIGHT TO REFUSE TO SIGN THIS FORM, AND JOHN CARROLL CATHOLIC HIGH SCHOOL, THE JOHN
            CARROLL HIGH SCHOOL FISHING CLUB, AND THEIR AFFILIATES, SPONSORS, AND VOLUNTEERS HAVE
            THE RIGHT TO REFUSE TO LET YOUR CHILD PARTICIPATE IF YOU DO NOT SIGN THIS FORM.
          </p>

          <h3>Released Parties</h3>
          <p>
            In this waiver, &quot;Released Parties&quot; means John Carroll Catholic High School,
            the John Carroll High School Fishing Club, the Diocese of Palm Beach, and each of
            their affiliates, officers, directors, administrators, faculty, staff, coaches, club
            advisors, sponsors, donors, event partners, volunteers, agents, and representatives.
          </p>

          <h3>1. Voluntary Participation</h3>
          <p>
            I am the parent or legal guardian of the participant named above. I voluntarily give
            permission for my child to take part in the First Annual John Carroll Fishing Clinic
            and all related activities, including instruction, demonstrations, casting, fishing
            from shore, docks, piers, jetties, or boats, travel between locations, and any other
            clinic activities (the &quot;Activity&quot;).
          </p>

          <h3>2. Inherent Risks of Fishing</h3>
          <p>
            I understand that fishing and activities on or near the water always carry inherent
            risks that cannot be fully eliminated, even when everyone uses reasonable care. These
            risks include, but are not limited to:
          </p>
          <ul>
            <li>Hooks, lures, knives, gaffs, and other sharp tackle causing cuts, punctures, or eye injuries</li>
            <li>
              Injuries from fish, including spines, teeth, fins, and gill plates, and contact with
              jellyfish, stingrays, or other marine life
            </li>
            <li>
              Slips, trips, and falls on wet, uneven, or slippery surfaces such as docks, piers,
              rocks, jetties, seawalls, boat decks, and shorelines
            </li>
            <li>Falling into the water, strong currents, waves, boat wakes, and drowning</li>
            <li>Sun exposure, sunburn, heat exhaustion, heat stroke, and dehydration</li>
            <li>Sudden weather changes, including lightning, storms, wind, and rough water</li>
            <li>Insect bites and stings, and allergic reactions</li>
            <li>Boat, vehicle, and foot traffic near fishing areas</li>
            <li>Errors in casting or handling equipment by my child or other participants</li>
            <li>Negligent or intentional acts of other participants</li>
            <li>The distance of some locations from emergency medical services</li>
          </ul>

          <h3>3. Assumption of Risk</h3>
          <p>
            I understand and accept these risks on behalf of my child and myself. I knowingly and
            voluntarily assume all risks of injury, illness, death, and property damage to my
            child arising from the Activity, whether those risks are known or unknown.
          </p>

          <h3>4. Waiver and Release of Liability</h3>
          <p>
            To the fullest extent permitted by Florida law, I, on behalf of myself, my child, and
            our heirs, executors, and assigns, waive, release, and forever discharge the Released
            Parties from any and all claims, demands, losses, and causes of action for personal
            injury, including death, illness, or property damage arising from or related to my
            child&apos;s participation in the Activity, including claims resulting from the
            inherent risks of the Activity and, to the extent permitted by law, claims resulting
            from the ordinary negligence of the Released Parties.
          </p>

          <h3>5. Indemnification</h3>
          <p>
            To the fullest extent permitted by law, I agree to indemnify and hold harmless the
            Released Parties from any claims, costs, or expenses, including attorney&apos;s fees,
            brought by or on behalf of my child or any other person arising from my child&apos;s
            participation in the Activity.
          </p>

          <h3>6. Rules, Supervision, and Safety</h3>
          <p>
            I agree that my child will follow all rules and instructions given by clinic staff and
            volunteers, including wearing a life jacket (PFD) when instructed. I understand that
            clinic leaders may remove my child from the Activity for unsafe behavior or failure to
            follow instructions. I confirm that my child is physically able to participate.
          </p>

          <h3>7. Photo and Media Release</h3>
          <p>
            I grant permission for photos and video of my child taken during the clinic to be used
            by John Carroll Catholic High School, the Fishing Club, and event sponsors for
            newsletters, websites, and social media, without compensation. This authorization is a
            required condition of participating in the clinic.
          </p>

          <h3>8. General Terms</h3>
          <p>
            This waiver is governed by the laws of the State of Florida. If any part of this
            waiver is found invalid or unenforceable, the remaining parts will stay in full force
            and effect. This waiver covers the clinic date listed above and any rescheduled date.
          </p>
        </div>
        <label className="clinic-form__checkbox">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          I am the parent or legal guardian of the participant named above, and I have read and
          agree to the Waiver and Release of Liability stated above.*
        </label>
        <div className="clinic-form__row">
          <label className="field clinic-form__full-width">
            <span>Type Your Full Legal Name as Your Electronic Signature*</span>
            <input
              value={form.signature}
              onChange={(e) => update('signature', e.target.value)}
              required
            />
          </label>
        </div>
      </fieldset>

      {error && <p className="modal__error">{error}</p>}

      <button type="submit" className="btn btn-solid" disabled={busy}>
        {busy ? 'Submitting…' : 'Submit Waiver & Registration'}
      </button>
    </form>
  )
}

function Clinic() {
  return (
    <div className="page volunteer-page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Community Outreach</p>
          <h1 className="section-title">Fishing Clinic</h1>
          <p className="volunteer-page__intro">
            The John Carroll High School Fishing Club hosts an annual, hands-on fishing clinic for
            local youth. Club members mentor younger students and community kids on casting,
            knot-tying, and basic tackle &mdash; no experience necessary.
          </p>
        </div>
      </div>

      <section className="card clinic-details">
        <h2>Clinic Details</h2>
        <ul className="clinic-details__list">
          <li>
            <strong>Date &amp; Location:</strong> TBD &mdash; check back here as details are
            confirmed.
          </li>
          <li>
            <strong>Who:</strong> Ages 13 and under.
          </li>
          <li>
            <strong>Parent/Guardian:</strong> A parent or guardian must attend and remain at the
            event with their child the entire time.
          </li>
          <li>
            <strong>Cost:</strong> TBD
          </li>
          <li>
            <strong>What to Bring:</strong> Sunscreen, a hat, closed-toe shoes, and a water bottle.
          </li>
        </ul>
      </section>

      <ClinicWaiverForm />
    </div>
  )
}

export default Clinic
