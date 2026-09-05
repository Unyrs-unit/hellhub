window.HD2_DATA = {
  weapons: [
    {name:"AR-23 Liberator",type:"Assault Rifle",slot:"Primary",role:"Balanced",tags:["Automatic","Generalist"],desc:"A flexible baseline rifle for mixed engagements."},
    {name:"R-63 Diligence",type:"Marksman Rifle",slot:"Primary",role:"Precision",tags:["Semi-auto","Range"],desc:"Precision-oriented primary for controlled shots."},
    {name:"R-36 Eruptor",type:"Explosive Rifle",slot:"Primary",role:"Demolition",tags:["Explosive","Utility"],desc:"Heavy primary focused on explosive utility."},
    {name:"SG-225 Breaker",type:"Shotgun",slot:"Primary",role:"Close range",tags:["Burst","Close"],desc:"High-output shotgun for aggressive close engagements."},
    {name:"LAS-16 Sickle",type:"Energy Rifle",slot:"Primary",role:"Sustain",tags:["Energy","Heat"],desc:"Heat-based automatic weapon with strong sustained utility."},
    {name:"JAR-5 Dominator",type:"Explosive Rifle",slot:"Primary",role:"Medium armor",tags:["Heavy","Stagger"],desc:"Hard-hitting primary for tougher targets."},
    {name:"P-4 Senator",type:"Revolver",slot:"Secondary",role:"Heavy sidearm",tags:["Sidearm","Precision"],desc:"High-impact sidearm with deliberate handling."},
    {name:"GP-31 Grenade Pistol",type:"Utility Sidearm",slot:"Secondary",role:"Utility",tags:["Explosive","Objectives"],desc:"Secondary slot utility for demolition tasks."},
    {name:"P-19 Redeemer",type:"Machine Pistol",slot:"Secondary",role:"Emergency DPS",tags:["Automatic","Close"],desc:"Fast sidearm for emergency close-range pressure."},
    {name:"Autocannon",type:"Support Weapon",slot:"Support",role:"Anti-medium",tags:["Support","Crew"],desc:"Versatile support weapon for armored battlefield targets."},
    {name:"Recoilless Rifle",type:"Support Weapon",slot:"Support",role:"Anti-tank",tags:["Support","Anti-tank"],desc:"Dedicated heavy anti-armor support option."},
    {name:"Quasar Cannon",type:"Energy Support",slot:"Support",role:"Anti-tank",tags:["Energy","Anti-tank"],desc:"Recharge-based heavy anti-armor support weapon."}
  ],
  stratagems: [
    {name:"Eagle Airstrike",type:"Eagle",role:"Area damage",tags:["Fast","Versatile"],desc:"Fast line attack suited to general battlefield clearing."},
    {name:"Eagle 500kg Bomb",type:"Eagle",role:"Heavy burst",tags:["Heavy","Burst"],desc:"Concentrated high-impact Eagle strike."},
    {name:"Orbital Precision Strike",type:"Orbital",role:"Precision",tags:["Heavy","Targeted"],desc:"Targeted orbital strike for priority threats."},
    {name:"Orbital Gas Strike",type:"Orbital",role:"Area denial",tags:["DoT","Zone"],desc:"Persistent area-denial strike for chokepoints and breaches."},
    {name:"Autocannon Sentry",type:"Sentry",role:"Fire support",tags:["Sentry","Armor"],desc:"Automated heavy fire support for defensive positions."},
    {name:"EMS Mortar Sentry",type:"Sentry",role:"Control",tags:["Sentry","Control"],desc:"Crowd-control support for slowing enemy advances."},
    {name:"Supply Pack",type:"Backpack",role:"Logistics",tags:["Ammo","Team"],desc:"Mobile resupply for extended operations."},
    {name:"Shield Generator Pack",type:"Backpack",role:"Survival",tags:["Shield","Defense"],desc:"Personal defensive backpack for high-pressure missions."},
    {name:"Jump Pack",type:"Backpack",role:"Mobility",tags:["Mobility","Traversal"],desc:"Extra battlefield mobility and vertical repositioning."},
    {name:"Recoilless Rifle",type:"Support Weapon",role:"Anti-tank",tags:["Heavy","Team"],desc:"Support weapon call-in focused on heavy armor."}
  ],
  armor: [
    {name:"SC-30 Trailblazer Scout",type:"Light",role:"Scout",tags:["Scout","Mobility"],desc:"Light armor suited to reconnaissance and objective play."},
    {name:"CM-21 Trench Paramedic",type:"Medium",role:"Medic",tags:["Med-Kit","Sustain"],desc:"Medium armor geared toward stim-heavy survivability."},
    {name:"CE-27 Ground Breaker",type:"Medium",role:"Engineer",tags:["Engineering","Grenades"],desc:"Balanced armor with engineering-oriented utility."},
    {name:"FS-55 Devastator",type:"Heavy",role:"Fortified",tags:["Fortified","Defense"],desc:"Heavy set built for explosive resistance and stability."},
    {name:"B-01 Tactical",type:"Medium",role:"Generalist",tags:["Extra Padding","Generalist"],desc:"Straightforward general-purpose armor platform."},
    {name:"DP-40 Hero of the Federation",type:"Medium",role:"Survival",tags:["Democracy Protects","Survival"],desc:"Iconic medium armor built around clutch survivability."}
  ],
  enemies: [
    {name:"Charger",type:"Terminid",role:"Heavy",tags:["Armor","Priority"],desc:"Armored assault unit; coordinate anti-tank fire and positioning."},
    {name:"Bile Titan",type:"Terminid",role:"Elite Heavy",tags:["Boss","Anti-tank"],desc:"Large Terminid threat demanding heavy anti-armor resources."},
    {name:"Hunter",type:"Terminid",role:"Flanker",tags:["Fast","Control"],desc:"Fast flanking threat that punishes isolated Helldivers."},
    {name:"Hulk",type:"Automaton",role:"Heavy",tags:["Armor","Weakpoint"],desc:"Heavily armored Automaton assault platform with critical weakpoints."},
    {name:"Factory Strider",type:"Automaton",role:"Elite Heavy",tags:["Boss","Objectives"],desc:"Massive Automaton weapons platform requiring coordinated fire."},
    {name:"Rocket Devastator",type:"Automaton",role:"Ranged",tags:["Rockets","Priority"],desc:"Ranged suppression unit; line-of-sight management is critical."},
    {name:"Harvester",type:"Illuminate",role:"Heavy",tags:["Shield","Priority"],desc:"Advanced Illuminate threat requiring shield-break and focused damage."},
    {name:"Overseer",type:"Illuminate",role:"Elite",tags:["Mobile","Priority"],desc:"Mobile Illuminate combatant with high battlefield pressure."}
  ],
  builds: [
    {id:"bug-breach",title:"Bug Breach Eraser",purpose:"High-pressure Terminid control",faction:"Terminids",difficulty:"8–10",weapon:"SG-225 Breaker",armor:"CM-21 Trench Paramedic",stratagems:["Eagle Airstrike","Orbital Gas Strike","Autocannon Sentry","Recoilless Rifle"],rating:4.9},
    {id:"steel-rain",title:"Steel Rain",purpose:"Anti-armor Automaton strike",faction:"Automatons",difficulty:"9–10",weapon:"R-63 Diligence",armor:"FS-55 Devastator",stratagems:["Orbital Precision Strike","Eagle 500kg Bomb","Autocannon","EMS Mortar Sentry"],rating:4.8},
    {id:"mobile-democracy",title:"Mobile Democracy",purpose:"Flexible squad all-rounder",faction:"Universal",difficulty:"6–10",weapon:"AR-23 Liberator",armor:"CE-27 Ground Breaker",stratagems:["Eagle Airstrike","Recoilless Rifle","Orbital Precision Strike","Shield Generator Pack"],rating:4.7},
    {id:"lone-diver",title:"Lone Diver",purpose:"Solo objectives and extraction",faction:"Universal",difficulty:"7–9",weapon:"LAS-16 Sickle",armor:"SC-30 Trailblazer Scout",stratagems:["Jump Pack","Orbital Precision Strike","Eagle 500kg Bomb","Autocannon Sentry"],rating:4.6}
  ],
  tiers:{
    "Weapons":{S:["Recoilless Rifle","Autocannon","Quasar Cannon"],A:["LAS-16 Sickle","JAR-5 Dominator","R-63 Diligence"],B:["AR-23 Liberator","SG-225 Breaker"],C:["Specialist picks"],D:["Mission-specific"]},
    "Stratagems":{S:["Eagle Airstrike","Orbital Precision Strike","Supply Pack"],A:["Eagle 500kg Bomb","Orbital Gas Strike","Autocannon Sentry"],B:["Shield Generator Pack","EMS Mortar Sentry"],C:["Jump Pack"],D:["Highly situational"]},
    "Armor":{S:["Med-Kit","Fortified","Extra Padding"],A:["Engineering Kit","Scout"],B:["Democracy Protects"],C:["Specialist passives"],D:["Mission-specific"]},
    "Primary Weapons":{S:["LAS-16 Sickle","JAR-5 Dominator"],A:["R-63 Diligence","SG-225 Breaker"],B:["AR-23 Liberator","R-36 Eruptor"],C:["Specialist picks"],D:["Niche"]},
    "Secondary Weapons":{S:["GP-31 Grenade Pistol","P-4 Senator"],A:["P-19 Redeemer"],B:["Utility picks"],C:["Standard sidearms"],D:["Niche"]}
  },
  guides:[
    {id:"squad-roles",tag:"Squadcraft",title:"Build a squad without wasting stratagem slots",desc:"A practical framework for anti-armor, crowd control, objectives and resupply roles.",read:"6 min"},
    {id:"automatons",tag:"Automatons",title:"Surviving high-difficulty Automaton missions",desc:"Cover usage, target priority and why overlapping anti-tank options matter.",read:"8 min"},
    {id:"terminids",tag:"Terminids",title:"Controlling breaches and keeping the squad moving",desc:"Zone control, breach response and sustainable ammo economy for Terminid fronts.",read:"7 min"},
    {id:"loadout",tag:"Builds",title:"A simple loadout construction checklist",desc:"How to avoid redundant tools and make every slot answer a battlefield problem.",read:"5 min"},
    {id:"objectives",tag:"Operations",title:"Fast objective routing for public squads",desc:"A readable route-planning method for samples, side objectives and extraction.",read:"5 min"},
    {id:"difficulty",tag:"Progression",title:"When to move up a difficulty level",desc:"Signs your squad is ready and what actually changes in loadout priorities.",read:"4 min"}
  ],
  fallbackNews:[
    {title:"Galactic War terminal connected",category:"Portal",date:"2026-09-05",desc:"Live-war modules now use a public community API with local fallback and rate-aware caching.",url:"data-sources.html"},
    {title:"Loadout generator enters field testing",category:"Builds",date:"2026-09-05",desc:"Generate and share faction/role-focused prototype builds directly from the browser.",url:"builds.html"},
    {title:"Fourteen interface locales are now available",category:"Update",date:"2026-09-05",desc:"The portal language selector follows the set of languages listed for Helldivers 2 on Steam.",url:"index.html"}
  ],
  memes:[
    {text:"THE EXTRACTION SHUTTLE IS <span>ALWAYS WATCHING</span>",author:"@democracy_officer",votes:"9.4k"},
    {text:"ONE MORE SAMPLE <span>THEN WE LEAVE</span>",author:"@sample_goblin",votes:"12.1k"},
    {text:"THIS LOADOUT WAS <span>APPROVED BY SCIENCE</span>",author:"@super_citizen",votes:"7.8k"},
    {text:"THE 500KG MISSED <span>WITH CONFIDENCE</span>",author:"@eagle_one_fan",votes:"14.2k"},
    {text:"I HAVE A PLAN <span>IT INVOLVES ORBITALS</span>",author:"@hellpod_logic",votes:"6.5k"},
    {text:"FRIENDLY FIRE <span>BUILDS CHARACTER</span>",author:"@reinforce_me",votes:"10.7k"}
  ],
  ticker:{
    en:["For Super Earth!","Sweet Liberty, my leg!","Calling in an Eagle!","How about a nice cup of Liber-Tea?","Breaking: local Helldiver discovers one more sample","Managed Democracy reminds you to check your stratagem cooldowns","Weather forecast: 100% chance of orbital fire"],
    ru:["За Супер-Землю!","Сладкая Свобода, моя нога!","Вызываю Орла!","Не желаете чашечку Свобода-чая?","Срочно: Хеллдайвер нашёл ещё один образец","Управляемая демократия напоминает проверить перезарядку стратагем","Прогноз: 100% вероятность орбитального огня"],
    pl:["Za Super Ziemię!","Słodka Wolności, moja noga!","Wzywam Orła!","Może filiżanka Liber-Herbaty?","Pilne: Helldiver znalazł jeszcze jedną próbkę","Demokracja Zarządzana przypomina o czasie odnowienia stratagemów","Prognoza: 100% szans na ogień orbitalny"],
    fr:["Pour la Super-Terre !","Douce Liberté, ma jambe !","J'appelle un Aigle !","Une tasse de Liber-Thé ?","Flash : un Helldiver a trouvé un échantillon de plus","Prévision : pluie orbitale très démocratique"],
    it:["Per la Super Terra!","Dolce Libertà, la mia gamba!","Chiamo un'Aquila!","Una tazza di Liber-Tè?","Ultim'ora: trovato un altro campione","Previsioni: fuoco orbitale con certezza democratica"],
    de:["Für Super-Erde!","Süße Freiheit, mein Bein!","Ich rufe einen Eagle!","Eine Tasse Liber-Tee?","Eilmeldung: noch eine Probe gefunden","Wetter: demokratischer Orbitalbeschuss wahrscheinlich"],
    "es-ES":["¡Por la Super Tierra!","¡Dulce Libertad, mi pierna!","¡Solicitando un Águila!","¿Una taza de Liber-Té?","Última hora: otro Helldiver encontró una muestra","Pronóstico: fuego orbital con alta probabilidad democrática"],
    "es-419":["¡Por la Super Tierra!","¡Dulce Libertad, mi pierna!","¡Llamando a un Águila!","¿Una taza de Liber-Té?","Urgente: apareció una muestra más","Pronóstico: lluvia orbital muy democrática"],
    "pt-BR":["Pela Super Terra!","Doce Liberdade, minha perna!","Chamando uma Águia!","Aceita um Liber-Chá?","Urgente: mais uma amostra foi encontrada","Previsão: fogo orbital democraticamente garantido"],
    "pt-PT":["Pela Super Terra!","Doce Liberdade, a minha perna!","A chamar uma Águia!","Um Liber-Chá?","Última hora: mais uma amostra encontrada","Previsão: fogo orbital democraticamente provável"],
    ja:["スーパーアースのために！","甘美なる自由よ、脚が！","イーグルを要請！","自由のお茶はいかが？","速報：ヘルダイバーがもう一つサンプルを発見","予報：民主的な軌道砲撃の可能性100%"],
    ko:["슈퍼지구를 위하여!","달콤한 자유여, 내 다리!","이글 호출!","자유의 차 한 잔 어때?","속보: 헬다이버가 샘플 하나를 더 발견","예보: 민주적인 궤도 포격 확률 100%"],
    "zh-CN":["为了超级地球！","甜美的自由啊，我的腿！","呼叫飞鹰！","来一杯自由之茶？","快讯：绝地潜兵又发现了一个样本","天气预报：100% 概率迎来民主轨道火力"],
    "zh-TW":["為了超級地球！","甜美的自由啊，我的腿！","呼叫飛鷹！","來一杯自由之茶？","快訊：絕地潛兵又發現了一個樣本","天氣預報：100% 機率迎來民主軌道火力"]
  }
};