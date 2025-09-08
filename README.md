# Affordmed URL Shortener (Client-only)

A React (Vite) app that satisfies the Campus Hiring Evaluation — Frontend requirements.

## Features

- React + Material UI only (no other CSS libraries)
- Client-side routing: `/` (create), `/stats`, `/s/:code` (redirect)
- Mandatory logging middleware (see `src/lib/logger.js`) used across create/redirect/click flows; logs persist to `localStorage`
- Up to 5 URLs per batch, with client-side validation
- Default validity 30 minutes when not provided
- Optional custom shortcode (3–15 alphanumeric) with uniqueness checks
- Redirection page records click details (timestamp, referrer source, coarse “geo” via timezone) then forwards to the long URL
- Statistics page lists all links and expands to show per-click details
- Error handling via Material UI alerts

## Run locally

```bash
npm install
npm run dev
# opens on http://localhost:3000
```

> The Vite dev server is configured to run on port **3000** as required.

## Notes / Assumptions

- This is a *client-only* implementation using `localStorage` for persistence. In a real system, replace `src/lib/storage.js` with API calls and keep the logger.
- Coarse geolocation is approximated by the browser time zone (`Intl.DateTimeFormat().resolvedOptions().timeZone`) to avoid external APIs.
- The preview server also binds to port 3000 (`npm run preview`).

