# HELLDiVE//DB — encyclopedia interface v6

Cloudflare Workers + Static Assets build for the Helldivers 2 community portal.

## Catalog coverage

- 132 weapons: 52 primary, 24 secondary, 35 support, 21 throwables
- 114 stratagem records across support, backpack, Eagle, orbital, sentry, emplacement, vehicle and mission/common groups
- 107 body-armour records
- 30 localized armor-passive descriptions
- 14 interface locales
- 1000 explicit, unique Super Earth TV transmissions **per locale** in `public/assets/js/tv-broadcasts.js`

## Super Earth TV

Broadcast copy is fully separated from runtime code. The browser only randomizes/shuffles the already-written records; it does not generate a handful of phrases at runtime.

- Content: `public/assets/js/tv-broadcasts.js`
- Runtime bridge: `public/assets/js/ticker.js`
- 1000 unique records in each of 14 locales
- Descriptive subjects are localized as well as the surrounding message copy

## Galactic War data

The Worker uses a resilient split-source strategy:

- Current war, planets, factions/sectors, cross-platform active diver count, galaxy statistics and Major Order archive: public Helldivers Stats read API
- Assignments, dispatches, campaigns, planet events and space stations: `api.helldivers2.dev`
- Steam news and Steam player count: public Steam endpoints

The website calls only same-origin `/api/*` routes; the Cloudflare Worker performs upstream requests and caching. The Galactic War overview renders a tactical planet map from API coordinates, overlays faction control and active-diver presence, and falls back to a live frontline list if coordinate data is unavailable.

Useful post-deploy checks:

- `/api/health`
- `/api/hd2/v1/war`
- `/api/hd2/v1/player-count`
- `/api/hd2/v1/war-stats`
- `/api/hd2/v1/factions`
- `/api/hd2/v1/sectors`
- `/api/hd2/v1/historical-major-orders?limit=50`
- `/api/hd2/v1/dispatches`
- `/api/steam/players`
- `/api/wiki/image?title=AR-23%20Liberator`
- `/api/wiki/item?title=AR-23%20Liberator`

## Item images and live reference data

Weapon, armour and stratagem cards request their current community reference image through `/api/wiki/image?title=...`. The Worker resolves the page image via the Helldivers Wiki API, falls back to OpenGraph metadata when needed, proxies the image through the site, and caches it. Every catalog record also retains a local SVG HUD icon as a fallback so cards never collapse if an external image is unavailable.

Detailed item modals additionally request `/api/wiki/item?title=...`. This endpoint resolves the current Wiki article, returns its intro, latest revision timestamp and sanitized infobox fields, then caches that JSON at the Worker edge. The live community block is intentionally separate from the local verified catalog: an upstream outage cannot erase local stats, and community values are not silently promoted into verified static fields.

## Stratagem search

There is no separate call-in-code search or sort field. The main stratagem search accepts either a name or the arrow characters `↑ ↓ ← →`. Internal WASD storage is never presented as user input.

## Community tools

Builds and tier lists start empty. They are created only by players and stored in browser `localStorage` until a real account/backend system is added.

## Runtime / deploy

- `src/worker.js` — API proxy + image proxy
- `public/` — static frontend
- `wrangler.jsonc` — Cloudflare Worker + Static Assets config
- Deploy command: `npx wrangler deploy`

## Encyclopedia interface and comparison

Weapon, stratagem and armour catalogs use larger dossier-style cards with quick stats and expanded item art. Opening a record groups verified local fields by purpose instead of presenting one flat table. The live Wiki block remains a separately labelled community reference below the local dossier.

Each catalog also supports a two-item comparison workflow. Select **Add to compare** on any two records, then open the sticky comparison tray. The comparison table shows both verified values side by side and highlights differences without declaring a winner. Comparison is intentionally scoped to the current catalog, so weapons compare with weapons, stratagems with stratagems and armour with armour.

## Catalog intelligence

Cards expose a completeness percentage and can be sorted by it. Detail modals also show conservative derived metrics from already-verified numbers. Compound damage strings, damage-over-time values, selectable fire rates and other ambiguous values are excluded from derived calculations rather than flattened into a misleading number.

## Data policy

Canonical game identifiers remain available for search and reference. Display/UI/mechanical terminology is localized. Detailed balance values are shown only where the catalog has a verified value; unknown or conflicting fields remain explicit instead of being invented. Live Wiki fields are visibly labelled as community reference data and remain separate from the local verification state.
