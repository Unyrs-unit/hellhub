const builds = [
  {
    title: "Bug Breach Eraser",
    purpose: "High-pressure Terminid control",
    faction: "Terminids",
    className: "terminid",
    difficulty: "Diff. 8–10",
    weapon: "Breaker Incendiary",
    armor: "CM-21 Trench Paramedic",
    stratagems: ["500", "GAS", "SEN", "QSR"],
    rating: "4.9",
    votes: "2.4k"
  },
  {
    title: "Steel Rain",
    purpose: "Anti-armor Automaton strike",
    faction: "Automatons",
    className: "automaton",
    difficulty: "Diff. 9–10",
    weapon: "Diligence Counter Sniper",
    armor: "FS-55 Devastator",
    stratagems: ["OBS", "120", "AC", "EMS"],
    rating: "4.8",
    votes: "1.8k"
  },
  {
    title: "Mobile Democracy",
    purpose: "Flexible squad all-rounder",
    faction: "Universal",
    className: "universal",
    difficulty: "Diff. 6–10",
    weapon: "Adjudicator",
    armor: "CE-27 Ground Breaker",
    stratagems: ["EGL", "RR", "OPS", "SHD"],
    rating: "4.7",
    votes: "3.1k"
  },
  {
    title: "Lone Diver",
    purpose: "Solo objectives & extraction",
    faction: "Universal",
    className: "universal",
    difficulty: "Diff. 7–9",
    weapon: "Sickle",
    armor: "SC-30 Trailblazer",
    stratagems: ["JMP", "LAS", "500", "SEN"],
    rating: "4.6",
    votes: "1.2k"
  }
];

const tierData = {
  "Weapons": {
    updated: "Community snapshot // Patch-ready structure",
    rows: {
      S: ["Recoilless Rifle", "Autocannon", "Quasar Cannon", "Grenade Launcher"],
      A: ["Railgun", "AMR", "Laser Cannon", "HMG"],
      B: ["Stalwart", "Machine Gun", "Arc Thrower"],
      C: ["Airburst Launcher", "Flamethrower"],
      D: ["Experimental slot"]
    }
  },
  "Stratagems": {
    updated: "Community snapshot // Mission utility",
    rows: {
      S: ["Eagle 500KG", "Orbital Precision", "Supply Pack", "Autocannon Sentry"],
      A: ["Eagle Airstrike", "Gas Strike", "Shield Pack", "Rocket Sentry"],
      B: ["Orbital Gatling", "EMS Mortar", "Guard Dog"],
      C: ["Smoke Strike", "Minefield"],
      D: ["Situational slot"]
    }
  },
  "Armor": {
    updated: "Community snapshot // Passive value",
    rows: {
      S: ["Med-Kit", "Fortified", "Extra Padding"],
      A: ["Engineering Kit", "Scout"],
      B: ["Servo-Assisted", "Peak Physique"],
      C: ["Electrical Conduit"],
      D: ["Highly situational"]
    }
  },
  "Primary Weapons": {
    updated: "Community snapshot // General missions",
    rows: {
      S: ["Breaker Incendiary", "Diligence CS", "Sickle"],
      A: ["Adjudicator", "Punisher Plasma", "Scorcher"],
      B: ["Liberator", "Tenderizer", "Blitzer"],
      C: ["Punisher", "Defender"],
      D: ["Niche picks"]
    }
  },
  "Secondary Weapons": {
    updated: "Community snapshot // Utility sidearms",
    rows: {
      S: ["Grenade Pistol", "Senator"],
      A: ["Verdict", "Redeemer"],
      B: ["Bushwhacker", "Dagger"],
      C: ["Peacemaker"],
      D: ["Mission-specific"]
    }
  }
};

const news = [
  {
    scene:"scene-1",
    category:"War Bulletin",
    date:"SEPT 05, 2026",
    title:"Major Order briefing: new operational priorities across the Galactic War",
    description:"A compact tactical summary format designed for future live-war feeds, patch notes and editorial updates."
  },
  {
    scene:"scene-2",
    category:"Guide",
    date:"SEPT 04, 2026",
    title:"How to build a balanced anti-Automaton squad",
    description:"Role coverage, anti-armor planning and stratagem overlap explained in one deployment-ready guide."
  },
  {
    scene:"scene-3",
    category:"Database",
    date:"SEPT 02, 2026",
    title:"Weapon comparison tables enter public terminal testing",
    description:"The prototype data layer is prepared for filters, sorting, ratings and patch history."
  }
];

