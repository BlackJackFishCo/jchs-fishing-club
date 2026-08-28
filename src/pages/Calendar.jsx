import './Volunteer.css'

const months = [
  'September',
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
      <p className="eyebrow">Plan Ahead</p>
      <h1 className="section-title">Calendar 2026-2027</h1>
      <p className="volunteer-page__intro">
        Club activities for the school year, month by month. Dates and times will be
        posted here as they&apos;re confirmed.
      </p>

      <div className="volunteer-grid">
        {months.map((month) => (
          <article key={month} className="volunteer-card card">
            <span className="volunteer-card__status">Date TBD</span>
            <h3>{month}</h3>
            <p>Events for {month} will be posted here once scheduled.</p>
            <span className="volunteer-card__hours">Time TBD</span>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Calendar
