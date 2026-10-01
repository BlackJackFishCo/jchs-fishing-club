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
  emergencyName: '',
  emergencyPhone: '',
  medicalNotes: '',
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
        <legend>Emergency Contact</legend>
        <div className="clinic-form__row">
          <label className="field">
            <span>Emergency Contact Name*</span>
            <input
              value={form.emergencyName}
              onChange={(e) => update('emergencyName', e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Emergency Contact Phone*</span>
            <input
              type="tel"
              value={form.emergencyPhone}
              onChange={(e) => update('emergencyPhone', e.target.value)}
              required
            />
          </label>
        </div>
        <div className="clinic-form__row">
          <label className="field clinic-form__full-width">
            <span>Medical Conditions / Allergies We Should Know About</span>
            <textarea
              value={form.medicalNotes}
              onChange={(e) => update('medicalNotes', e.target.value)}
              rows={3}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="clinic-form__fieldset">
        <legend>Liability Waiver &amp; Release</legend>
        <div className="clinic-form__waiver-text">
          <p>
            <strong>[PLACEHOLDER — NOT FINAL LEGAL LANGUAGE]</strong> This section must be
            replaced with official liability waiver and release language reviewed and approved by
            John Carroll High School administration, legal counsel, and the school&apos;s
            insurance carrier before this form is used for an actual clinic. Do not rely on this
            placeholder text for a real event.
          </p>
        </div>
        <label className="clinic-form__checkbox">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          I am the parent or legal guardian of the participant named above, and I have read and
          agree to the waiver terms stated above.*
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
            <strong>Who:</strong> Open to local youth &mdash; details on age range and group size
            coming soon.
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
