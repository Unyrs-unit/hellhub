window.HD2_API = (() => {
  // Browser -> same-origin Cloudflare Pages Function -> upstream API.
  // This avoids browser CORS problems and centralizes upstream caching/rate control.
  const BASE = './api/hd2';
  const TTL = 60_000;
  let chain = Promise.resolve();
  let last = 0;

  function cacheKey(path, lang) { return `hd2-api-v2:${lang}:${path}`; }
  function cached(path, lang) {
    try {
      const x = JSON.parse(localStorage.getItem(cacheKey(path, lang)));
      if (x && Date.now() - x.time < TTL) return x.data;
    } catch {}
    return null;
  }
  function store(path, lang, data) {
    try { localStorage.setItem(cacheKey(path, lang), JSON.stringify({ time: Date.now(), data })); } catch {}
  }
  function localeHeader() {
    const map = { 'es-419': 'es-LA', 'zh-CN': 'zh-Hans', 'zh-TW': 'zh-Hant' };
    return map[I18N.locale] || I18N.locale;
  }

  async function raw(path, { force = false } = {}) {
    const lang = localeHeader();
    if (!force) {
      const hit = cached(path, lang);
      if (hit !== null) return { data: hit, cached: true };
    }

    const job = async () => {
      // Keep the client gentle as well; the Worker provides the main shared cache.
      const gap = Date.now() - last;
      if (gap < 250) await new Promise(r => setTimeout(r, 250 - gap));
      last = Date.now();

      const res = await fetch(`${BASE}${path}`, {
        headers: { accept: 'application/json', 'accept-language': lang },
        cache: force ? 'reload' : 'default',
      });
      if (!res.ok) {
        let detail = '';
        try { detail = (await res.json())?.error || ''; } catch {}
        throw new Error(`API ${res.status}${detail ? `: ${detail}` : ''}`);
      }
      const data = await res.json();
      store(path, lang, data);
      return { data, cached: false };
    };

    chain = chain.then(job, job);
    return chain;
  }

  const call = (path, opts) => raw(path, opts);

  async function steamPlayers() {
    const r = await fetch('./api/steam/players', { headers: { accept: 'application/json' } });
    if (!r.ok) throw new Error(`Steam players ${r.status}`);
    return r.json();
  }

  async function steamOfficial() {
    try {
      const r = await fetch('./api/steam/news', { headers: { accept: 'application/json' } });
      if (!r.ok) throw new Error(`Steam ${r.status}`);
      return { data: await r.json(), cached: false, official: true };
    } catch (err) {
      return call('/v1/steam').then(x => ({ ...x, official: false }));
    }
  }

  async function health() {
    const r = await fetch('./api/health', { cache: 'no-store' });
    if (!r.ok) throw new Error(`Health ${r.status}`);
    return r.json();
  }

  return {
    war: o => call('/v1/war', o),
    planets: o => call('/v1/planets', o),
    campaigns: o => call('/v1/campaigns', o),
    assignments: o => call('/v1/assignments', o),
    dispatches: o => call('/v1/dispatches', o),
    events: o => call('/v1/planet-events', o),
    stations: o => call('/v2/space-stations', o),
    steam: steamOfficial,
    steamPlayers,
    health,
    base: BASE,
  };
})();
