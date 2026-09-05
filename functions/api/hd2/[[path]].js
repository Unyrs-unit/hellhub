const HD2_ORIGIN = 'https://api.helldivers2.dev/api';
const ALLOWED_ROOTS = new Set([
  'v1',
  'v2',
  'raw'
]);

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': status === 200 ? 'public, max-age=30, s-maxage=60, stale-while-revalidate=120' : 'no-store',
      ...extraHeaders,
    },
  });
}

export async function onRequestGet(context) {
  const { request, params } = context;
  const parts = Array.isArray(params.path) ? params.path : [params.path].filter(Boolean);
  if (!parts.length || !ALLOWED_ROOTS.has(parts[0])) {
    return json({ ok: false, error: 'Unsupported HD2 API path' }, 404);
  }

  const incoming = new URL(request.url);
  const target = new URL(`${HD2_ORIGIN}/${parts.map(encodeURIComponent).join('/')}`);
  incoming.searchParams.forEach((value, key) => target.searchParams.append(key, value));

  const language = request.headers.get('accept-language') || 'en-US';
  const host = incoming.hostname.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 80);
  const upstreamRequest = new Request(target.toString(), {
    method: 'GET',
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

  try {
    const upstream = await fetch(upstreamRequest);
    const body = await upstream.arrayBuffer();
    const headers = new Headers();
    headers.set('content-type', upstream.headers.get('content-type') || 'application/json; charset=utf-8');
    headers.set('cache-control', upstream.ok ? 'public, max-age=30, s-maxage=60, stale-while-revalidate=120' : 'no-store');
    headers.set('x-portal-upstream-status', String(upstream.status));
    const retryAfter = upstream.headers.get('retry-after');
    if (retryAfter) headers.set('retry-after', retryAfter);
    return new Response(body, { status: upstream.status, headers });
  } catch (error) {
    return json({ ok: false, error: 'HD2 upstream request failed', detail: String(error?.message || error) }, 502);
  }
}

export function onRequest(context) {
  return json({ ok: false, error: 'Method not allowed' }, 405, { allow: 'GET' });
}
