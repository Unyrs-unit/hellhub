# HELLDiVE//DB — GitHub Pages build

A multi-page, dependency-free frontend prototype for an unofficial Helldivers 2 community portal.

## Pages

- `index.html` — home terminal
- `war.html` — live Galactic War data
- `weapons.html`, `stratagems.html`, `armor.html`, `enemies.html` — searchable/filterable catalogs
- `builds.html` — featured builds + local loadout generator + shareable query-string builds
- `tier-lists.html` — category tiers + browser-local voting
- `guides.html` — guide cards + deep-linked prototype reader
- `news.html` — Steam/community news integration with fallback
- `memes.html` — community meme wall + local submission draft demo
- `data-sources.html` — API/data transparency page
- `privacy.html`, `terms.html` — prototype legal pages
- `404.html` — GitHub Pages fallback

## Live data sources

### 1) Helldivers 2 community API

Root: `https://api.helldivers2.dev`

The site uses these public endpoints through `assets/js/api.js`:

- `/api/v1/war`
- `/api/v1/planets`
- `/api/v1/campaigns`
- `/api/v1/assignments`
- `/api/v1/dispatches`
- `/api/v1/planet-events`
- `/api/v2/space-stations`
- `/api/v1/steam` as a fallback for Steam news

The site also attempts Valve's public current-player endpoint: `ISteamUserStats/GetNumberOfCurrentPlayers/v1` for App ID `553850`.

Requests include `X-Super-Client`, use browser caching, and are queued with a delay to stay friendly to the hosted community service.

This is a community API and **not an official Arrowhead developer API**. The site intentionally does not call Arrowhead's reverse-engineered game backend directly.

### 2) Steam public news API

The news page first attempts Valve's public `ISteamNews/GetNewsForApp/v2` endpoint for Helldivers 2 (App ID `553850`). If a browser blocks the call because of CORS, the site falls back to the community wrapper.

## Localization

The interface selector includes the 14 languages listed for Helldivers 2 on Steam:

English, French, Italian, German, Spanish (Spain), Japanese, Korean, Portuguese (Brazil), Spanish (Latin America), Polish, Portuguese (Portugal), Russian, Simplified Chinese, Traditional Chinese.

Canonical item names stay in English for data consistency. Shared interface strings, navigation, status labels and the TV ticker switch languages. Unsupported/fine-grained strings fall back to English.

## GitHub Pages

No build step is needed.

1. Upload all files to the repository root.
2. GitHub → Settings → Pages.
3. Deploy from `main` / root.

All links and assets use relative paths so project pages such as `username.github.io/repository/` work correctly.

## Production next steps

GitHub Pages is frontend-only. For production accounts, public meme submissions, comments, ratings, ad controls, affiliate attribution, merch or Premium features, add a backend (Supabase, Cloudflare Workers/D1, Firebase, etc.).

For higher traffic, put live API traffic behind a caching worker. Do not expose private API keys in this repository.

## Disclaimer

Unofficial Helldivers 2 community website. Not affiliated with Arrowhead Game Studios, PlayStation or Valve. Local catalog/build/tier content is editorial prototype data and should be reviewed after balance patches.
