# WebSite Roaster 🔥

A **frontend-only** React app that roasts any website with humor, then gives calm, actionable optimization tips.

- No backend
- No database
- No saved data — close the tab and it is gone
- Instant analysis in your browser

## What it checks

- **Trends** — viewport meta, Open Graph, HTTPS, semantic HTML, lazy loading, ARIA, dark mode, etc.
- **Outdated relics** — marquee, blink, framesets, Flash, hit counters, old jQuery, table layouts
- **Colors** — palette extracted from HTML/CSS
- **CTAs** — buttons and links that look like calls to action
- **Suggestions** — what to add, remove, and optimize (calm and practical)

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`, paste a URL, hit **Roast My Site**.

## Folder structure

```
src/
├── components/       # UI components (Header, UrlInput, ScoreCard, etc.)
├── services/         # fetchSite, analyzer, roastGenerator
├── styles/           # global.css, App.css
├── utils/            # helpers
├── App.jsx
└── main.jsx
```

## Note on fetching sites

Because browsers block cross-origin requests, the app uses public CORS proxies to fetch HTML client-side. Some sites may block this. Nothing is stored anywhere.
