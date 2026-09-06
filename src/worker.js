const HD2_ORIGIN = 'https://api.helldivers2.dev/api';
const HD2_ALLOWED_ROOTS = new Set(['v1', 'v2', 'raw']);
const WIKI_ORIGIN = 'https://helldivers.wiki.gg';
const HD2_STATS_ORIGIN = 'https://helldiversstats.com/api/v1';
const HD2_STATS_PRIMARY = new Set([
  'war', 'planets', 'player-count', 'war-stats', 'sectors', 'factions',
  'historical-major-orders', 'historical-dispatches',
]);

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

function cleanAscii(value, max = 160) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '')
    .trim()
    .slice(0, max);
}

function hd2Identity(url, env) {
  const host = cleanAscii(url.hostname, 80).replace(/[^a-zA-Z0-9.-]/g, '') || 'hellhub';
  const client = cleanAscii(env?.HD2_CLIENT || host, 80) || 'hellhub';
  const contact = cleanAscii(env?.HD2_CONTACT || `https://${host}`, 160) || `https://${host}`;
  return { client, contact };
}

function hd2Headers(url, env, request = null) {
  const { client, contact } = hd2Identity(url, env);
  const headers = {
    accept: 'application/json',
    'x-super-client': client,
    'x-super-contact': contact,
  };

  const language = request?.headers?.get('accept-language');
  if (language) {
    const simpleLanguage = cleanAscii(language.split(',')[0], 24);
    if (simpleLanguage) headers['accept-language'] = simpleLanguage;
  }
  return headers;
}


async function fetchWithTimeout(resource, init = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort('timeout'), timeoutMs);
  try {
    return await fetch(resource, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchHd2(target, headers) {
  let response = await fetchWithTimeout(target.toString(), {
    headers,
    cf: { cacheEverything: true, cacheTtl: 60 },
  });

  if (response.status === 429) {
    const wait = Math.min(2500, Math.max(250, Number(response.headers.get('retry-after') || 1) * 1000));
    await new Promise(resolve => setTimeout(resolve, wait));
    response = await fetchWithTimeout(target.toString(), {
      headers,
      cf: { cacheEverything: true, cacheTtl: 60 },
    });
  }
  return response;
}


async function fetchStatsPath(path, requestUrl = null) {
  const cleanPath = String(path || '').replace(/^\/+/, '');
  if (!cleanPath || cleanPath.includes('..')) return null;
  const target = new URL(`${HD2_STATS_ORIGIN}/${cleanPath}`);
  if (requestUrl) requestUrl.searchParams.forEach((value, key) => target.searchParams.append(key, value));

  const root = cleanPath.split('/')[0];
  const cacheTtl = root === 'planets' || root === 'sectors' || root === 'factions'
    ? 3600
    : root === 'war'
      ? 30
      : root === 'historical-major-orders' || root === 'historical-dispatches'
        ? 60
        : 15;

  try {
    return await fetchWithTimeout(target.toString(), {
      headers: { accept: 'application/json', 'user-agent': 'HELLDIVE-DB/1.0' },
      cf: {
        cacheEverything: root !== 'player-count' && root !== 'war-stats',
        cacheTtl,
      },
    }, 12000);
  } catch {
    return null;
  }
}

async function fetchStatsFallback(kind) {
  const map = {
    war: 'war',
    planets: 'planets',
    playerCount: 'player-count',
    warStats: 'war-stats',
  };
  const path = map[kind];
  return path ? fetchStatsPath(path) : null;
}

async function statsFallbackResponse(kind) {
  // helldiversstats.com has a documented, keyless public read API. We only
  // use it when the preferred community API is unavailable.
  if (kind === 'planets') {
    let response = await fetchStatsFallback('planets');
    if (response?.ok) return response;
    response = await fetchStatsFallback('war');
    if (!response?.ok) return null;
    try {
      const payload = await response.json();
      return json(Array.isArray(payload?.planets) ? payload.planets : [], 200,
        'public, max-age=300, s-maxage=1800, stale-while-revalidate=3600',
        { 'x-portal-upstream': 'helldiversstats.com' });
    } catch {
      return null;
    }
  }
  return fetchStatsFallback(kind);
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
    let upstream;
    let source;

    // WarStatus data is served from Helldivers Stats first. Its public read API
    // is intentionally exposed for consumer sites and has a stable /war,
    // /planets, /player-count, /war-stats and static lookup/archive surface. The community wrapper is
    // retained for the richer endpoints (assignments, dispatches, campaigns,
    // events, stations) and as a fallback for war/planets.
    if (parts[0] === 'v1' && HD2_STATS_PRIMARY.has(parts[1])) {
      const statsPath = parts.slice(1).join('/');
      upstream = await fetchStatsPath(statsPath, url);
      source = 'helldiversstats.com';

      // The community wrapper is retained as a narrow fallback only for routes
      // it also exposes. Historical archive routes intentionally stay on the
      // Helldivers Stats public API instead of becoming an accidental open proxy.
      if ((!upstream || !upstream.ok) && ['war', 'planets'].includes(parts[1])) {
        upstream = await fetchHd2(target, hd2Headers(url, env, request));
        source = 'api.helldivers2.dev';
      }
      if (!upstream) return json({ ok: false, error: 'War data upstream unavailable' }, 502);
    } else {
      upstream = await fetchHd2(target, hd2Headers(url, env, request));
      source = 'api.helldivers2.dev';
    }

    const headers = new Headers();
    headers.set('content-type', upstream.headers.get('content-type') || 'application/json; charset=utf-8');
    headers.set('cache-control', upstream.ok ? 'public, max-age=30, s-maxage=60, stale-while-revalidate=180' : 'no-store');
    headers.set('x-portal-upstream-status', String(upstream.status));
    headers.set('x-portal-upstream', source);
    for (const name of ['retry-after', 'x-ratelimit-limit', 'x-ratelimit-remaining']) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }
    return new Response(await upstream.arrayBuffer(), { status: upstream.status, headers });
  } catch (error) {
    return json({
      ok: false,
      error: 'HD2 upstream request failed',
      detail: String(error?.message || error),
    }, 502);
  }
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&#(\d+);/g, (_, n) => { try { return String.fromCodePoint(Number(n)); } catch { return ''; } })
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => { try { return String.fromCodePoint(parseInt(n, 16)); } catch { return ''; } })
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractMetaImage(html) {
  const patterns = [
    /<meta[^>]+(?:property|name)=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image(?::secure_url)?["'][^>]*>/i,
    /<meta[^>]+(?:property|name)=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']twitter:image["'][^>]*>/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeHtml(m[1]);
  }
  return '';
}

