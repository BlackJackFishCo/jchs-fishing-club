import jchsfcLogo from '../assets/logo.png'
import mommaBLogo from '../assets/sponsor-momma-b.png'
import nlbnLogo from '../assets/sponsor-nlbn.png'
import ccaStarLogo from '../assets/sponsor-cca-star.png'
import abenzFishingLogo from '../assets/sponsor-abenz-fishing.png'
import reelDealLogo from '../assets/sponsor-reel-deal-adventures.png'
import localLinesLogo from '../assets/sponsor-local-lines.png'
import seaSafeLogo from '../assets/sponsor-project-seasafe.png'
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
  if (!month.date || !month.year) return null
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
      'JCHSFC Site & logging catches',
    ],
    sponsors: [
      {
        logo: jchsfcLogo,
        alt: 'John Carroll High School Fishing Club logo',
        imgClassName: 'calendar-card__sponsor-img--large',
      },
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
    title: 'Casting Techniques & Contest',
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
    title: 'Castnet Techniques for Live Bait',
    time: '3pm',
    location: 'The Commons',
    date: '21',
    year: '2027',
  },
  {
    name: 'February',
    year: '2027',
    title: 'Surf Fishing Rigging & Techniques',
    agenda: [
      'Hands on Surf Fishing Outing with Captain Matt Burr of Momma B Charters',
    ],
    sponsors: [{ logo: mommaBLogo, alt: 'Momma B Sport and Beach Fishing Guide Service logo' }],
  },
  {
    name: 'March',
    year: '2027',
    title: 'Guest Speaker Captain Alex Gorichky',
    agenda: [
      'Local Lines Guide Service and Ambassador of the Star brite Project SeaSafe initiative.',
    ],
    sponsors: [
      { logo: localLinesLogo, link: 'https://locallinescharters.com/', alt: 'Local Lines Guide Service logo' },
      { logo: seaSafeLogo, link: 'https://www.projectseasafe.com/', alt: 'Star brite Project SeaSafe logo' },
    ],
  },
  { name: 'April', year: '2027' },
  {
    name: 'May',
    year: '2027',
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
    year: '2027',
    title: 'Participate in CCA STAR Program over the summer',
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
    year: '2027',
    title: 'Participate in CCA STAR Program over the summer',
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
    year: '2027',
    title: 'Participate in CCA STAR Program over the summer',
    sponsors: [
      {
        logo: ccaStarLogo,
        link: 'https://ccaflstar.com/',
        alt: 'CCA Florida STAR presented by Yamaha logo',
      },
    ],
  },
  {
    name: 'September',
    year: '2027',
    title: 'ICC Day',
    agenda: ['9/18/2027'],
  },
  { name: 'October', year: '2027' },
  { name: 'November', year: '2027' },
  { name: 'December', year: '2027' },
  { name: 'January', year: '2028' },
  { name: 'February', year: '2028' },
  { name: 'March', year: '2028' },
  { name: 'April', year: '2028' },
  { name: 'May', year: '2028' },
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
          <h1 className="section-title">Calendar 2026-2028</h1>
          <p className="volunteer-page__intro">
            Club activities for the school year, month by month. Dates and times will be
            posted here as they&apos;re confirmed.
          </p>
        </div>
      </div>

      <div className="volunteer-grid calendar-grid">
        {months.map((month) => {
          const eventDate = getEventDate(month)
          const isNextUp = nextEventTime !== null && eventDate?.getTime() === nextEventTime

          return (
            <article
              key={`${month.name}-${month.year}`}
              className={`volunteer-card card${isNextUp ? ' calendar-card--next' : ''}`}
            >
              {isNextUp && <span className="calendar-card__next-badge">Next Up</span>}
              <div className="calendar-card__top-row">
                <span className="volunteer-card__status">{month.time || 'Time TBD'}</span>
                {month.location && (
                  <span className="volunteer-card__location">{month.location}</span>
                )}
              </div>
              <h3>
                {month.date
                  ? `${month.name} ${month.date}, ${month.year}`
                  : `${month.name} ${month.year}`}
              </h3>
              {month.title ? (
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
                <p>Events for {month.name} will be posted here once scheduled.</p>
              )}
              {month.sponsors && (
                <div className="calendar-card__sponsors">
                  {month.sponsors.map((sponsor) =>
                    sponsor.link ? (
                      <a
                        key={sponsor.alt}
                        className="calendar-card__sponsor"
                        href={sponsor.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={sponsor.alt}
                      >
                        <img src={sponsor.logo} alt={sponsor.alt} className={sponsor.imgClassName} />
                      </a>
                    ) : (
                      <span key={sponsor.alt} className="calendar-card__sponsor">
                        <img src={sponsor.logo} alt={sponsor.alt} className={sponsor.imgClassName} />
                      </span>
                    ),
                  )}
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
