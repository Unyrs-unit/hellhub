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

## HD2 request identity

The Worker now sends both headers expected by current community API clients:

- `X-Super-Client`: your Worker hostname
- `X-Super-Contact`: defaults to your public site URL

No extra setting is required for the fallback. If you want to provide a better public
contact (recommended), add a Cloudflare Worker variable named `HD2_CONTACT`, for example
`github/your-name` or a project contact email.

The health endpoint also includes a short upstream error body when HD2 returns a non-2xx
response, making future API changes easier to diagnose.