function wikiPageUrl(title) {
  const normalized = String(title || '').trim().replace(/\s+/g, '_').slice(0, 180);
  const encoded = encodeURIComponent(normalized).replace(/%2F/gi, '/');
  return `${WIKI_ORIGIN}/wiki/${encoded}`;
}


function stripWikiHtml(value) {
  return decodeHtml(String(value || ''))
    .replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/gi, ' ')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' · ')
    .replace(/<li\b[^>]*>/gi, ' · ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/(?:\s*·\s*){2,}/g, ' · ')
    .trim();
}

function wikiInfoRows(html) {
  const source = String(html || '');
  const scopes = [];
  const portable = source.match(/<aside\b[^>]*class=["'][^"']*(?:portable-infobox|infobox)[^"']*["'][^>]*>[\s\S]*?<\/aside>/i);
  const table = source.match(/<table\b[^>]*class=["'][^"']*(?:infobox|template-infobox)[^"']*["'][^>]*>[\s\S]*?<\/table>/i);
  if (portable) scopes.push(portable[0]);
  if (table) scopes.push(table[0]);
  if (!scopes.length) scopes.push(source.slice(0, 180000));
  const rows = [], seen = new Set();
  const add = (labelHtml, valueHtml) => {
    const label = stripWikiHtml(labelHtml).replace(/:$/, '').trim().slice(0, 90);
    const value = stripWikiHtml(valueHtml).trim().slice(0, 360);
    const key = label.toLowerCase();
    if (!label || !value || label === value || seen.has(key) || /^(contents?|navigation)$/i.test(label)) return;
    if (label.length > 90 || value.length > 360) return;
    seen.add(key); rows.push({ label, value });
  };
  for (const scope of scopes) {
    let m;
    const portableRe = /<h3\b[^>]*class=["'][^"']*pi-data-label[^"']*["'][^>]*>([\s\S]*?)<\/h3>\s*<div\b[^>]*class=["'][^"']*pi-data-value[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
    while ((m = portableRe.exec(scope)) && rows.length < 32) add(m[1], m[2]);
    const tableRe = /<tr\b[^>]*>[\s\S]*?<th\b[^>]*>([\s\S]*?)<\/th>[\s\S]*?<td\b[^>]*>([\s\S]*?)<\/td>[\s\S]*?<\/tr>/gi;
    while ((m = tableRe.exec(scope)) && rows.length < 32) add(m[1], m[2]);
  }
  return rows.slice(0, 32);
}

async function wikiQueryPage(candidateTitle) {
  const api = new URL(`${WIKI_ORIGIN}/api.php`);
  api.searchParams.set('action', 'query');
  api.searchParams.set('prop', 'extracts|revisions');
  api.searchParams.set('exintro', '1');
  api.searchParams.set('explaintext', '1');
  api.searchParams.set('exchars', '1800');
  api.searchParams.set('rvprop', 'ids|timestamp');
  api.searchParams.set('titles', candidateTitle);
  api.searchParams.set('redirects', '1');
  api.searchParams.set('format', 'json');
  const res = await fetchWithTimeout(api.toString(), {
    headers: { accept: 'application/json', 'user-agent': 'HELLDIVE-DB/1.0' },
    cf: { cacheEverything: true, cacheTtl: 86400 },
  }, 10000);
  if (!res.ok) return null;
  const payload = await res.json();
  const page = Object.values(payload?.query?.pages || {})[0];
  return page && !page.missing ? page : null;
}

async function wikiSearchTitle(query) {
  const api = new URL(`${WIKI_ORIGIN}/api.php`);
  api.searchParams.set('action', 'query');
  api.searchParams.set('list', 'search');
  api.searchParams.set('srsearch', query);
  api.searchParams.set('srnamespace', '0');
  api.searchParams.set('srlimit', '1');
  api.searchParams.set('format', 'json');
  const res = await fetchWithTimeout(api.toString(), {
    headers: { accept: 'application/json', 'user-agent': 'HELLDIVE-DB/1.0' },
    cf: { cacheEverything: true, cacheTtl: 86400 },
  }, 9000);
  if (!res.ok) return '';
  const payload = await res.json();
  return payload?.query?.search?.[0]?.title || '';
}

async function proxyWikiItem(request, url) {
  if (request.method !== 'GET') return json({ ok: false, error: 'Method not allowed' }, 405, 'no-store', { allow: 'GET' });
  const title = String(url.searchParams.get('title') || '').trim();
  if (!title || title.length > 180) return json({ ok: false, error: 'Missing item title' }, 400);
  try {
    let page = await wikiQueryPage(title);
    if (!page) {
      const found = await wikiSearchTitle(title);
      if (found) page = await wikiQueryPage(found);
    }
    if (!page) return json({ ok: false, error: 'Wiki item not found' }, 404, 'public, max-age=1800');
    const resolvedTitle = page.title || title;
    let rows = [];
    try {
      const parseApi = new URL(`${WIKI_ORIGIN}/api.php`);
      parseApi.searchParams.set('action', 'parse');
      parseApi.searchParams.set('page', resolvedTitle);
      parseApi.searchParams.set('prop', 'text');
      parseApi.searchParams.set('format', 'json');
      parseApi.searchParams.set('formatversion', '2');
      const parsed = await fetchWithTimeout(parseApi.toString(), {
        headers: { accept: 'application/json', 'user-agent': 'HELLDIVE-DB/1.0' },
        cf: { cacheEverything: true, cacheTtl: 86400 },
      }, 12000);
      if (parsed.ok) rows = wikiInfoRows((await parsed.json())?.parse?.text || '');
    } catch {}
    return json({
      ok: true,
      title: resolvedTitle,
      pageUrl: wikiPageUrl(resolvedTitle),
      summary: String(page.extract || '').replace(/\s+/g, ' ').trim().slice(0, 1800),
      updatedAt: page.revisions?.[0]?.timestamp || null,
      revisionId: page.revisions?.[0]?.revid || null,
      rows,
      source: 'helldivers.wiki.gg',
    }, 200, 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=172800');
  } catch (error) {
    return json({ ok: false, error: 'Wiki item lookup failed', detail: String(error?.message || error) }, 502);
  }
}

async function proxyWikiImage(request, url) {
  if (request.method !== 'GET') {
    return json({ ok: false, error: 'Method not allowed' }, 405, 'no-store', { allow: 'GET' });
  }
  const title = String(url.searchParams.get('title') || '').trim();
  if (!title || title.length > 180) return json({ ok: false, error: 'Missing image title' }, 400);

  async function resolveImage(candidateTitle) {
    const api = new URL(`${WIKI_ORIGIN}/api.php`);
    api.searchParams.set('action', 'query');
    api.searchParams.set('prop', 'pageimages');
    api.searchParams.set('piprop', 'original|thumbnail');
    api.searchParams.set('pithumbsize', '768');
    api.searchParams.set('titles', candidateTitle);
    api.searchParams.set('redirects', '1');
    api.searchParams.set('format', 'json');
    const res = await fetchWithTimeout(api.toString(), {
      headers: { accept: 'application/json' },
      cf: { cacheEverything: true, cacheTtl: 86400 },
    }, 10000);
    if (!res.ok) return '';
    const payload = await res.json();
    const page = Object.values(payload?.query?.pages || {})[0];
    return page?.original?.source || page?.thumbnail?.source || '';
  }

  async function resolveMetaImage(candidateTitle) {
    if (!candidateTitle) return '';
    const page = wikiPageUrl(candidateTitle);
    const res = await fetchWithTimeout(page, {
      headers: { accept: 'text/html,application/xhtml+xml' },
      cf: { cacheEverything: true, cacheTtl: 86400 },
    }, 10000);
    if (!res.ok) return '';
    const html = await res.text();
    return extractMetaImage(html);
  }

  async function searchTitle(query) {
    const api = new URL(`${WIKI_ORIGIN}/api.php`);
    api.searchParams.set('action', 'query');
    api.searchParams.set('list', 'search');
    api.searchParams.set('srsearch', query);
    api.searchParams.set('srnamespace', '0');
    api.searchParams.set('srlimit', '1');
    api.searchParams.set('format', 'json');
    const res = await fetchWithTimeout(api.toString(), {
      headers: { accept: 'application/json' },
      cf: { cacheEverything: true, cacheTtl: 86400 },
    }, 9000);
    if (!res.ok) return '';
    const payload = await res.json();
    return payload?.query?.search?.[0]?.title || '';
  }

  try {
    let resolvedTitle = '';
    let rawImage = await resolveImage(title);
    if (!rawImage) {
      resolvedTitle = await searchTitle(title);
      if (resolvedTitle) rawImage = await resolveImage(resolvedTitle);
    }
    // Some wiki pages do not expose PageImages consistently. Fall back to the
    // page's OpenGraph image before giving up, while still proxying/caching it
    // through this Worker rather than exposing a third-party hotlink directly.
    if (!rawImage) rawImage = await resolveMetaImage(resolvedTitle || title);
    if (!rawImage) return json({ ok: false, error: 'No item image found' }, 404, 'public, max-age=3600');

    const imageUrl = new URL(rawImage, WIKI_ORIGIN);
    const allowed = imageUrl.protocol === 'https:' && (
      imageUrl.hostname === 'helldivers.wiki.gg' ||
      imageUrl.hostname.endsWith('.wiki.gg') ||
      imageUrl.hostname === 'static.wikitide.net' ||
      imageUrl.hostname.endsWith('.wikitide.net')
    );
    if (!allowed) return json({ ok: false, error: 'Unsupported image host' }, 403);

    const img = await fetchWithTimeout(imageUrl.toString(), {
      headers: { accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8' },
      cf: { cacheEverything: true, cacheTtl: 604800 },
    }, 12000);
    if (!img.ok) return json({ ok: false, error: 'Image upstream unavailable', status: img.status }, 404, 'public, max-age=1800');

    const contentType = img.headers.get('content-type') || 'image/webp';
    if (!contentType.startsWith('image/')) return json({ ok: false, error: 'Resolved resource is not an image' }, 415);
    return new Response(await img.arrayBuffer(), {
      status: 200,
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800',
        'x-image-source': 'helldivers.wiki.gg',
      },
    });
  } catch (error) {
    return json({ ok: false, error: 'Image lookup failed', detail: String(error?.message || error) }, 502);
  }
}

async function proxySteamNews(request) {
  if (request.method !== 'GET') return json({ ok: false, error: 'Method not allowed' }, 405, 'no-store', { allow: 'GET' });
  const target = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=553850&count=10&maxlength=1800&format=json';
  try {
    const upstream = await fetchWithTimeout(target, { cf: { cacheEverything: true, cacheTtl: 300 } });
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
  if (request.method !== 'GET') return json({ ok: false, error: 'Method not allowed' }, 405, 'no-store', { allow: 'GET' });
  const target = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=553850';
  try {
    const upstream = await fetchWithTimeout(target, { cf: { cacheEverything: true, cacheTtl: 60 } });
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
  if (request.method !== 'GET') return json({ ok: false, error: 'Method not allowed' }, 405, 'no-store', { allow: 'GET' });

  const communityTarget = new URL(`${HD2_ORIGIN}/v1/dispatches`);
  const steamTarget = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=553850';

  async function checkWarSource() {
    try {
      const response = await fetchStatsFallback('war');
      let detail = null;
      if (!response?.ok) {
        try { detail = (await response?.text()).replace(/\s+/g, ' ').trim().slice(0, 500) || null; } catch {}
      }
      return { source: 'helldiversstats.com', status: response?.status || 0, ...(detail ? { detail } : {}) };
    } catch (error) {
      return { source: 'helldiversstats.com', status: 0, detail: String(error?.message || error).slice(0, 500) };
    }
  }

  async function checkCommunitySource() {
    try {
      const response = await fetchHd2(communityTarget, hd2Headers(url, env));
      let detail = null;
      if (!response.ok) {
        try { detail = (await response.text()).replace(/\s+/g, ' ').trim().slice(0, 500) || null; } catch {}
      }
      return { source: 'api.helldivers2.dev', status: response.status, ...(detail ? { detail } : {}) };
    } catch (error) {
      return { source: 'api.helldivers2.dev', status: 0, detail: String(error?.message || error).slice(0, 500) };
    }
  }

  async function checkSteam() {
    try {
      const response = await fetchWithTimeout(steamTarget, { cf: { cacheEverything: true, cacheTtl: 30 } });
      return { source: 'Steam Web API', status: response.status };
    } catch (error) {
      return { source: 'Steam Web API', status: 0, detail: String(error?.message || error).slice(0, 500) };
    }
  }

  const [war, community, steam] = await Promise.all([checkWarSource(), checkCommunitySource(), checkSteam()]);
  const warOk = war.status >= 200 && war.status < 400;
  const communityOk = community.status >= 200 && community.status < 400;
  const steamOk = steam.status >= 200 && steam.status < 400;
  return json({
    ok: warOk && steamOk,
    degraded: !communityOk,
    service: 'HELLDIVE-DB Cloudflare Worker proxy',
    runtime: 'workers-static-assets',
    hd2: { war, community },
    steam,
    time: new Date().toISOString(),
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') return health(request, url, env);
    if (url.pathname.startsWith('/api/hd2/')) return proxyHd2(request, url, env);
    if (url.pathname === '/api/wiki/image') return proxyWikiImage(request, url);
    if (url.pathname === '/api/wiki/item') return proxyWikiItem(request, url);
    if (url.pathname === '/api/steam/news') return proxySteamNews(request);
    if (url.pathname === '/api/steam/players') return proxySteamPlayers(request);
    if (url.pathname.startsWith('/api/')) return json({ ok: false, error: 'Unknown API route' }, 404);
    return env.ASSETS.fetch(request);
  },
};
