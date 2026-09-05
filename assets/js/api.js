window.HD2_API = (() => {
  const BASE='https://api.helldivers2.dev';
  const CLIENT='HELLDIVE-DB GitHub Pages';
  const TTL=60_000;
  let chain=Promise.resolve();
  let last=0;
  function cacheKey(path,lang){return `hd2-api:${lang}:${path}`}
  function cached(path,lang){try{const x=JSON.parse(localStorage.getItem(cacheKey(path,lang)));if(x && Date.now()-x.time<TTL)return x.data}catch{}return null}
  function store(path,lang,data){try{localStorage.setItem(cacheKey(path,lang),JSON.stringify({time:Date.now(),data}))}catch{}}
  function localeHeader(){ const map={"es-419":"es-LA","zh-CN":"zh-Hans","zh-TW":"zh-Hant"}; return map[I18N.locale]||I18N.locale; }
  async function raw(path,{force=false}={}){
    const lang=localeHeader();
    if(!force){const hit=cached(path,lang);if(hit!==null)return {data:hit,cached:true};}
    const job=async()=>{
      const gap=Date.now()-last;if(gap<2100)await new Promise(r=>setTimeout(r,2100-gap));last=Date.now();
      let res;
      try{res=await fetch(BASE+path,{headers:{'Accept':'application/json','Accept-Language':lang,'X-Super-Client':CLIENT}})}catch(firstError){
        const sep=path.includes('?')?'&':'?';
        res=await fetch(BASE+path+sep+'X-Super-Client='+encodeURIComponent(CLIENT),{headers:{'Accept':'application/json','Accept-Language':lang}});
      }
      if(!res.ok)throw new Error(`API ${res.status}`);
      const data=await res.json();store(path,lang,data);return {data,cached:false};
    };
    chain=chain.then(job,job);return chain;
  }
  const call=(path,opts)=>raw(path,opts);
  const steamPlayers=async()=>{const url='https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=553850';const r=await fetch(url);if(!r.ok)throw new Error('Steam players '+r.status);return r.json()};
  const steamOfficial=async()=>{
    const url='https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=553850&count=8&maxlength=420&format=json';
    try{const r=await fetch(url);if(!r.ok)throw new Error('Steam '+r.status);return {data:await r.json(),cached:false,official:true}}catch(err){return call('/api/v1/steam').then(x=>({...x,official:false}));}
  };
  return {
    war:o=>call('/api/v1/war',o),planets:o=>call('/api/v1/planets',o),campaigns:o=>call('/api/v1/campaigns',o),
    assignments:o=>call('/api/v1/assignments',o),dispatches:o=>call('/api/v1/dispatches',o),events:o=>call('/api/v1/planet-events',o),
    stations:o=>call('/api/v2/space-stations',o),steam:steamOfficial,steamPlayers,base:BASE
  };
})();