# Changelog

## 2026-09-06 — encyclopedia UI / v6

- Rebuilt weapon, stratagem and armour cards as larger armory-dossier cards with larger artwork, four quick-stat tiles and clearer catalog metadata.
- Reorganized item details into named sections instead of one long flat table: combat, ammunition/handling, utility/effects, deployment, defense/mobility, passive effects and acquisition/record data as applicable.
- Added an in-catalog two-item comparison workflow for weapons, stratagems and armour. Selected items remain visible in a sticky comparison tray, can be removed independently, and are limited to two records.
- Added a side-by-side comparison modal with neutral difference highlighting. Highlighting indicates only that values differ; it never auto-ranks items or claims one is better.
- Added direct detail access from the comparison modal and comparison controls inside item dossiers.
- Added responsive layouts for desktop, tablet and narrow mobile screens, including horizontally readable comparison columns on small displays.
- Added 21 new comparison/dossier interface strings to all 14 locales; locale key parity is preserved.
- Preserved the existing catalog counts, local icon fallbacks, verified-data policy, Wiki live-reference separation and player-authored-only build/tier behavior.

## 2026-09-06 — Galactic War tactical-map pass

- Fixed missing `arrayish`, `numberDeep` and `firstText` runtime helpers that could break War and live-news rendering.
- Added a coordinate-driven tactical Galactic War map with faction-control styling, active-diver sizing, planet detail modals and an active-frontline side panel.
- Added a resilient map fallback: if the live lookup temporarily lacks coordinates, War still renders current fronts instead of a broken/blank map.
- Added Helldivers Stats proxy support for sectors, factions and the historical Major Order archive.
- Added a dedicated Major Orders tab that combines current assignment data with the archive fallback.
- Expanded galaxy statistics with missions lost, deaths and accuracy when those fields are supplied by the upstream API.
- Added the new Galactic War interface strings to all 14 locales while preserving key parity.
- Bumped client HD2 API cache namespace to `hd2-api-v4`.

## 2026-09-06 — content/live-data hardening

- Reworked Galactic War routing so the core War screen no longer depends on the community endpoint that was returning HTTP 400 in the deployed project.
- Added public Helldivers Stats routes for current war, planets, active divers and galaxy-wide war statistics.
- Retained `api.helldivers2.dev` for richer community endpoints such as dispatches, assignments, campaigns, planet events and space stations.
- Removed unsupported HD2 identity query parameters; identity is supplied only through request headers when the community API is used.
- Added cross-platform active-diver and galaxy-stat data to the War view, with Steam count retained as a fallback/reference.
- Hardened Wiki item-image resolution: MediaWiki PageImages -> Wiki search -> OpenGraph image -> local SVG fallback.
- Kept all real item image requests behind the same-origin Cloudflare Worker cache.
- Confirmed the catalogs contain 132 weapons, 114 stratagems and 107 armour records with no duplicate ids/names and no missing local fallback icons.
- Stratagem search now uses one main search field only; call-in sequences can be searched only with direction arrows.
- Expanded dynamic mechanical localization for firing modes, penetration tiers, shield values, decoded/UI annotations and acquisition notes.
- Added `missionsWon` and updated live-data source text across all 14 UI locales.
- Super Earth TV remains in a dedicated file with 1000 unique explicit messages per locale; previously untranslated TV subjects were localized.
- Updated catalog ticker count metadata from 1003 to 1000 to match the explicit TV dataset.

## 2026-09-06 — catalog intelligence / v5

- Added a per-record data-completeness score to weapon, stratagem and armour cards, plus completeness sorting.
- Added conservative derived technical metrics. The portal calculates cyclic DPS, magazine damage, time-to-empty and carried rounds only when the source fields are simple verified numeric values; compound/explosive/DPS strings are deliberately excluded from calculations.
- Added stratagem input-length and cooldown-cycle metrics derived from existing call-in data.
- Added `/api/wiki/item`, a same-origin Cloudflare Worker endpoint for current Helldivers Wiki summaries, revision timestamps and sanitized infobox fields.
- Detailed item modals now combine the local verified catalog with a separately labelled live community-reference panel. Failure of the live reference never removes local data.
- Added all new catalog-interface strings to every one of the 14 locales.
- Cross-linked support-weapon and support-stratagem records where the same verified entity already existed in both datasets; this closes the missing S-11 Speargun call-in/cooldown/patch fields without inventing values.
- Extended the item media manifest with the structured live-reference endpoint for every catalog record.


## v7
- Fixed empty home page / news page crash by restoring the missing fallbackNews() helper.
- Removed the separate News section from navigation and folded the news feed into the home page.
- Kept news.html as a backward-compatible alias that now renders the home page.
- Stratagem arrow-sequence search is now a hidden easter egg: no UI hint, but arrow-key input works when the stratagem search field is focused.
- Continued prioritizing game-style item art through the wiki image proxy and local fallback placeholders only when needed.