const memes = [
  { copy:"CALLING IN A <span>STRATAGEM</span>", author:"@liberty_actual", votes:"8.7k approvals" },
  { copy:"EXTRACTION IN <span>20 SECONDS</span>", author:"@drop_pod_dad", votes:"6.2k approvals" },
  { copy:"FRIENDLY FIRE IS <span>VERY FRIENDLY</span>", author:"@managed_democracy", votes:"11.4k approvals" }
];

const searchIndex = [
  {type:"Database", title:"Weapons", desc:"Primary, secondary and support weapons", href:"#database", keywords:"guns primary secondary support"},
  {type:"Database", title:"Stratagems", desc:"Orbital, Eagle and support deployments", href:"#database", keywords:"orbital eagle sentry support"},
  {type:"Database", title:"Armor", desc:"Armor classes and passive bonuses", href:"#database", keywords:"heavy medium light passive"},
  {type:"Database", title:"Enemies", desc:"Threat profiles for battlefield factions", href:"#database", keywords:"terminids automatons bugs bots factions"},
  ...builds.map(x=>({type:"Build",title:x.title,desc:`${x.purpose} · ${x.faction}`,href:"#builds",keywords:`${x.weapon} ${x.armor} ${x.faction}`})),
  ...news.map(x=>({type:x.category,title:x.title,desc:x.description,href:"#news",keywords:x.description}))
];

