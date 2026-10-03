const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

initializeApp()
const db = getFirestore()

// Add more addresses here once testing looks good.
const NOTIFY_EMAILS = ['jstelmacki@gmail.com']

// Mirrors src/data/species.js so speciesId can be resolved to a name.
const SALTWATER_SPECIES = [
  'Bluefish',
  'Gafftopsail Catfish',
  'Hardhead Catfish',
  'Black Drum',
  'Red Drum',
  'Spotted Seatrout',
  'Whiting',
  'Flounder',
  'White Grunt',
  'Crevalle Jack',
  'Blue Runner',
  'Ladyfish',
  'Little Tunny / Bonita',
  'King Mackerel',
  'Spanish Mackerel',
  'Permit',
  'Florida Pompano',
  'Sheepshead',
  'Mangrove/Gray Snapper',
  'Snook',
]

const FRESHWATER_SPECIES = [
  'Florida Largemouth Bass',
  'Spotted Bass',
  'Striped Bass',
  'Sunshine Bass',
  'White Bass',
  'Brown Bullhead Catfish',
  'Yellow Bullhead Catfish',
  'Channel Catfish',
  'White Catfish',
  'Bluegill',
  'Redbreast Sunfish',
  'Redear Sunfish',
  'Spotted Sunfish',
  'Warmouth',
  'Black Crappie',
  'Butterfly Peacock Bass',
  'Blue/Nile Tilapia',
  'Mayan Cichlid',
  'Florida/Spotted Gar',
  'Chain Pickerel',
]

const SPECIES_LIST = [
  ...SALTWATER_SPECIES.map((species, i) => ({ id: i + 1, species })),
  ...FRESHWATER_SPECIES.map((species, i) => ({ id: i + 1 + SALTWATER_SPECIES.length, species })),
]

function speciesNameById(id) {
  const entry = SPECIES_LIST.find((s) => s.id === Number(id))
  return entry ? entry.species : `Species #${id}`
}

// Fires whenever a new catch is logged on the Species Catch List, and drops
// a document into the `mail` collection for the Firebase "Trigger Email"
// extension to pick up and send.
exports.notifyOnNewCatch = onDocumentCreated('submissions/{submissionId}', async (event) => {
  const data = event.data?.data()
  if (!data) return

  const species = speciesNameById(data.speciesId)
  const angler = data.angler || 'Unknown angler'
  const date = data.date || 'No date logged'

  await db.collection('mail').add({
    to: NOTIFY_EMAILS,
    message: {
      subject: `New catch logged: ${species}`,
      html: `
        <p><strong>${angler}</strong> just logged a new catch on the JCHS Fishing Club Species Catch List.</p>
        <ul>
          <li><strong>Species:</strong> ${species}</li>
          <li><strong>Date caught:</strong> ${date}</li>
        </ul>
        ${data.photo ? `<p><a href="${data.photo}">View photo</a></p>` : ''}
      `,
    },
  })
})
