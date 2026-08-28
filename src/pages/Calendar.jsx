import logo from '../assets/logo.png'
import './Volunteer.css'

const months = [
  {
    name: 'September',
    title: 'First Official Club Meeting',
    agenda: [
      'Registration Paperwork',
      'Club Outline, Goals, and Vision',
      'FWC Pre-Club Survey',
      'JCHSFC Site to log catches',
    ],
  },
  'October',
  'November',
  'December',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
]

function Calendar() {
  return (
    <div className="page volunteer-page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Plan Ahead</p>
          <h1 className="section-title">Calendar 2026-2027</h1>
          <p className="volunteer-page__intro">
            Club activities for the school year, month by month. Dates and times will be
            posted here as they&apos;re confirmed.
          </p>
        </div>
        <img className="page-head__logo" src={logo} alt="JCHS Fishing Club crest" />
      </div>

      <div className="volunteer-grid">
        {months.map((month) => {
          const isDetailed = typeof month !== 'string'
          const name = isDetailed ? month.name : month

          return (
            <article key={name} className="volunteer-card card">
              <span className="volunteer-card__status">Date TBD</span>
              <h3>{name}</h3>
              {isDetailed ? (
                <>
                  <p className="volunteer-card__event">{month.title}</p>
                  <ul className="volunteer-card__agenda">
                    {month.agenda.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Events for {name} will be posted here once scheduled.</p>
              )}
              <span className="volunteer-card__hours">Time TBD</span>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
