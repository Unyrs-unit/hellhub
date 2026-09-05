const HD2_ORIGIN = 'https://api.helldivers2.dev/api';
const HD2_ALLOWED_ROOTS = new Set(['v1', 'v2', 'raw']);

function json(data, status = 200, cacheControl = 'no-store', extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': cacheControl,
      ...extraHeaders,
    },
  });
}

function hd2Headers(url, env, request = null) {
  // Keep the client ID simple and ASCII-only. The upstream docs use a domain
  // as their canonical example.
  const host = url.hostname.replace(/[^a-zA-Z0-9.-]/g, '').slice(0, 80);
  const contact = String(env?.HD2_CONTACT || `https://${host}`).slice(0, 180);

  const headers = {
    accept: 'application/json',
    'x-super-client': host || 'hellhub',
    'x-super-contact': contact,
  };

  // Preserve a simple locale only; don't forward a long browser language list.
  const language = request?.headers?.get('accept-language');
  if (language) {
    const simpleLanguage = language.split(',')[0].trim().slice(0, 24);
    if (simpleLanguage) headers['accept-language'] = simpleLanguage;
  }

  return headers;
}

async function proxyHd2(request, url, env) {
  if (request.method !== 'GET') {
    return json({ ok: false, error: 'Method not allowed' }, 405, 'no-store', { allow: 'GET' });
  }

  const prefix = '/api/hd2/';
  const rawPath = url.pathname.slice(prefix.length);
  const parts = rawPath.split('/').filter(Boolean);
  if (!parts.length || !HD2_ALLOWED_ROOTS.has(parts[0])) {
    return json({ ok: false, error: 'Unsupported HD2 API path' }, 404);
  }

  const target = new URL(`${HD2_ORIGIN}/${parts.map(encodeURIComponent).join('/')}`);
  url.searchParams.forEach((value, key) => target.searchParams.append(key, value));

  try {
    const upstream = await fetch(target.toString(), {
      headers: hd2Headers(url, env, request),
      cf: {
        cacheEverything: true,
        cacheTtl: 60,
      },
    });

    const headers = new Headers();
    headers.set('content-type', upstream.headers.get('content-type') || 'application/json; charset=utf-8');
    headers.set('cache-control', upstream.ok ? 'public, max-age=30, s-maxage=60, stale-while-revalidate=120' : 'no-store');
    headers.set('x-portal-upstream-status', String(upstream.status));

    for (const name of ['retry-after', 'x-ratelimit-limit', 'x-ratelimit-remaining']) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }

    return new Response(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    return json({
      ok: false,
      error: 'HD2 upstream request failed',
      detail: String(error?.message || error),
    }, 502);
  }
}

async function proxySteamNews(request) {
  if (request.method !== 'GET') {
    return json({ ok: false, error: 'Method not allowed' }, 405, 'no-store', { allow: 'GET' });
  }
  const target = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=553850&count=8&maxlength=420&format=json';
  try {
    const upstream = await fetch(target, { cf: { cacheEverything: true, cacheTtl: 300 } });
    if (!upstream.ok) return json({ ok: false, error: `Steam news ${upstream.status}` }, upstream.status);
    return new Response(await upstream.arrayBuffer(), {
      status: 200,
      headers: {
        'content-type': upstream.headers.get('content-type') || 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=120, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    return json({ ok: false, error: 'Steam news request failed', detail: String(error?.message || error) }, 502);
  }
}

async function proxySteamPlayers(request) {
  if (request.method !== 'GET') {
    return json({ ok: false, error: 'Method not allowed' }, 405, 'no-store', { allow: 'GET' });
  }
  const target = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=553850';
  try {
    const upstream = await fetch(target, { cf: { cacheEverything: true, cacheTtl: 60 } });
    if (!upstream.ok) return json({ ok: false, error: `Steam players ${upstream.status}` }, upstream.status);
    return new Response(await upstream.arrayBuffer(), {
      status: 200,
      headers: {
        'content-type': upstream.headers.get('content-type') || 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    return json({ ok: false, error: 'Steam players request failed', detail: String(error?.message || error) }, 502);
  }
}

async function health(request, url, env) {
  if (request.method !== 'GET') {
    return json({ ok: false, error: 'Method not allowed' }, 405, 'no-store', { allow: 'GET' });
  }

  const hd2Target = 'https://api.helldivers2.dev/api/v1/war';
  const steamTarget = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=553850';

  async function checkHd2() {
    try {
      const response = await fetch(hd2Target, {
        headers: hd2Headers(url, env),
        cf: { cacheEverything: true, cacheTtl: 30 },
      });

      let detail = null;
      if (!response.ok) {
        try {
          detail = (await response.text()).replace(/\s+/g, ' ').trim().slice(0, 500) || null;
        } catch {}
      }

      return {
        status: response.status,
        ...(detail ? { detail } : {}),
      };
    } catch (error) {
      return { status: 0, detail: String(error?.message || error).slice(0, 500) };
    }
  }

  async function checkSteam() {
    try {
      const response = await fetch(steamTarget, { cf: { cacheEverything: true, cacheTtl: 30 } });
      return { status: response.status };
    } catch (error) {
      return { status: 0, detail: String(error?.message || error).slice(0, 500) };
    }
  }

  const [hd2, steam] = await Promise.all([checkHd2(), checkSteam()]);

  return json({
    ok: hd2.status >= 200 && hd2.status < 400 && steam.status >= 200 && steam.status < 400,
    service: 'HELLDIVE-DB Cloudflare Worker proxy',
    runtime: 'workers-static-assets',
    hd2,
    steam,
    time: new Date().toISOString(),
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return health(request, url, env);
    }
    if (url.pathname.startsWith('/api/hd2/')) {
      return proxyHd2(request, url, env);
    }
    if (url.pathname === '/api/steam/news') {
      return proxySteamNews(request);
    }
    if (url.pathname === '/api/steam/players') {
      return proxySteamPlayers(request);
    }
    if (url.pathname.startsWith('/api/')) {
      return json({ ok: false, error: 'Unknown API route' }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};
