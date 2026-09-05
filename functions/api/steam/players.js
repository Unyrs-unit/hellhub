function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': status === 200 ? 'public, max-age=30, s-maxage=60, stale-while-revalidate=120' : 'no-store',
    },
  });
}

export async function onRequestGet() {
  const url = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=553850';
  try {
    const response = await fetch(url, { cf: { cacheEverything: true, cacheTtl: 60 } });
    if (!response.ok) return json({ ok: false, error: `Steam players ${response.status}` }, response.status);
    return new Response(await response.arrayBuffer(), {
      status: 200,
      headers: {
        'content-type': response.headers.get('content-type') || 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    return json({ ok: false, error: 'Steam players request failed', detail: String(error?.message || error) }, 502);
  }
}
