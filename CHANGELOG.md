# Content upgrade v2 — 2026-09-05

- Homepage remains news-first with Steam news, High Command dispatches and live-war context.
- Weapon registry: 132 records (52 Primary, 24 Secondary, 35 Support, 21 Throwable).
- Stratagem registry: 114 usable/common records.
- Armor registry: 107 body-armour records and 30 localized passive descriptions.
- Filled missing deployment/procurement data for all 13 backpack stratagems.
- Synced Support Weapon stratagem cooldown/call-in/acquisition fields from the detailed weapon records.
- Corrected Eagle uses, call-in times, costs and unlock levels where current public references document them.
- Eagle Gas Airstrike keeps its currently undocumented call-in sequence/time explicitly unknown instead of guessing.
- Added community-reference links to every weapon, stratagem and armor detail dialog.
- Added range/warm-up/availability fields to weapon details when present.
- Added catalog sorting by name, verification state and acquisition source.
- Expanded mechanic/value localization so compound stats such as damage type, reload notes, currencies, ammunition terms and firing modes translate instead of remaining mostly English.
- Fixed conspicuously untranslated UI labels across the 14 interface locales.
- Player Builds and Player Tier Lists remain empty-by-default and manually authored only.
- Super Earth TV remains 1000 original generated transmissions per locale plus a few short classic lines.

### 2026-09-05 — Catalog/ticker data architecture update
- Moved all Super Earth TV ticker phrases into `assets/js/ticker.js` as editable locale data.
- Ticker cycles now shuffle each cycle without repeating a phrase until the full locale list is exhausted.
- Added stable IDs, localized display-name fields, and stratagem call-in code metadata to catalog records.
- Added stratagem call-in code filtering and category/permit filters; weapon/armor catalogs keep compact filters.
- Reused the existing local weapon, armor, and stratagem icon assets across cards and global search.
- Updated localization notes and added call-in filter wording for all 14 supported locales.

- Sector B: weapon database filters, sorting, two-item comparison UI, plus separate and robust Steam/Active Helldivers counters.

## Sector C
- Refined Stratagems catalog with quick category filters, code search, sorting, copy-code controls, richer detail modal and related entries.
- Added localized Sector C interface strings for all supported locales.