function renderBuilds(){
  const root = document.querySelector("#buildGrid");
  root.innerHTML = builds.map(b => `
    <article class="build-card ${b.className}" data-searchable="${[
      b.title,b.purpose,b.faction,b.weapon,b.armor,...b.stratagems
    ].join(" ")}">
      <div class="build-card-top">
        <div class="build-meta-row">
          <span class="build-faction">${b.faction}</span>
          <span class="difficulty">${b.difficulty}</span>
        </div>
        <h3>${b.title}</h3>
        <p class="build-purpose">${b.purpose}</p>
      </div>
      <div class="build-body">
        <div class="loadout-block">
          <div class="loadout-label">PRIMARY WEAPON</div>
          <div class="item-row"><span class="item-chip accent">${b.weapon}</span></div>
        </div>
        <div class="loadout-block">
          <div class="loadout-label">ARMOR</div>
          <div class="item-row"><span class="item-chip">${b.armor}</span></div>
        </div>
        <div class="loadout-block">
          <div class="loadout-label">STRATAGEMS</div>
          <div class="stratagem-icons">
            ${b.stratagems.map(x=>`<span class="stratagem-icon" title="${x}">${x}</span>`).join("")}
          </div>
        </div>
        <div class="build-footer">
          <div class="rating"><span class="rating-star">★</span><strong>${b.rating}</strong><span>${b.votes}</span></div>
          <button class="view-build" type="button">View Build →</button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderTierTabs(){
  const tabs = document.querySelector("#tierTabs");
  tabs.innerHTML = Object.keys(tierData).map((name,i)=>`
    <button class="tier-tab ${i===0?"is-active":""}" type="button" role="tab"
      aria-selected="${i===0}" data-tier="${name}">${name}</button>
  `).join("");
  renderTierPanel(Object.keys(tierData)[0]);

  tabs.addEventListener("click",e=>{
    const btn = e.target.closest(".tier-tab");
    if(!btn) return;
    tabs.querySelectorAll(".tier-tab").forEach(x=>{
      x.classList.toggle("is-active",x===btn);
      x.setAttribute("aria-selected",x===btn ? "true":"false");
    });
    renderTierPanel(btn.dataset.tier);
  });
}

function renderTierPanel(name){
  const data=tierData[name];
  const ranks=["S","A","B","C","D"];
  document.querySelector("#tierPanel").innerHTML=`
    <div class="tier-header">
      <h3>${name.toUpperCase()} // FIELD RANKING</h3>
      <span>${data.updated}</span>
    </div>
    ${ranks.map(rank=>`
      <div class="tier-row">
        <div class="tier-rank rank-${rank.toLowerCase()}">${rank}</div>
        <div class="tier-items">${data.rows[rank].map(x=>`<span class="tier-item">${x}</span>`).join("")}</div>
      </div>
    `).join("")}
  `;
}

function renderNews(){
  document.querySelector("#newsGrid").innerHTML = news.map(n=>`
    <article class="news-card" data-searchable="${n.category} ${n.title} ${n.description}">
      <div class="news-visual">
        <div class="news-scene ${n.scene}"></div>
        <span class="news-scan">INTEL VERIFIED</span>
      </div>
      <div class="news-body">
        <div class="news-meta"><span class="news-category">${n.category}</span><span class="news-date">${n.date}</span></div>
        <h3>${n.title}</h3>
        <p>${n.description}</p>
      </div>
    </article>
  `).join("");
}

function renderMemes(){
  document.querySelector("#memeGrid").innerHTML = memes.map(m=>`
    <article class="meme-card">
      <div class="meme-visual"><div class="meme-copy">${m.copy}</div></div>
      <div class="meme-footer"><span>${m.author}</span><span class="vote">▲ ${m.votes}</span></div>
    </article>
  `).join("");
}

function setupMobileMenu(){
  const btn=document.querySelector(".menu-button");
  const panel=document.querySelector("[data-mobile-panel]");
  const close=()=>{
    btn.classList.remove("is-open");
    panel.classList.remove("is-open");
    btn.setAttribute("aria-expanded","false");
    document.body.classList.remove("menu-open");
  };
  btn.addEventListener("click",()=>{
    const open=!panel.classList.contains("is-open");
    panel.classList.toggle("is-open",open);
    btn.classList.toggle("is-open",open);
    btn.setAttribute("aria-expanded",String(open));
    document.body.classList.toggle("menu-open",open);
  });
  panel.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));
  window.addEventListener("resize",()=>{if(window.innerWidth>920)close()});
}

function setupSearch(){
  const modal=document.querySelector("[data-search-modal]");
  const input=document.querySelector("#globalSearch");
  const results=document.querySelector("#searchResults");
  const count=document.querySelector("#resultCount");

  function render(q=""){
    const query=q.trim().toLowerCase();
    const filtered=(query ? searchIndex.filter(item =>
      `${item.title} ${item.desc} ${item.keywords}`.toLowerCase().includes(query)
    ) : searchIndex.slice(0,7));
    count.textContent=`${filtered.length} result${filtered.length===1?"":"s"}`;
    results.innerHTML=filtered.length ? filtered.map(item=>`
      <a class="search-result" href="${item.href}" data-result-link>
        <div><strong>${item.title}</strong><span>${item.desc}</span></div><b>${item.type.toUpperCase()}</b>
      </a>
    `).join("") : `<div class="empty-search">No matching terminal records.</div>`;
  }
  function open(){
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("search-open");
    render("");
    setTimeout(()=>input.focus(),50);
  }
  function close(){
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("search-open");
    input.value="";
  }

  document.querySelectorAll(".search-trigger").forEach(b=>b.addEventListener("click",open));
  document.querySelectorAll("[data-close-search]").forEach(b=>b.addEventListener("click",close));
  input.addEventListener("input",()=>render(input.value));
  results.addEventListener("click",e=>{if(e.target.closest("[data-result-link]"))close()});
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape") close();
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();open();}
  });
}

function setupDemoLinks(){
  document.querySelectorAll('a[href="#"]').forEach(a=>{
    a.addEventListener("click",e=>e.preventDefault());
  });
  document.querySelectorAll(".view-build").forEach(btn=>{
    btn.addEventListener("click",()=>{
      btn.textContent="Build preview ready ✓";
      setTimeout(()=>btn.textContent="View Build →",1400);
    });
  });
}

renderBuilds();
renderTierTabs();
renderNews();
renderMemes();
setupMobileMenu();
setupSearch();
setupDemoLinks();
