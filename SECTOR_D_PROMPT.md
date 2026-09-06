# SECTOR D — BUILD LAB

Continue working only on the existing HELLDIVE//DB project. Do not rebuild the site from scratch. This sector upgrades the existing player-build page into a database-ready Loadout Builder while keeping the current visual identity and local-only storage model.

## Goals
- Replace name-based build storage with stable item IDs.
- Migrate old localStorage builds automatically.
- Add live loadout preview with icons.
- Add faction, difficulty and playstyle filters for saved builds.
- Add localized labels for all new build UI in all 14 supported locales.
- Preserve the local player-authored / no-backend model.
- Keep all existing pages, APIs, ticker and visual language intact.

## Loadout Builder
Fields: title, purpose, faction, difficulty, playstyle, primary, secondary, throwable, armor, four stratagems, notes.

All item selectors use stable IDs, never translated display names.

Live preview must resolve IDs back to localized names and existing icon assets.

Prevent the same stratagem from being selected twice in a single build.

## Saved Builds
Add filters for faction, difficulty band, playstyle and text search. Cards should show compact icons for the selected weapons, throwable, armor and stratagems. Actions: View, Copy, Delete.

View opens an expanded modal. Copy exports the current build structure with display names for convenience, while storage remains ID-based.

## Localization
New build-specific UI strings must work in:
en, fr, it, de, es-ES, ja, ko, pt-BR, es-419, pl, pt-PT, ru, zh-CN, zh-TW.

## Constraints
Do not add fake online builds. Do not add backend accounts or public sharing yet. Do not change stable Steam/Galactic War counters. Do not redesign unrelated pages.
