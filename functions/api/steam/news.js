function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': status === 200 ? 'public, max-age=120, s-maxage=300, stale-while-revalidate=600' : 'no-store',
    },
  });
}

export async function onRequestGet() {
  const url = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=553850&count=8&maxlength=420&format=json';
  try {
    const response = await fetch(url, { cf: { cacheEverything: true, cacheTtl: 300 } });
    if (!response.ok) return json({ ok: false, error: `Steam news ${response.status}` }, response.status);
    return new Response(await response.arrayBuffer(), {
      status: 200,
      headers: {
        'content-type': response.headers.get('content-type') || 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=120, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    return json({ ok: false, error: 'Steam news request failed', detail: String(error?.message || error) }, 502);
  }
}
