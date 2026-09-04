import logo from '../assets/logo.png'
import fwcLogo from '../assets/fwc-logo.png'
import './ClubRecords.css'

const RECORDS = ['Snook', 'Redfish', 'Trout']

function RecordPhotoPlaceholder() {
  return (
    <div className="record-card__photo" aria-hidden="true">
      <svg viewBox="0 0 64 64">
        <rect x="8" y="18" width="48" height="34" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M20 18l3.5-5h17l3.5 5" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="32" cy="35" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </svg>
      <span>Photo Coming Soon</span>
    </div>
  )
}

function ClubRecords() {
  return (
    <div className="page club-records-page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Club Records</p>
          <h1 className="section-title">Club Records</h1>
          <p className="volunteer-page__intro">
            The biggest Snook, Redfish, and Trout caught by JCHS Fishing Club members.
            Records will be posted here as club-record catches are verified.
          </p>
        </div>
        <div className="page-head__logos">
          <img className="page-head__logo" src={logo} alt="JCHS Fishing Club crest" />
          <img
            className="species-rules__fwc-logo"
            src={fwcLogo}
            alt="Florida Fish and Wildlife Conservation Commission logo"
          />
        </div>
      </div>

      <div className="club-records-grid">
        {RECORDS.map((species) => (
          <article key={species} className="record-card card">
            <RecordPhotoPlaceholder />
            <h3>{species}</h3>
            <dl className="record-card__details">
              <div>
                <dt>Club Member</dt>
                <dd>TBD</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>TBD</dd>
              </div>
              <div>
                <dt>Measurement</dt>
                <dd>TBD</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  )
}

export default ClubRecords
