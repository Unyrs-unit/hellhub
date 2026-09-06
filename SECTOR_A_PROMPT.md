# HELLDIVE//DB — SECTOR A PROMPT

Continue working ONLY on the existing HELLDIVE//DB project.

Do NOT rebuild the website from scratch. Do NOT replace the current visual identity. Do NOT remove existing functionality. This is an incremental refinement stage.

## Goals
1. Fix live homepage statistics so Steam Online and Active Helldivers use separate DOM targets and never overwrite one another.
2. Show clear live/offline state for the live intel panel.
3. Make global search a real database search: weapons, stratagems, armor, enemies, builds and guides; search localized names/descriptions, categories, traits and stratagem call-in codes; rank exact/prefix matches first.
4. Global search results for database items should open the existing detail modal directly instead of only sending the user to a generic catalog page.
5. Preserve current icons, filters, call-in-code search, localization structure and ticker behavior already present in the project.
6. Make only restrained CSS refinements for search result buttons and live/offline states.

## Live statistics
- Keep Steam player count from `/api/steam/players`.
- Keep Active Helldivers from the existing Helldivers API/war data.
- Render Steam into `[data-home-steam]`.
- Render Active Helldivers into `[data-home-active-helldivers]`.
- Never write both values into the same element.
- Add visual offline state when a metric is unavailable.
- Keep the current layout and dark military-sci-fi visual language.

## Global search
- Search all catalog collections: weapons, stratagems, armor, enemies, plus builds and guides when available.
- Search current locale display name and description as well as stable/original name and relevant metadata.
- Search stratagem call-in code in arrow form and normalized W/A/S/D form.
- Rank exact name match first, then prefix match, then general text match.
- Limit to a practical result count such as 30.
- Database results should open `openDetail(kind, item)` without leaving the search context.
- Non-database content such as builds/guides may route to its page.
- Do not introduce a second database/search architecture.

## Preserve
- Existing homepage layout.
- Existing news panel.
- Existing API proxy and caching.
- Existing language selector.
- Existing ticker.
- Existing icons and catalog filters.
- Existing responsive behavior.

## Quality
- Do not invent live data.
- Do not hardcode fake player counts.
- Do not rewrite unrelated files.
- Keep JS syntax valid and components reusable.
