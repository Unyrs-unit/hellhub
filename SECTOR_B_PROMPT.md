# SECTOR B — WEAPON DATABASE

Continue from the current HELLDIVE//DB project. Do not rebuild the site or replace the visual identity.

Focus this stage on the Weapons section and keep the changes incremental.

## Weapons
- Improve the weapon catalog into a practical database.
- Keep the existing dark military-sci-fi design.
- Add compact filters for slot, weapon type and penetration.
- Add sorting by name, verification, damage, fire rate, capacity and source.
- Keep weapon icons and localized names.
- Preserve stable weapon IDs.
- Keep the existing detailed weapon modal.
- Add a two-weapon comparison workflow: select up to two weapons, then open a side-by-side comparison for damage, fire rate, penetration, capacity, spare ammo, recoil, ergonomics and reload.
- Do not add unrelated new sections.

## Live counters fix
The homepage must keep these as two separate metrics:
- STEAM ONLINE = Steam Web API current player count.
- ACTIVE HELLDIVERS = the live Helldivers count calculated from current Galactic War planet player counts when the API does not expose a direct total.

Each metric must have its own DOM target and its own localized label. Do not write both values into the same element. If live data is unavailable, show a clear unavailable state rather than silently showing the other metric.

## Robustness
- The code must handle the current community API response shapes, including a planet-status array with `players` values.
- Keep the existing same-origin Cloudflare Worker proxy.
- Do not introduce fake data or a second API system.
- Keep mobile layout clean and avoid horizontal overflow.
