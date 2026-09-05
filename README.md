# HellHub — Cloudflare Workers deployment

This package is configured for **Cloudflare Workers Builds**, matching a deployment command of:

```bash
npx wrangler deploy
```

## Repository structure

- `src/worker.js` — server-side API proxy
- `public/` — browser-visible static site
- `wrangler.jsonc` — Workers + Static Assets configuration

Do not move `src/worker.js` into `public/`.

## Cloudflare build settings

- Deploy command: `npx wrangler deploy`
- Root directory: repository root
- Worker name: `hellhub`

No custom build command is required for this static project.

## Tests after deployment

- `/api/health`
- `/api/hd2/v1/war`
- `/api/steam/players`
- `/api/steam/news`

`/api/health` should report `"runtime": "workers-static-assets"`.
