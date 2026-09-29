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
  'Catfish – Gafftopsail Catfish',
  'Catfish – Hardhead Catfish',
  'Drum – Black Drum',
  'Drum – Red Drum',
  'Drum – Spotted Seatrout',
  'Drum – Whiting',
  'Flounder',
  'Grunt – White Grunt',
  'Jack – Crevalle Jack',
  'Jack – Blue Runner',
  'Ladyfish',
  'Mackerel – Little Tunny',
  'Mackerel – King Mackerel',
  'Mackerel – Spanish Mackerel',
  'Pompano – Permit',
  'Pompano – Florida Pompano',
  'Porgy – Sheepshead',
  'Snapper – Mangrove/Gray Snapper',
  'Snook',
]

const FRESHWATER_SPECIES = [
  'Black Bass – Florida Bass',
  'Black Bass – Spotted Bass',
  'Temperate Bass – Striped Bass',
  'Temperate Bass – Sunshine Bass',
  'Temperate Bass – White Bass',
  'Catfish – Brown Bullhead',
  'Catfish – Yellow Bullhead',
  'Catfish – Channel Catfish',
  'Catfish – White Catfish',
  'Panfish – Bluegill',
  'Panfish – Redbreast Sunfish',
  'Panfish – Redear Sunfish',
  'Panfish – Spotted Sunfish',
  'Panfish – Warmouth',
  'Panfish – Black Crappie',
  'Cichlid – Butterfly Peacock Bass',
  'Cichlid – Blue/Nile Tilapia',
  'Cichlid – Mayan',
  'Gar – Florida/Spotted',
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
