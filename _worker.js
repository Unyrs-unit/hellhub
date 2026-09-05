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

async function proxyHd2(request, url) {
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

  const language = request.headers.get('accept-language') || 'en-US';
  const host = url.hostname.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 80);

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        accept: 'application/json',
        'accept-language': language,
        'x-super-client': `HELLDIVE-DB ${host}`,
      },
      cf: {
        cacheEverything: true,
        cacheTtl: 60,
      },
    });

    const headers = new Headers();
    headers.set('content-type', upstream.headers.get('content-type') || 'application/json; charset=utf-8');
    headers.set('cache-control', upstream.ok ? 'public, max-age=30, s-maxage=60, stale-while-revalidate=120' : 'no-store');
    headers.set('x-portal-upstream-status', String(upstream.status));
    const retryAfter = upstream.headers.get('retry-after');
    if (retryAfter) headers.set('retry-after', retryAfter);

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

async function health(request, url) {
  if (request.method !== 'GET') {
    return json({ ok: false, error: 'Method not allowed' }, 405, 'no-store', { allow: 'GET' });
  }

  const hd2Target = 'https://api.helldivers2.dev/api/v1/war';
  const steamTarget = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=553850';
  const host = url.hostname.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 80);

  const checks = await Promise.allSettled([
    fetch(hd2Target, {
      headers: {
        accept: 'application/json',
        'x-super-client': `HELLDIVE-DB ${host}`,
      },
      cf: { cacheEverything: true, cacheTtl: 30 },
    }),
    fetch(steamTarget, { cf: { cacheEverything: true, cacheTtl: 30 } }),
  ]);

  const hd2 = checks[0].status === 'fulfilled' ? checks[0].value.status : 0;
  const steam = checks[1].status === 'fulfilled' ? checks[1].value.status : 0;

  return json({
    ok: hd2 >= 200 && hd2 < 500,
    service: 'HELLDIVE-DB Cloudflare Worker proxy',
    runtime: 'pages-advanced-mode',
    hd2: { status: hd2 },
    steam: { status: steam },
    time: new Date().toISOString(),
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return health(request, url);
    }
    if (url.pathname.startsWith('/api/hd2/')) {
      return proxyHd2(request, url);
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
