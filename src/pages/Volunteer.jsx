import logo from '../assets/logo.png'
import fwcLogo from '../assets/fwc-logo.png'
import './Volunteer.css'

const projects = [
  {
    title: 'Indian River Lagoon Shoreline Cleanup',
    status: 'Date TBD',
    description:
      'Members walk local shorelines and boat ramps around the Fort Pierce Inlet collecting trash, monofilament line, and debris that threaten fish and wildlife.',
    hours: 'Service hours available',
  },
  {
    title: 'Mangrove Restoration Days',
    status: 'Date TBD',
    description:
      'Working with local conservation partners to plant and maintain mangroves, which provide critical nursery habitat for snook, redfish, and juvenile game fish.',
    hours: 'Service hours available',
  },
  {
    title: 'Youth Fishing Clinic',
    status: 'Date TBD',
    description:
      'Club members mentor younger students and community kids on casting, knot-tying, and basic tackle at a hands-on fishing clinic.',
    hours: 'Service hours available',
  },
]

function Volunteer() {
  return (
    <div className="page volunteer-page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Give Back</p>
          <h1 className="section-title">Volunteer Events 2026-2027</h1>
          <p className="volunteer-page__intro">
            The JCHS Fishing Club is committed to protecting the waters we fish. Below are
            our ongoing and upcoming volunteer projects &mdash; details and sign-ups will be
            posted here as dates are confirmed.
          </p>
        </div>
        <div className="page-head__logos">
          <img className="page-head__logo" src={logo} alt="JCHS Fishing Club crest" />
          <img className="species-rules__fwc-logo" src={fwcLogo} alt="Florida Fish and Wildlife Conservation Commission logo" />
        </div>
      </div>

      <div className="volunteer-grid">
        {projects.map((p) => (
          <article key={p.title} className="volunteer-card card">
            <span className="volunteer-card__status">{p.status}</span>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <span className="volunteer-card__hours">{p.hours}</span>
          </article>
        ))}
      </div>

      <section className="card volunteer-cta">
        <h3>Want to help organize a project?</h3>
        <p>Talk to your club moderator or officer team to get a project added to this page.</p>
      </section>
    </div>
  )
}

export default Volunteer
