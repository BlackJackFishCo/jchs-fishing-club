import logo from '../assets/logo.png'
import './Volunteer.css'
import './Calendar.css'

const months = [
  {
    name: 'September',
    title: 'First Official Club Meeting',
    time: '12:30pm',
    location: 'Cafeteria',
    date: '24',
    year: '2026',
    agenda: [
      'Registration Paperwork',
      'FWC Survey',
      'Club Outline and Club Ideas',
      'JCHSFC Site to log catches',
    ],
  },
  {
    name: 'October',
    title: 'Lure Rigging & Techniques',
    time: '3pm',
    location: 'The Commons',
    date: '22',
    year: '2026',
    agenda: ['NLBN Pro Staff, Guest Speaker Guide Adam Rizzi from Reel Deal Adventures'],
  },
  {
    name: 'November',
    time: '12:30pm',
    location: 'Cafeteria',
    date: '19',
    year: '2026',
  },
  {
    name: 'December',
    time: '12:30pm',
    location: 'Cafeteria',
    date: '17',
    year: '2026',
  },
  {
    name: 'January',
    time: '3pm',
    location: 'The Commons',
    date: '21',
    year: '2027',
  },
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

      <div className="volunteer-grid calendar-grid">
        {months.map((month) => {
          const isDetailed = typeof month !== 'string'
          const name = isDetailed ? month.name : month

          return (
            <article key={name} className="volunteer-card card">
              <div className="calendar-card__top-row">
                <span className="volunteer-card__status">
                  {isDetailed && month.time ? month.time : 'Time TBD'}
                </span>
                {isDetailed && month.location && (
                  <span className="volunteer-card__location">{month.location}</span>
                )}
              </div>
              <h3>
                {isDetailed && month.date
                  ? `${name} ${month.date}${month.year ? `, ${month.year}` : ''}`
                  : name}
              </h3>
              {isDetailed && month.title ? (
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
            </article>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
