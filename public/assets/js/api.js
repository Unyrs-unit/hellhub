window.HD2_API = (() => {
  const BASE = '/api/hd2';
  const TTL = 60_000;
  const STALE_TTL = 30 * 60_000;
  let chain = Promise.resolve();
  let last = 0;

  function cacheKey(path, lang) { return `hd2-api-v4:${lang}:${path}`; }
  function readCache(path, lang, allowStale = false) {
    try {
      const x = JSON.parse(localStorage.getItem(cacheKey(path, lang)));
      if (!x) return null;
      const age = Date.now() - x.time;
      if (age < (allowStale ? STALE_TTL : TTL)) return { data: x.data, age };
    } catch {}
    return null;
  }
  function store(path, lang, data) {
    try { localStorage.setItem(cacheKey(path, lang), JSON.stringify({ time: Date.now(), data })); } catch {}
  }

  function localeHeader() {
    const map = {
      en: 'en-US', fr: 'fr-FR', it: 'it-IT', de: 'de-DE',
      'es-ES': 'es-ES', 'es-419': 'es-ES',
      'pt-BR': 'pt-BR', 'pt-PT': 'pt-PT', ru: 'ru-RU', pl: 'pl-PL',
      ja: 'ja-JP', ko: 'ko-KO', 'zh-CN': 'zh-Hans', 'zh-TW': 'zh-Hant',
    };
    return map[I18N.locale] || 'en-US';
  }

  async function fetchJson(url, options = {}, timeout = 14000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      if (!res.ok) {
        let detail = '';
        try {
          const body = await res.clone().json();
          detail = body?.detail || body?.error || body?.message || '';
        } catch {
          try { detail = (await res.text()).slice(0, 240); } catch {}
        }
        throw new Error(`API ${res.status}${detail ? `: ${detail}` : ''}`);
      }
      return res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  async function raw(path, { force = false } = {}) {
    const lang = localeHeader();
    if (!force) {
      const hit = readCache(path, lang, false);
      if (hit) return { data: hit.data, cached: true, stale: false };
    }

    const job = async () => {
      const gap = Date.now() - last;
      if (gap < 350) await new Promise(r => setTimeout(r, 350 - gap));
      last = Date.now();
      try {
        const data = await fetchJson(`${BASE}${path}`, {
          headers: { accept: 'application/json', 'accept-language': lang },
          cache: force ? 'reload' : 'default',
        });
        store(path, lang, data);
        return { data, cached: false, stale: false };
      } catch (error) {
        const stale = readCache(path, lang, true);
        if (stale) return { data: stale.data, cached: true, stale: true, error };
        throw error;
      }
    };

    chain = chain.then(job, job);
    return chain;
  }

  const call = (path, opts) => raw(path, opts);

  async function steamPlayers() {
    return fetchJson('/api/steam/players', { headers: { accept: 'application/json' } });
  }

  async function steamOfficial() {
    try {
      const data = await fetchJson('/api/steam/news', { headers: { accept: 'application/json' } });
      return { data, cached: false, official: true };
    } catch (err) {
      return call('/v1/steam').then(x => ({ ...x, official: false }));
    }
  }

  async function health() {
    return fetchJson('/api/health', { cache: 'no-store' }, 10000);
  }

  return {
    war: o => call('/v1/war', o),
    playerCount: o => call('/v1/player-count', o),
    warStats: o => call('/v1/war-stats', o),
    planets: o => call('/v1/planets', o),
    sectors: o => call('/v1/sectors', o),
    factions: o => call('/v1/factions', o),
    majorOrders: o => call('/v1/historical-major-orders?limit=50', o),
    historicalDispatches: o => call('/v1/historical-dispatches?limit=50', o),
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
