# HELLDiVE//DB — Helldivers 2 community portal prototype

A standalone responsive frontend prototype styled as a premium Super Earth military terminal.

## Run

No build step is required.

1. Extract the archive.
2. Open `index.html` in a modern browser.

For local development you can also run any static server, for example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Included

- Sticky desktop navigation
- Responsive hamburger navigation
- Search modal with working prototype search
- Hero / HUD system
- Database category cards
- Featured loadout cards
- Interactive community tier-list tabs
- News cards
- Community meme section
- Responsive footer
- Reduced-motion support
- Mobile-first breakpoints

## Future expansion path

The current prototype intentionally keeps content in structured JavaScript arrays (`builds`, `tierData`, `news`, `searchIndex`) so these can later be replaced with API responses.

Suggested production architecture:

- `/api/weapons`, `/api/stratagems`, `/api/armor`, `/api/builds`, `/api/tier-lists`, `/api/news`
- Global search index with filters and patch/version metadata
- Auth layer for profiles, votes, comments and saved builds
- Build Generator with shareable URLs
- Ad / affiliate components isolated from editorial content
- Merch and Premium modules behind feature flags
- CMS-backed news and guides
- Rating aggregation with anti-abuse controls

## Notes

This is an unofficial fan-site visual prototype. It uses original CSS/SVG interface artwork and does not bundle official Helldivers 2 artwork or logos.
