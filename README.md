# JCHS Fishing Club

Website for the John Carroll High School Fishing Club (Fort Pierce, FL).

Built with React + Vite, deployed to GitHub Pages.

## Pages

- **Home** — mission statement (TBD) and quick links
- **Species Board** — 40 required-species thumbnails with a live "caught" ticker.
  Click a thumbnail to log species, angler, date, and a photo (saved in the browser).
- **Volunteer Projects** — club conservation & community service projects
- **Tournament Info** — rules and upcoming tournament details

## Admin access

The `/admin` page lets signed-in admins manage the roster and view the species
catch report. Anyone can create a login from that page (Sign In → "Don't have
an account? Create one"), but a brand new account isn't an admin until its
User ID is added to Firestore's `admins` collection — the page shows that ID
once you're signed in but not yet an admin.

Existing admins can grant access to others from the "Admins" section on the
same page (paste the new person's User ID). The **very first** admin has to
be granted manually in the Firebase Console, since granting admin access
itself requires already being one:

1. Create the account from `/admin` (or Firebase Console → Authentication →
   Users → Add user).
2. Firebase Console → Firestore Database → `admins` collection → add a
   document whose **document ID** is that user's UID (from the Authentication
   page). The document's fields don't matter — its existence is what grants
   access.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and
publishes it to GitHub Pages. In the repo's **Settings → Pages**, set
**Build and deployment → Source** to **GitHub Actions** the first time.
