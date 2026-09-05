# HELLDiVE//DB — major content upgrade

Cloudflare Workers + Static Assets build for the Helldivers 2 community portal.

## Current catalog

- 132 weapons: 52 primary, 24 secondary, 35 support, 21 throwables
- 114 usable/common stratagem records across support, backpack, Eagle, orbital, sentry, emplacement, vehicle and mission groups
- 107 body-armour records
- 30 localized armor-passive descriptions
- 14 interface locales
- 1000 original Super Earth TV transmissions per locale, plus a few short classic phrases

## Community tools

Builds and tier lists start empty. They are created only by players and stored in browser localStorage until a real account/backend system is added.

## Runtime

- `src/worker.js` proxies public community Galactic War data and public Steam endpoints
- `public/` contains the static frontend
- Deploy command: `npx wrangler deploy`
- Test endpoints after deployment: `/api/health`, `/api/hd2/v1/war`, `/api/steam/players`

## Data policy

Canonical game item names are preserved for searchability. Detailed balance values are included where they were independently cross-checked; unknown/conflicting fields remain explicit rather than guessed. Detail dialogs link to a community reference search for manual verification.
