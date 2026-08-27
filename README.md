# JCHS Fishing Club

Website for the John Carroll High School Fishing Club (Fort Pierce, FL).

Built with React + Vite, deployed to GitHub Pages.

## Pages

- **Home** — mission statement (TBD) and quick links
- **Species Board** — 40 required-species thumbnails with a live "caught" ticker.
  Click a thumbnail to log species, angler, date, and a photo (saved in the browser).
- **Volunteer Projects** — club conservation & community service projects
- **Tournament Info** — rules and upcoming tournament details

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
