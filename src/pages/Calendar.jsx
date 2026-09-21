import nlbnLogo from '../assets/sponsor-nlbn.png'
import ccaStarLogo from '../assets/sponsor-cca-star.png'
import abenzFishingLogo from '../assets/sponsor-abenz-fishing.png'
import reelDealLogo from '../assets/sponsor-reel-deal-adventures.png'
import './Volunteer.css'
import './Calendar.css'

const MONTH_NUMBERS = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
}

function getEventDate(month) {
  if (typeof month === 'string' || !month.date || !month.year) return null
  return new Date(Number(month.year), MONTH_NUMBERS[month.name], Number(month.date))
}

const months = [
  {
    name: 'September',
    title: 'First Official Club Meeting',
    time: '12:30pm',
    location: 'Cafeteria',
    date: '24',
    year: '2026',
    agenda: [
      'Club Outline and Club Ideas',
      'FWC Survey',
      'JCHSFC Site & logging catches, Rod Rigging 101',
    ],
  },
  {
    name: 'October',
    title: 'Lure Rigging & Techniques',
    time: '3pm',
    location: 'The Commons',
    date: '22',
    year: '2026',
    agenda: [
      'Guest Speaker - NLBN Brand Ambassador and Reel Deal Adventures Founder Adam Rizzi @reeldealadventures',
    ],
    sponsors: [
      { logo: nlbnLogo, link: 'https://nlbn.com/', alt: 'NLBN - No Live Bait Needed logo' },
      {
        logo: reelDealLogo,
        link: 'https://www.instagram.com/reeldealadventures/',
        alt: 'Reel-Deal Adventures logo',
      },
    ],
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
    title: 'Snook Fishing Techniques',
    time: '12:30pm',
    location: 'Cafeteria',
    date: '17',
    year: '2026',
    agenda: [
      'Guest Speaker Aaron Benzrihem from Abenz Fishing — content creator on YouTube, Instagram, and Facebook.',
    ],
    sponsors: [
      { logo: abenzFishingLogo, link: 'https://abenzfishing.com/', alt: 'Abenz Fishing logo' },
    ],
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
  {
    name: 'May',
    title: 'Guest Speaker CCA STAR Representative',
    agenda: ['CCA - STAR Summer Event Registration, ccaflstar.com'],
    sponsors: [
      {
        logo: ccaStarLogo,
        link: 'https://ccaflstar.com/',
        alt: 'CCA Florida STAR presented by Yamaha logo',
      },
    ],
  },
  {
    name: 'June',
    title: 'Participate in CCA STAR Program',
    sponsors: [
      {
        logo: ccaStarLogo,
        link: 'https://ccaflstar.com/',
        alt: 'CCA Florida STAR presented by Yamaha logo',
      },
    ],
  },
  {
    name: 'July',
    title: 'Participate in CCA STAR Program',
    sponsors: [
      {
        logo: ccaStarLogo,
        link: 'https://ccaflstar.com/',
        alt: 'CCA Florida STAR presented by Yamaha logo',
      },
    ],
  },
  {
    name: 'August',
    title: 'Participate in CCA STAR Program',
    sponsors: [
      {
        logo: ccaStarLogo,
        link: 'https://ccaflstar.com/',
        alt: 'CCA Florida STAR presented by Yamaha logo',
      },
    ],
  },
]

function Calendar() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingTimes = months
    .map(getEventDate)
    .filter((d) => d && d.getTime() >= today.getTime())
    .map((d) => d.getTime())
  const nextEventTime = upcomingTimes.length ? Math.min(...upcomingTimes) : null

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
      </div>

      <div className="volunteer-grid calendar-grid">
        {months.map((month) => {
          const isDetailed = typeof month !== 'string'
          const name = isDetailed ? month.name : month
          const eventDate = getEventDate(month)
          const isNextUp = nextEventTime !== null && eventDate?.getTime() === nextEventTime

          return (
            <article
              key={name}
              className={`volunteer-card card${isNextUp ? ' calendar-card--next' : ''}`}
            >
              {isNextUp && <span className="calendar-card__next-badge">Next Up</span>}
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
                  {month.agenda && (
                    <ul className="volunteer-card__agenda">
                      {month.agenda.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p>Events for {name} will be posted here once scheduled.</p>
              )}
              {isDetailed && month.sponsors && (
                <div className="calendar-card__sponsors">
                  {month.sponsors.map((sponsor) => (
                    <a
                      key={sponsor.alt}
                      className="calendar-card__sponsor"
                      href={sponsor.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={sponsor.alt}
                    >
                      <img src={sponsor.logo} alt={sponsor.alt} />
                    </a>
                  ))}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
