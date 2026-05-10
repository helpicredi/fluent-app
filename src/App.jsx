import { useState, useCallback, useEffect } from "react";

// ─── LEVELS ──────────────────────────────────────────────────────────────────
const LEVELS = [
  { id:"A1", name:"Beginner",     xpRequired:0    },
  { id:"A2", name:"Elementary",   xpRequired:300  },
  { id:"B1", name:"Intermediate", xpRequired:800  },
  { id:"B2", name:"Upper-Inter.", xpRequired:1600 },
  { id:"C1", name:"Advanced",     xpRequired:2800 },
  { id:"C2", name:"Mastery",      xpRequired:4500 },
];

const AVATARS = ["🧑","👩","👨","🧒","👧","👦","🧔","👩‍🦱","👩‍🦰","👨‍🦳","🧑‍🎓","👩‍💻","🧑‍🚀","🦊","🐼","🐨","🦁","🐯","🐸","🐙"];

// ─── PLACEMENT TEST ───────────────────────────────────────────────────────────
const PLACEMENT_QUESTIONS = [
  { id:"p1",  level:"A1", question:"Which sentence is correct?",
    options:["She go to school.","She goes to school.","She going to school.","She goed to school."],
    correct:1, explanation:"Third person singular (he/she/it) always takes -s: 'goes'." },
  { id:"p2",  level:"A1", question:"Choose the correct verb: 'I ___ a student.'",
    options:["is","are","am","be"], correct:2, explanation:"With 'I', we always use 'am' (to be)." },
  { id:"p3",  level:"A2", question:"What is the past tense of 'buy'?",
    options:["buyed","buys","bought","buying"], correct:2, explanation:"Irregular verb: buy → bought." },
  { id:"p4",  level:"A2", question:"Which sentence is correct?",
    options:["Yesterday I go to the store.","Yesterday I went to the store.","Yesterday I gone to the store.","Yesterday I goes to the store."],
    correct:1, explanation:"Past simple with 'yesterday': went (irregular past of go)." },
  { id:"p5",  level:"B1", question:"Which sentence uses the Present Perfect correctly?",
    options:["I have seen that film yesterday.","I have never seen that film.","I have saw that film.","I seen that film before."],
    correct:1, explanation:"Present Perfect = have/has + past participle. Never pair it with 'yesterday'." },
  { id:"p6",  level:"B1", question:"Choose the correct sentence:",
    options:["She is working here since 2020.","She has been working here since 2020.","She was working here since 2020.","She works here since 2020."],
    correct:1, explanation:"Ongoing situations starting in the past → Present Perfect Continuous + since." },
  { id:"p7",  level:"B2", question:"Choose the correct second conditional:",
    options:["If I would have money, I will travel.","If I have money, I would travel.","If I had money, I would travel.","If I had money, I will travel."],
    correct:2, explanation:"2nd conditional: If + past simple, would + infinitive (hypothetical situations)." },
  { id:"p8",  level:"B2", question:"Which sentence is in the passive voice?",
    options:["They built this bridge in 1990.","This bridge was built in 1990.","Building this bridge took years.","They have built this bridge."],
    correct:1, explanation:"Passive voice: subject + was/were + past participle." },
  { id:"p9",  level:"C1", question:"Select the best word: 'The decision was met with widespread ___.'",
    options:["criticism","critic","critical","critically"], correct:0, explanation:"'Criticism' (noun) fits after 'widespread'. The others are adjective/adverb forms." },
  { id:"p10", level:"C2", question:"Which is the correct subjunctive form?",
    options:["I suggest that he goes home.","I suggest that he go home.","I suggest that he would go home.","I suggest that he went home."],
    correct:1, explanation:"Subjunctive after suggest/recommend/insist uses the base form: 'go' (not 'goes')." },
];

// ─── LOCAL EXERCISE BANK ──────────────────────────────────────────────────────
// Large offline bank — used as primary source (no API needed)
const EXERCISE_BANK = {
  A1: [
    // fill_blank
    { type:"fill_blank", sentence:"I ___ from Brazil.", answer:"am", options:["am","is","are","be"], hint:"Use 'am' with I." },
    { type:"fill_blank", sentence:"She ___ a teacher.", answer:"is", options:["is","am","are","be"], hint:"She/He/It → 'is'." },
    { type:"fill_blank", sentence:"They ___ friends.", answer:"are", options:["are","is","am","be"], hint:"They/We/You → 'are'." },
    { type:"fill_blank", sentence:"He ___ to school every day.", answer:"goes", options:["goes","go","going","went"], hint:"He/She/It + verb + s." },
    { type:"fill_blank", sentence:"I ___ breakfast every morning.", answer:"eat", options:["eat","eats","ate","eating"], hint:"I + base verb (no -s)." },
    { type:"fill_blank", sentence:"There ___ a cat on the sofa.", answer:"is", options:["is","are","am","be"], hint:"There is → singular; there are → plural." },
    // translate_to_en
    { type:"translate_to_en", sentence_pt:"Eu tenho um cachorro.", answer:"I have a dog.", hint:"'Ter' = 'to have'." },
    { type:"translate_to_en", sentence_pt:"Ela é médica.", answer:"She is a doctor.", hint:"Use 'is' for she/he/it." },
    { type:"translate_to_en", sentence_pt:"Nós moramos no Brasil.", answer:"We live in Brazil.", hint:"'Morar' = 'to live'." },
    { type:"translate_to_en", sentence_pt:"Bom dia! Como vai você?", answer:"Good morning! How are you?", hint:"Standard greeting." },
    { type:"translate_to_en", sentence_pt:"Eu gosto de café.", answer:"I like coffee.", hint:"'Gostar de' = 'to like'." },
    // translate_to_pt
    { type:"translate_to_pt", sentence_en:"My name is Ana.", answer:"Meu nome é Ana.", hint:"'My' = 'Meu/Minha'." },
    { type:"translate_to_pt", sentence_en:"I am happy today.", answer:"Eu estou feliz hoje.", hint:"'Happy' = 'feliz'." },
    { type:"translate_to_pt", sentence_en:"She has two brothers.", answer:"Ela tem dois irmãos.", hint:"'Brothers' = 'irmãos'." },
    // word_order
    { type:"word_order", words:["am","I","student","a"], answer:"I am a student.", hint:"English order: Subject + Verb + Object." },
    { type:"word_order", words:["she","cat","a","has"], answer:"She has a cat.", hint:"Subject + verb + object." },
    { type:"word_order", words:["they","Brazil","in","live"], answer:"They live in Brazil.", hint:"Place usually comes at the end." },
  ],
  A2: [
    { type:"fill_blank", sentence:"We ___ to the beach last Saturday.", answer:"went", options:["went","go","goes","going"], hint:"Past simple of 'go' is 'went' (irregular)." },
    { type:"fill_blank", sentence:"She ___ TV when I called.", answer:"was watching", options:["was watching","watched","is watching","watches"], hint:"Past continuous: was/were + verb-ing." },
    { type:"fill_blank", sentence:"I ___ already eaten lunch.", answer:"have", options:["have","has","had","am"], hint:"Present Perfect: I have + past participle." },
    { type:"fill_blank", sentence:"He ___ to London twice.", answer:"has been", options:["has been","have been","was","went"], hint:"Has been = experience (he/she/it)." },
    { type:"fill_blank", sentence:"___ you ever tried sushi?", answer:"Have", options:["Have","Has","Did","Do"], hint:"Questions about experiences → Have you ever...?" },
    { type:"translate_to_en", sentence_pt:"Eu fui ao mercado ontem.", answer:"I went to the market yesterday.", hint:"'Fui' = 'went' (past of go)." },
    { type:"translate_to_en", sentence_pt:"Ela estava dormindo quando eu cheguei.", answer:"She was sleeping when I arrived.", hint:"Past continuous + simple past." },
    { type:"translate_to_en", sentence_pt:"Você já visitou a Europa?", answer:"Have you ever visited Europe?", hint:"'Já' with experience = Have you ever...?" },
    { type:"translate_to_pt", sentence_en:"I didn't go to the party.", answer:"Eu não fui à festa.", hint:"'Didn't' = 'não' (negação no passado)." },
    { type:"translate_to_pt", sentence_en:"We visited Paris last year.", answer:"Nós visitamos Paris no ano passado.", hint:"'Last year' = 'no ano passado'." },
    { type:"word_order", words:["yesterday","she","work","didn't","go","to"], answer:"She didn't go to work yesterday.", hint:"Negation: subject + didn't + base verb." },
    { type:"word_order", words:["have","you","been","to","ever","Japan"], answer:"Have you ever been to Japan?", hint:"Present Perfect questions: Have + subject + past participle?" },
  ],
  B1: [
    { type:"fill_blank", sentence:"If it ___ tomorrow, we will cancel the picnic.", answer:"rains", options:["rains","rain","rained","will rain"], hint:"First conditional: if + present simple, will + infinitive." },
    { type:"fill_blank", sentence:"She ___ here for five years.", answer:"has been working", options:["has been working","is working","worked","works"], hint:"Duration from past to now → Present Perfect Continuous." },
    { type:"fill_blank", sentence:"The report must ___ by Friday.", answer:"be submitted", options:["be submitted","submit","submits","submitted"], hint:"Passive with modal: must be + past participle." },
    { type:"fill_blank", sentence:"He's the man ___ won the prize.", answer:"who", options:["who","which","what","where"], hint:"'Who' refers to people in relative clauses." },
    { type:"fill_blank", sentence:"I wish I ___ speak Spanish.", answer:"could", options:["could","can","would","will"], hint:"Wishes about present ability → I wish + could." },
    { type:"translate_to_en", sentence_pt:"Se eu tiver tempo, vou ao cinema.", answer:"If I have time, I will go to the cinema.", hint:"First conditional: if + present, will + infinitive." },
    { type:"translate_to_en", sentence_pt:"Ela tem estudado inglês por dois anos.", answer:"She has been studying English for two years.", hint:"Present Perfect Continuous for ongoing duration." },
    { type:"translate_to_en", sentence_pt:"O carro foi consertado pelo mecânico.", answer:"The car was fixed by the mechanic.", hint:"Passive voice: was + past participle." },
    { type:"translate_to_pt", sentence_en:"I would travel more if I had more money.", answer:"Eu viajaria mais se tivesse mais dinheiro.", hint:"Second conditional: hypothetical situation." },
    { type:"translate_to_pt", sentence_en:"The package will be delivered tomorrow.", answer:"O pacote será entregue amanhã.", hint:"Future passive: will be + past participle." },
    { type:"word_order", words:["spoken","is","English","many","by","countries"], answer:"English is spoken by many countries.", hint:"Passive: subject + is/are + past participle + by + agent." },
    { type:"word_order", words:["I","told","the","if","truth","will","you","be","angry"], answer:"If you tell the truth, I will not be angry.", hint:"First conditional: if-clause + result clause." },
  ],
  B2: [
    { type:"fill_blank", sentence:"She ___ have called — her phone was off all day.", answer:"can't", options:["can't","mustn't","shouldn't","wouldn't"], hint:"Can't have + past participle = logical deduction (impossibility)." },
    { type:"fill_blank", sentence:"Had I known earlier, I ___ helped you.", answer:"would have", options:["would have","will have","had","could"], hint:"Third conditional: Had + past perfect → would have + past participle." },
    { type:"fill_blank", sentence:"The manager suggested ___ the meeting.", answer:"postponing", options:["postponing","to postpone","postpone","postponed"], hint:"After 'suggest', use the gerund (-ing)." },
    { type:"fill_blank", sentence:"Not only ___ she finish first, but she also won a prize.", answer:"did", options:["did","does","had","was"], hint:"Inverted sentence: Not only + auxiliary + subject + verb." },
    { type:"translate_to_en", sentence_pt:"Se eu tivesse estudado mais, teria passado na prova.", answer:"If I had studied more, I would have passed the exam.", hint:"Third conditional: If + past perfect, would have + past participle." },
    { type:"translate_to_en", sentence_pt:"Ele deve ter esquecido a reunião.", answer:"He must have forgotten the meeting.", hint:"Must have + past participle = strong deduction about the past." },
    { type:"translate_to_en", sentence_pt:"Quanto mais você pratica, melhor você fica.", answer:"The more you practice, the better you get.", hint:"'The more... the more' structure for proportional comparison." },
    { type:"translate_to_pt", sentence_en:"I'd rather you didn't tell anyone about this.", answer:"Eu preferiria que você não contasse isso a ninguém.", hint:"'I'd rather + subject + past simple' expresses preference about someone else's action." },
    { type:"word_order", words:["known","had","earlier","I","I","helped","would","have","you"], answer:"Had I known earlier, I would have helped you.", hint:"Third conditional with inversion (formal): Had + subject + past participle..." },
  ],
  C1: [
    { type:"fill_blank", sentence:"The proposal, ___ was submitted last week, has been approved.", answer:"which", options:["which","who","that","what"], hint:"Non-defining relative clauses use 'which' for things (not 'that')." },
    { type:"fill_blank", sentence:"He spoke so quietly that I could ___ hear him.", answer:"barely", options:["barely","nearly","mostly","roughly"], hint:"'Barely' means almost not at all — close to 'hardly'." },
    { type:"fill_blank", sentence:"The new regulations will ___ a significant impact on small businesses.", answer:"have", options:["have","make","do","take"], hint:"'Have an impact' is the correct collocation." },
    { type:"fill_blank", sentence:"___ to popular belief, sugar does not cause hyperactivity in children.", answer:"Contrary", options:["Contrary","Opposite","Against","Unlike"], hint:"Fixed phrase: 'Contrary to popular belief'." },
    { type:"translate_to_en", sentence_pt:"Por mais que ela tente, não consegue se concentrar.", answer:"No matter how hard she tries, she can't concentrate.", hint:"'Por mais que' = 'No matter how' (concession)." },
    { type:"translate_to_en", sentence_pt:"O relatório precisa ser entregue até sexta-feira, o mais tardar.", answer:"The report needs to be submitted by Friday at the latest.", hint:"'At the latest' = 'o mais tardar'." },
    { type:"translate_to_pt", sentence_en:"It goes without saying that punctuality is essential.", answer:"Nem é preciso dizer que a pontualidade é essencial.", hint:"'It goes without saying' = 'Nem é preciso dizer / É óbvio que'." },
    { type:"word_order", words:["sooner","had","the","than","left","phone","rang","she"], answer:"No sooner had she left than the phone rang.", hint:"'No sooner... than': inversion with had + subject + past participle." },
  ],
  C2: [
    { type:"fill_blank", sentence:"The scientist's findings ___ in the face of conventional wisdom.", answer:"fly", options:["fly","run","go","stand"], hint:"'Fly in the face of' = contradict strongly (fixed idiom)." },
    { type:"fill_blank", sentence:"___ one's laurels is a mistake most successful people eventually make.", answer:"Resting on", options:["Resting on","Leaning on","Sitting on","Standing on"], hint:"'Rest on one's laurels' = stop trying after success (idiom)." },
    { type:"fill_blank", sentence:"The negotiations were ___ — neither side was willing to compromise.", answer:"deadlocked", options:["deadlocked","standstill","frozen","halted"], hint:"'Deadlocked' specifically describes negotiations where no progress is possible." },
    { type:"translate_to_en", sentence_pt:"Quanto mais ele tentava explicar, mais confuso ficava.", answer:"The more he tried to explain, the more confused he became.", hint:"Double comparative structure: 'The more... the more'." },
    { type:"translate_to_en", sentence_pt:"Tivesse ela chegado mais cedo, teria evitado toda a confusão.", answer:"Had she arrived earlier, she would have avoided all the confusion.", hint:"Third conditional with inversion: Had + subject + past participle (formal/literary)." },
    { type:"translate_to_pt", sentence_en:"The sheer audacity of his proposal left the committee speechless.", answer:"A pura audácia de sua proposta deixou o comitê sem palavras.", hint:"'Sheer' = 'pura/absoluta' (intensifier); 'speechless' = 'sem palavras'." },
    { type:"word_order", words:["only","did","not","arrive","late","he","also","forgot","but","his","notes"], answer:"Not only did he arrive late, but he also forgot his notes.", hint:"'Not only... but also' with inversion: Not only + auxiliary + subject + verb." },
  ],
};

// ─── LOCAL EXERCISE PICKER ────────────────────────────────────────────────────
function getLocalExercise(levelId) {
  const bank = EXERCISE_BANK[levelId] || EXERCISE_BANK["A1"];
  const ex = bank[Math.floor(Math.random() * bank.length)];
  const clone = { ...ex };
  if (clone.type === "fill_blank" && clone.options)
    clone.options = [...clone.options].sort(() => Math.random() - 0.5);
  if (clone.type === "word_order" && clone.words)
    clone.words = [...clone.words].sort(() => Math.random() - 0.5);
  return clone;
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
const getLevelFromXP = (xp) => { let c = LEVELS[0]; for (const l of LEVELS) { if (xp >= l.xpRequired) c = l; } return c; };
const getNextLevel   = (id)  => { const i = LEVELS.findIndex(l => l.id === id); return i < LEVELS.length - 1 ? LEVELS[i + 1] : null; };
const getXPProgress  = (xp)  => { const c = getLevelFromXP(xp); const n = getNextLevel(c.id); if (!n) return 100; return Math.round(((xp - c.xpRequired) / (n.xpRequired - c.xpRequired)) * 100); };
const getTodayKey    = ()     => new Date().toISOString().split("T")[0];

const normalize = (s) => s.toLowerCase().trim()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[.,!?;:'"()\-]/g, "")
  .replace(/\s+/g, " ").trim();

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const STORE_KEY = "fluent_profiles_v2";
function loadStore() {
  try { const r = localStorage.getItem(STORE_KEY); return r ? JSON.parse(r) : { profiles: [], activeId: null }; }
  catch { return { profiles: [], activeId: null }; }
}
function saveStore(s) { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch {} }
function newProfile(name, avatar) {
  return { id: Date.now().toString(), name, avatar, xp: 0, streak: 0, lastActiveDay: null,
    placementDone: false, placementLevel: null, hearts: 5, lastHeartsReset: null, createdAt: getTodayKey() };
}
function refreshProfile(p) {
  const today = getTodayKey();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toISOString().split("T")[0];
  if (p.lastActiveDay && p.lastActiveDay !== today && p.lastActiveDay !== yKey) p = { ...p, streak: 0 };
  if (p.lastHeartsReset !== today) p = { ...p, hearts: 5, lastHeartsReset: today };
  return p;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#f8f7f4;--surface:#fff;--surface2:#f1f0ed;--border:#e8e6e1;
    --text:#1a1917;--text2:#6b6962;--text3:#9b9891;
    --accent:#2d6a4f;--accent2:#52b788;--accent-light:#d8f3dc;
    --danger:#c1121f;--danger-light:#ffe5e5;--gold:#c9a227;--gold-light:#fdf3d7;
    --radius:12px;--shadow:0 2px 12px rgba(0,0,0,.06);--shadow-lg:0 8px 32px rgba(0,0,0,.10);
  }
  body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;font-size:15px;line-height:1.6;min-height:100vh}
  .app{max-width:520px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column}

  /* NAV */
  .nav{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border);background:var(--surface);position:sticky;top:0;z-index:50}
  .nav-logo{font-family:'DM Serif Display',serif;font-size:20px;color:var(--accent);letter-spacing:-.5px}
  .nav-right{display:flex;align-items:center;gap:10px}
  .nav-stat{display:flex;align-items:center;gap:4px;font-size:13px;font-weight:500;color:var(--text2)}
  .nav-stat .val{font-weight:700;color:var(--text)}
  .hearts{display:flex;gap:2px}
  .heart{font-size:14px}.heart.empty{opacity:.2}
  .profile-btn{display:flex;align-items:center;gap:6px;padding:5px 10px 5px 5px;border:1.5px solid var(--border);border-radius:20px;background:var(--surface);cursor:pointer;transition:all .15s;font-size:13px;font-weight:600;color:var(--text);line-height:1}
  .profile-btn:hover{border-color:var(--accent2);background:var(--accent-light)}
  .profile-btn .av{font-size:20px}
  .main{flex:1;padding:24px 20px 48px}

  /* PROFILES */
  .profiles-screen{padding:40px 0 0;text-align:center}
  .profiles-screen h1{font-family:'DM Serif Display',serif;font-size:32px;color:var(--accent);margin-bottom:6px}
  .profiles-screen p{color:var(--text2);font-size:14px;margin-bottom:32px}
  .profiles-list{display:flex;flex-direction:column;gap:10px;margin-bottom:16px;text-align:left}
  .profile-card{display:flex;align-items:center;gap:14px;padding:16px 18px;background:var(--surface);border:1.5px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:all .15s;box-shadow:var(--shadow)}
  .profile-card:hover{border-color:var(--accent2);transform:translateY(-1px);box-shadow:var(--shadow-lg)}
  .profile-card.is-active{border-color:var(--accent);background:var(--accent-light)}
  .profile-av{font-size:34px;width:52px;height:52px;display:flex;align-items:center;justify-content:center;background:var(--surface2);border-radius:50%;flex-shrink:0}
  .profile-card.is-active .profile-av{background:#fff}
  .pname{font-size:16px;font-weight:600}.psub{font-size:12px;color:var(--text2);margin-top:2px}
  .add-profile-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:16px;border:1.5px dashed var(--border);border-radius:var(--radius);background:transparent;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:var(--text2);cursor:pointer;transition:all .15s;width:100%}
  .add-profile-btn:hover{border-color:var(--accent2);color:var(--accent);background:var(--accent-light)}

  /* CREATE */
  .create-screen h2{font-family:'DM Serif Display',serif;font-size:24px;margin-bottom:6px}
  .create-screen > p{color:var(--text2);font-size:14px;margin-bottom:24px}
  .avatar-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:24px}
  .av-opt{font-size:26px;width:100%;aspect-ratio:1;display:flex;align-items:center;justify-content:center;border:2px solid var(--border);border-radius:12px;cursor:pointer;background:var(--surface);transition:all .12s}
  .av-opt:hover{border-color:var(--accent2);background:var(--accent-light);transform:scale(1.05)}
  .av-opt.sel{border-color:var(--accent);background:var(--accent-light)}
  .name-input{width:100%;padding:13px 16px;border:1.5px solid var(--border);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--text);outline:none;background:var(--surface);transition:border-color .15s;margin-bottom:16px}
  .name-input:focus{border-color:var(--accent)}

  /* SWITCHER */
  .overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:100;display:flex;align-items:flex-end;justify-content:center}
  .panel{background:var(--surface);border-radius:20px 20px 0 0;padding:20px 20px 40px;width:100%;max-width:520px;box-shadow:var(--shadow-lg);animation:slideUp .22s ease}
  @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  .panel-handle{width:40px;height:4px;background:var(--border);border-radius:2px;margin:0 auto 18px}
  .panel h3{font-family:'DM Serif Display',serif;font-size:20px;margin-bottom:14px}
  .sw-row{display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:10px;cursor:pointer;transition:background .12s;border:1.5px solid transparent}
  .sw-row:hover{background:var(--surface2)}.sw-row.sw-active{border-color:var(--accent2);background:var(--accent-light)}
  .sw-av{font-size:26px;width:42px;height:42px;display:flex;align-items:center;justify-content:center;background:var(--surface2);border-radius:50%;flex-shrink:0}
  .sw-row.sw-active .sw-av{background:#fff}
  .sw-name{font-size:14px;font-weight:600}.sw-sub{font-size:12px;color:var(--text2);margin-top:1px}
  .sw-del{padding:5px 9px;border:none;background:none;color:var(--text3);font-size:16px;cursor:pointer;border-radius:6px;transition:all .12s;margin-left:auto}
  .sw-del:hover{background:var(--danger-light);color:var(--danger)}
  .confirm-box{background:var(--danger-light);border:1px solid var(--danger);border-radius:10px;padding:14px;margin:8px 0 4px}
  .confirm-box p{font-size:13px;color:var(--danger);margin-bottom:10px}
  .confirm-row{display:flex;gap:8px}

  /* COMMON */
  .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow)}
  .card+.card{margin-top:12px}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 24px;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;border:none;transition:all .15s}
  .btn:active{transform:scale(.97)}
  .btn-primary{background:var(--accent);color:#fff;width:100%;padding:14px;font-size:15px;box-shadow:0 4px 16px rgba(45,106,79,.2)}
  .btn-primary:hover{background:#235c42}.btn-primary:disabled{opacity:.4;cursor:not-allowed}
  .btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border)}.btn-ghost:hover{background:var(--surface2)}
  .btn-sm{padding:8px 16px;font-size:13px}
  .section-title{font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--text3);margin-bottom:12px}
  .spacer{flex:1}.mt-12{margin-top:12px}.mt-16{margin-top:16px}.mt-20{margin-top:20px}

  /* XP */
  .xp-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px}
  .xp-label{font-size:13px;color:var(--text2)}.xp-value{font-family:'DM Mono',monospace;font-size:13px;color:var(--text2)}
  .xp-bar{height:8px;background:var(--surface2);border-radius:4px;overflow:hidden}
  .xp-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:4px;transition:width .6s cubic-bezier(.4,0,.2,1)}
  .level-row{display:flex;align-items:center;justify-content:space-between;margin-top:6px}
  .level-tag{font-size:12px;font-weight:600;letter-spacing:.5px;color:var(--accent);background:var(--accent-light);padding:3px 10px;border-radius:20px}

  /* STREAK */
  .streak-card{display:flex;align-items:center;gap:14px;padding:16px 20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
  .streak-flame{font-size:32px;line-height:1}
  .streak-info h3{font-size:22px;font-weight:700;line-height:1}.streak-info p{font-size:12px;color:var(--text2);margin-top:2px}

  /* WEEK */
  .week-strip{display:flex;gap:4px;margin-top:10px}
  .day-dot{flex:1;text-align:center}
  .day-dot .d-label{font-size:10px;color:var(--text3);margin-bottom:4px}
  .day-dot .d-circle{width:28px;height:28px;border-radius:50%;background:var(--surface2);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:13px;margin:0 auto}
  .day-dot .d-circle.done{background:var(--accent-light);border-color:var(--accent2)}
  .day-dot .d-circle.today{border-color:var(--accent);border-width:2px}

  /* MENU */
  .menu-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .menu-item{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px 16px;cursor:pointer;transition:all .15s;box-shadow:var(--shadow)}
  .menu-item:hover{border-color:var(--accent2);transform:translateY(-1px);box-shadow:var(--shadow-lg)}
  .menu-item-icon{font-size:24px;margin-bottom:8px}
  .menu-item-label{font-size:13px;font-weight:600;color:var(--text)}
  .menu-item-sub{font-size:11px;color:var(--text2);margin-top:2px}

  /* TABS */
  .tabs{display:flex;gap:4px;background:var(--surface2);padding:4px;border-radius:10px;margin-bottom:20px}
  .tab{flex:1;padding:8px;border:none;background:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--text2);cursor:pointer;transition:all .15s}
  .tab.active{background:var(--surface);color:var(--text);box-shadow:var(--shadow)}

  /* PLACEMENT */
  .q-counter{font-family:'DM Mono',monospace;font-size:12px;color:var(--text3);text-align:center;margin-bottom:16px;letter-spacing:1px}
  .q-progress{height:3px;background:var(--surface2);border-radius:2px;margin-bottom:28px;overflow:hidden}
  .q-progress-fill{height:100%;background:var(--accent);border-radius:2px;transition:width .4s ease}
  .question-text{font-size:17px;font-weight:500;line-height:1.5;margin-bottom:22px}
  .options{display:flex;flex-direction:column;gap:10px}
  .option{padding:14px 18px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface);cursor:pointer;font-size:14px;transition:all .12s;text-align:left;font-family:'DM Sans',sans-serif;color:var(--text)}
  .option:hover:not(:disabled){border-color:var(--accent2);background:var(--accent-light)}
  .option.correct{border-color:var(--accent2);background:var(--accent-light);color:var(--accent);font-weight:600}
  .option.wrong{border-color:var(--danger);background:var(--danger-light);color:var(--danger);font-weight:600}
  .option.selected{border-color:var(--accent);background:var(--accent-light);color:var(--accent);font-weight:500}
  .option:disabled{cursor:default}

  /* EXERCISE */
  .ex-topbar{display:flex;align-items:center;gap:14px;margin-bottom:28px}
  .ex-close{background:none;border:none;font-size:18px;cursor:pointer;color:var(--text2);padding:4px;border-radius:6px;transition:background .15s}
  .ex-close:hover{background:var(--surface2)}
  .ex-progress{flex:1;height:6px;background:var(--surface2);border-radius:3px;overflow:hidden}
  .ex-progress-fill{height:100%;background:var(--accent);border-radius:3px;transition:width .4s}
  .ex-type{font-size:11px;letter-spacing:.8px;font-weight:600;text-transform:uppercase;color:var(--text3);margin-bottom:6px}
  .ex-q{font-family:'DM Serif Display',serif;font-size:22px;line-height:1.4;margin-bottom:8px}
  .ex-hint{font-size:13px;color:var(--text2);margin-bottom:20px}
  .ex-input{width:100%;padding:14px 16px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface);font-family:'DM Sans',sans-serif;font-size:15px;color:var(--text);outline:none;transition:border-color .15s;margin-bottom:14px;resize:none}
  .ex-input:focus{border-color:var(--accent)}
  .ex-input.correct{border-color:var(--accent2);background:var(--accent-light)}
  .ex-input.wrong{border-color:var(--danger);background:var(--danger-light)}
  .word-pool{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
  .word-chip{padding:8px 14px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;font-size:14px;cursor:pointer;transition:all .12s;font-family:'DM Sans',sans-serif;color:var(--text)}
  .word-chip:hover{border-color:var(--accent2);background:var(--accent-light)}
  .word-chip.used{opacity:.25;cursor:default;pointer-events:none}
  .word-answer{min-height:52px;border:1.5px dashed var(--border);border-radius:10px;padding:10px 14px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:8px;background:var(--bg)}
  .word-answer.correct{border-color:var(--accent2);border-style:solid;background:var(--accent-light)}
  .word-answer.wrong{border-color:var(--danger);border-style:solid;background:var(--danger-light)}
  .answer-chip{padding:6px 12px;background:var(--surface);border:1.5px solid var(--border);border-radius:6px;font-size:14px;cursor:pointer}
  .answer-chip:hover{border-color:var(--danger)}
  .feedback-bar{padding:16px 20px;border-radius:var(--radius);margin-top:16px;display:flex;align-items:flex-start;gap:12px}
  .feedback-bar.correct{background:var(--accent-light);border:1px solid var(--accent2)}
  .feedback-bar.wrong{background:var(--danger-light);border:1px solid var(--danger)}
  .fb-icon{font-size:20px;flex-shrink:0}
  .fb-text strong{display:block;font-size:14px;font-weight:600;margin-bottom:2px}
  .fb-text.correct strong{color:var(--accent)}.fb-text.wrong strong{color:var(--danger)}
  .fb-text span{font-size:13px;color:var(--text2)}
  .ex-source{display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--surface2);border-radius:8px;margin-bottom:14px;font-size:12px;color:var(--text3)}

  /* LOADING */
  .loading{display:flex;flex-direction:column;align-items:center;gap:16px;padding:48px 0}
  .dots{display:flex;gap:6px}
  .dot{width:8px;height:8px;background:var(--accent);border-radius:50%;animation:bounce 1.2s ease-in-out infinite}
  .dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
  @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-10px)}}
  .loading p{font-size:13px;color:var(--text2)}

  /* RESULT */
  .result-icon{font-size:56px;text-align:center;margin-bottom:16px}
  .result-title{font-family:'DM Serif Display',serif;font-size:26px;text-align:center;margin-bottom:6px}
  .result-sub{text-align:center;color:var(--text2);font-size:14px;margin-bottom:20px}
  .result-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:20px}
  .result-stat{text-align:center;padding:14px;background:var(--surface2);border-radius:10px}
  .result-stat .val{font-size:22px;font-weight:700;color:var(--accent)}.result-stat .lbl{font-size:11px;color:var(--text2);margin-top:2px}
  .xp-gained{display:flex;align-items:center;justify-content:center;gap:8px;font-size:28px;font-weight:700;color:var(--gold);margin-bottom:8px;font-family:'DM Serif Display',serif}

  /* STATS */
  .stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
  .stat-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow)}
  .stat-box .big{font-size:28px;font-weight:700;font-family:'DM Serif Display',serif}
  .stat-box .lbl{font-size:12px;color:var(--text2);margin-top:2px}

  /* PWA BANNER */
  .install-banner{background:var(--accent);color:#fff;padding:12px 16px;display:flex;align-items:center;gap:10px;font-size:13px;position:sticky;top:0;z-index:200}

  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade-in{animation:fadeIn .3s ease forwards}
`;

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [store, setStore] = useState(() => {
    const s = loadStore();
    if (s.activeId) s.profiles = s.profiles.map(p => p.id === s.activeId ? refreshProfile(p) : p);
    return s;
  });

  const persist = useCallback((updates) => {
    setStore(prev => { const next = { ...prev, ...updates }; saveStore(next); return next; });
  }, []);

  const updateProfile = useCallback((id, updates) => {
    setStore(prev => {
      const profiles = prev.profiles.map(p => p.id === id ? { ...p, ...updates } : p);
      const next = { ...prev, profiles }; saveStore(next); return next;
    });
  }, []);

  // PWA install
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); setShowInstallBanner(true); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') { setShowInstallBanner(false); setInstallPrompt(null); }
  };

  const p = store.activeId ? refreshProfile(store.profiles.find(x => x.id === store.activeId)) : null;
  const currentLevel = getLevelFromXP(p?.xp ?? 0);
  const nextLevel = getNextLevel(currentLevel.id);
  const xpProgress = getXPProgress(p?.xp ?? 0);

  // UI state
  const [screen, setScreen]             = useState(store.activeId ? "home" : "profiles");
  const [tab, setTab]                   = useState("home");
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [confirmDel, setConfirmDel]     = useState(null);
  const [createName, setCreateName]     = useState("");
  const [createAv, setCreateAv]         = useState(AVATARS[0]);

  // Placement
  const [pStep, setPStep]       = useState(0);
  const [pAnswers, setPAnswers] = useState([]);
  const [selOpt, setSelOpt]     = useState(null);
  const [showFB, setShowFB]     = useState(false);

  // Exercise
  const [exercise, setExercise]     = useState(null);
  const [exState, setExState]       = useState({ answer: "", selOpt: null, wordAns: [], usedIdx: [], checked: false, isCorrect: false, checking: false });
  const [exCount, setExCount]       = useState(0);
  const [session, setSession]       = useState({ correct: 0, total: 0, xpEarned: 0 });
  const [showResult, setShowResult] = useState(false);

  // ── Profile actions ──
  const selectProfile = (id) => {
    const profiles = store.profiles.map(px => px.id === id ? refreshProfile(px) : px);
    persist({ activeId: id, profiles });
    setScreen("home"); setTab("home"); setShowSwitcher(false); setConfirmDel(null);
  };
  const createProfile = () => {
    if (!createName.trim()) return;
    const np = newProfile(createName.trim(), createAv);
    persist({ profiles: [...store.profiles, np], activeId: np.id });
    setCreateName(""); setCreateAv(AVATARS[0]);
    setScreen("home"); setTab("home");
  };
  const deleteProfile = (id) => {
    const profiles = store.profiles.filter(px => px.id !== id);
    const newActive = profiles.length ? profiles[0].id : null;
    persist({ profiles, activeId: newActive });
    setConfirmDel(null); setShowSwitcher(false);
    if (!newActive) setScreen("profiles"); else setScreen("home");
  };

  // ── Placement ──
  const handlePlacementOpt = (idx) => { if (showFB) return; setSelOpt(idx); setShowFB(true); };
  const nextPlacementQ = () => {
    const q = PLACEMENT_QUESTIONS[pStep];
    const newAnswers = [...pAnswers, { correct: selOpt === q.correct, level: q.level }];
    setPAnswers(newAnswers); setSelOpt(null); setShowFB(false);
    if (pStep + 1 >= PLACEMENT_QUESTIONS.length) {
      const byLevel = {};
      newAnswers.forEach(a => { if (!byLevel[a.level]) byLevel[a.level] = { c: 0, t: 0 }; byLevel[a.level].t++; if (a.correct) byLevel[a.level].c++; });
      let placed = "A1";
      for (const lvl of ["A1","A2","B1","B2","C1","C2"]) { const d = byLevel[lvl]; if (d && d.c / d.t >= 0.5) placed = lvl; }
      const xpMap = { A1: 0, A2: 300, B1: 800, B2: 1600, C1: 2800, C2: 4500 };
      updateProfile(p.id, { placementDone: true, placementLevel: placed, xp: xpMap[placed] });
      setScreen("placement_result");
    } else { setPStep(s => s + 1); }
  };

  // ── Exercise ──
  const resetExState = () => setExState({ answer: "", selOpt: null, wordAns: [], usedIdx: [], checked: false, isCorrect: false, checking: false });

  const startExercise = () => {
    setShowResult(false);
    setSession({ correct: 0, total: 0, xpEarned: 0 });
    setExCount(0);
    setScreen("exercise");
    const ex = getLocalExercise(getLevelFromXP(p?.xp ?? 0).id);
    setExercise(ex);
    resetExState();
  };

  const loadNext = () => {
    const ex = getLocalExercise(getLevelFromXP(p?.xp ?? 0).id);
    setExercise(ex);
    resetExState();
  };

  const checkAnswer = async () => {
    if (!exercise || !p) return;
    let ua = "";
    if (exercise.type === "fill_blank") ua = exState.selOpt ?? "";
    else if (exercise.type === "word_order") ua = exState.wordAns.join(" ");
    else ua = exState.answer.trim();

    let isCorrect = normalize(ua) === normalize(exercise.answer ?? "");

    // For translations: flexible AI check only if running inside claude.ai context
    if (!isCorrect && (exercise.type === "translate_to_en" || exercise.type === "translate_to_pt") && ua.length > 2) {
      setExState(s => ({ ...s, checking: true }));
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514", max_tokens: 20,
            system: "You are a language teacher. Answer ONLY with 'correct' or 'wrong'.",
            messages: [{ role: "user", content: `Expected: "${exercise.answer}"\nStudent answered: "${ua}"\nIs this a valid translation? Answer ONLY 'correct' or 'wrong'.` }]
          })
        });
        if (res.ok) {
          const data = await res.json();
          const verdict = data.content?.find(b => b.type === "text")?.text?.toLowerCase() ?? "";
          isCorrect = verdict.includes("correct");
        }
      } catch { /* API not available — keep local result */ }
    }

    const xpMap = { A1: 10, A2: 15, B1: 20, B2: 25, C1: 30, C2: 40 };
    const xpGain = isCorrect ? (xpMap[currentLevel.id] || 10) : 0;
    const today = getTodayKey();
    updateProfile(p.id, {
      xp: p.xp + xpGain,
      hearts: isCorrect ? p.hearts : Math.max(0, p.hearts - 1),
      streak: p.lastActiveDay !== today ? p.streak + 1 : p.streak,
      lastActiveDay: today,
    });
    setExState(s => ({ ...s, checked: true, isCorrect, checking: false }));
    setSession(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1, xpEarned: s.xpEarned + xpGain }));
  };

  const nextExercise = () => {
    const nc = exCount + 1; setExCount(nc);
    if (nc >= 5) { setShowResult(true); setScreen("home"); return; }
    loadNext();
  };

  const addWord = (w, i) => { if (exState.checked) return; setExState(s => ({ ...s, wordAns: [...s.wordAns, w], usedIdx: [...s.usedIdx, i] })); };
  const removeLastWord = () => { if (exState.checked) return; setExState(s => ({ ...s, wordAns: s.wordAns.slice(0, -1), usedIdx: s.usedIdx.slice(0, -1) })); };

  const weekDays = () => {
    const days = ["S","M","T","W","T","F","S"]; const ti = new Date().getDay();
    return days.map((d, i) => ({ label: d, isToday: i === ti, done: i < ti && (p?.streak ?? 0) > ti - i - 1 }));
  };

  const canCheck = () => {
    if (!exercise) return false;
    if (exercise.type === "fill_blank") return !!exState.selOpt;
    if (exercise.type === "word_order") return exState.wordAns.length > 0;
    return exState.answer.trim().length > 0;
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* INSTALL BANNER */}
        {showInstallBanner && (
          <div className="install-banner">
            <span style={{fontSize:20}}>📲</span>
            <span style={{flex:1,fontWeight:500}}>Install Fluent on your device!</span>
            <button onClick={handleInstall} style={{background:"#fff",color:"var(--accent)",border:"none",borderRadius:8,padding:"6px 12px",fontWeight:700,cursor:"pointer",fontSize:13}}>Install</button>
            <button onClick={()=>setShowInstallBanner(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:20,lineHeight:1,padding:"0 4px"}}>×</button>
          </div>
        )}

        {/* SWITCHER PANEL */}
        {showSwitcher && (
          <div className="overlay" onClick={()=>{setShowSwitcher(false);setConfirmDel(null);}}>
            <div className="panel" onClick={e=>e.stopPropagation()}>
              <div className="panel-handle"/>
              <h3>Switch Profile</h3>
              {store.profiles.map(prof=>(
                <div key={prof.id}>
                  <div className={`sw-row${prof.id===store.activeId?" sw-active":""}`} onClick={()=>selectProfile(prof.id)}>
                    <div className="sw-av">{prof.avatar}</div>
                    <div><div className="sw-name">{prof.name}</div><div className="sw-sub">{getLevelFromXP(prof.xp).id} · {prof.xp} XP · 🔥{prof.streak}</div></div>
                    {prof.id===store.activeId && <span style={{marginLeft:"auto",fontSize:18,color:"var(--accent)"}}>✓</span>}
                    <button className="sw-del" onClick={e=>{e.stopPropagation();setConfirmDel(confirmDel===prof.id?null:prof.id);}}>🗑</button>
                  </div>
                  {confirmDel===prof.id && (
                    <div className="confirm-box">
                      <p>Delete <strong>{prof.name}</strong>? This cannot be undone.</p>
                      <div className="confirm-row">
                        <button className="btn btn-sm" style={{background:"var(--danger)",color:"#fff",border:"none"}} onClick={()=>deleteProfile(prof.id)}>Delete</button>
                        <button className="btn btn-ghost btn-sm" onClick={()=>setConfirmDel(null)}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button className="add-profile-btn" style={{marginTop:14}} onClick={()=>{setShowSwitcher(false);setScreen("create");}}>+ Add Profile</button>
            </div>
          </div>
        )}

        {/* NAV */}
        {!["profiles","create","placement","exercise"].includes(screen) && !showResult && (
          <nav className="nav">
            <div className="nav-logo">fluent.</div>
            <div className="nav-right">
              {p && <>
                <div className="nav-stat"><span>🔥</span><span className="val">{p.streak}</span></div>
                <div className="nav-stat"><span>⚡</span><span className="val">{p.xp}</span></div>
                <div className="hearts">{[...Array(5)].map((_,i)=><span key={i} className={`heart${i>=p.hearts?" empty":""}`}>❤️</span>)}</div>
              </>}
              <button className="profile-btn" onClick={()=>setShowSwitcher(true)}>
                <span className="av">{p?.avatar??"👤"}</span>
                <span style={{maxWidth:70,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p?.name??"Select"}</span>
              </button>
            </div>
          </nav>
        )}

        <div className="main">

          {/* SESSION RESULT */}
          {showResult && (
            <div className="fade-in">
              <div className="result-icon">{session.correct>=4?"🏆":session.correct>=2?"👍":"💪"}</div>
              <div className="result-title">{session.correct>=4?"Excellent!":session.correct>=2?"Good job!":"Keep going!"}</div>
              <div className="result-sub">Session complete · {session.correct}/{session.total} correct</div>
              <div className="xp-gained">+{session.xpEarned} <span style={{fontSize:18}}>XP</span></div>
              <div className="result-stats">
                <div className="result-stat"><div className="val">{session.correct}</div><div className="lbl">Correct</div></div>
                <div className="result-stat"><div className="val">{session.total-session.correct}</div><div className="lbl">Errors</div></div>
                <div className="result-stat"><div className="val">{p?.streak??0}🔥</div><div className="lbl">Streak</div></div>
              </div>
              <button className="btn btn-primary" onClick={()=>{setShowResult(false);setTab("home");}}>Back to Home</button>
              <button className="btn btn-ghost" style={{width:"100%",marginTop:10}} onClick={startExercise}>Practice More</button>
            </div>
          )}

          {/* PROFILES */}
          {screen==="profiles" && !showResult && (
            <div className="profiles-screen fade-in">
              <h1>fluent.</h1>
              <p>Select a profile to continue learning</p>
              <div className="profiles-list">
                {store.profiles.length===0 && <div style={{textAlign:"center",padding:"24px 0",color:"var(--text2)",fontSize:14}}>No profiles yet. Create one below!</div>}
                {store.profiles.map(prof=>(
                  <div key={prof.id} className={`profile-card${prof.id===store.activeId?" is-active":""}`} onClick={()=>selectProfile(prof.id)}>
                    <div className="profile-av">{prof.avatar}</div>
                    <div style={{flex:1}}><div className="pname">{prof.name}</div><div className="psub">{getLevelFromXP(prof.xp).id} · {prof.xp} XP · 🔥 {prof.streak} days</div></div>
                    <span style={{fontSize:18,color:"var(--text3)"}}>→</span>
                  </div>
                ))}
              </div>
              <button className="add-profile-btn" onClick={()=>setScreen("create")}>+ New Profile</button>
            </div>
          )}

          {/* CREATE */}
          {screen==="create" && !showResult && (
            <div className="create-screen fade-in">
              {store.profiles.length>0 && <button className="btn btn-ghost btn-sm" style={{marginBottom:20}} onClick={()=>setScreen(store.activeId?"home":"profiles")}>← Back</button>}
              <h2>New Profile</h2>
              <p>Pick an avatar and enter your name.</p>
              <div className="section-title">Choose an avatar</div>
              <div className="avatar-grid">
                {AVATARS.map(av=><div key={av} className={`av-opt${createAv===av?" sel":""}`} onClick={()=>setCreateAv(av)}>{av}</div>)}
              </div>
              <div className="section-title">Your name</div>
              <input className="name-input" placeholder="e.g. Maria, João…" value={createName}
                onChange={e=>setCreateName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&createProfile()} maxLength={20}/>
              <button className="btn btn-primary" onClick={createProfile} disabled={!createName.trim()}>{createAv} Start Learning →</button>
            </div>
          )}

          {/* PLACEMENT TEST */}
          {screen==="placement" && !showResult && (
            <div className="fade-in">
              <div style={{textAlign:"center",marginBottom:28}}>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,marginBottom:6}}>Placement Test</div>
                <div style={{color:"var(--text2)",fontSize:14}}>Let's find your English level</div>
              </div>
              <div className="q-counter">QUESTION {pStep+1} / {PLACEMENT_QUESTIONS.length}</div>
              <div className="q-progress"><div className="q-progress-fill" style={{width:`${((pStep+1)/PLACEMENT_QUESTIONS.length)*100}%`}}/></div>
              {(()=>{
                const q=PLACEMENT_QUESTIONS[pStep]; const answered=showFB;
                return <>
                  <div className="question-text">{q.question}</div>
                  <div className="options">
                    {q.options.map((opt,i)=>(
                      <button key={i}
                        className={`option${selOpt===i?(i===q.correct?" correct":" wrong"):answered&&i===q.correct?" correct":""}`}
                        onClick={()=>handlePlacementOpt(i)} disabled={answered}
                      >{opt}</button>
                    ))}
                  </div>
                  {answered && (
                    <div className="mt-16">
                      <div style={{padding:"12px 16px",borderRadius:10,background:selOpt===q.correct?"var(--accent-light)":"var(--danger-light)",border:`1px solid ${selOpt===q.correct?"var(--accent2)":"var(--danger)"}`,marginBottom:12}}>
                        <div style={{fontWeight:600,fontSize:14,color:selOpt===q.correct?"var(--accent)":"var(--danger)"}}>{selOpt===q.correct?"✅ Correct!":"❌ Incorrect."}</div>
                        <div style={{fontSize:13,color:"var(--text2)",marginTop:4}}>{q.explanation}</div>
                      </div>
                      <button className="btn btn-primary" onClick={nextPlacementQ}>{pStep+1>=PLACEMENT_QUESTIONS.length?"See my level →":"Next →"}</button>
                    </div>
                  )}
                </>;
              })()}
            </div>
          )}

          {/* PLACEMENT RESULT */}
          {screen==="placement_result" && !showResult && (
            <div className="fade-in" style={{textAlign:"center",paddingTop:32}}>
              <div style={{display:"inline-block",fontFamily:"'DM Serif Display',serif",fontSize:48,color:"var(--accent)",background:"var(--accent-light)",width:100,height:100,lineHeight:"100px",borderRadius:"50%",marginBottom:20}}>{p?.placementLevel}</div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,marginBottom:8}}>Your level: {LEVELS.find(l=>l.id===p?.placementLevel)?.name}</div>
              <p style={{color:"var(--text2)",fontSize:14,marginBottom:28}}>Your exercises will be tailored to this level and get harder as you improve.</p>
              <button className="btn btn-primary" onClick={()=>{setScreen("home");setTab("home");}}>Start Learning →</button>
            </div>
          )}

          {/* EXERCISE */}
          {screen==="exercise" && !showResult && (
            <div className="fade-in">
              <div className="ex-topbar">
                <button className="ex-close" onClick={()=>setScreen("home")}>✕</button>
                <div className="ex-progress"><div className="ex-progress-fill" style={{width:`${(exCount/5)*100}%`}}/></div>
                <div className="hearts">{[...Array(5)].map((_,i)=><span key={i} className={`heart${i>=(p?.hearts??5)?" empty":""}`} style={{fontSize:14}}>❤️</span>)}</div>
              </div>

              {exercise && (
                <>
                  <div className="ex-source">
                    <span>📚</span>
                    <span>Level {currentLevel.id} · {currentLevel.name} · Exercise {exCount+1}/5</span>
                  </div>

                  {/* TRANSLATE TO EN */}
                  {exercise.type==="translate_to_en" && <>
                    <div className="ex-type">🇧🇷 → 🇬🇧 Translate to English</div>
                    <div className="ex-q">{exercise.sentence_pt}</div>
                    <div className="ex-hint">💡 {exercise.hint}</div>
                    <textarea className={`ex-input${exState.checked?(exState.isCorrect?" correct":" wrong"):""}`} rows={3}
                      placeholder="Type the English translation…" value={exState.answer}
                      onChange={e=>!exState.checked&&setExState(s=>({...s,answer:e.target.value}))}
                      disabled={exState.checked}/>
                  </>}

                  {/* TRANSLATE TO PT */}
                  {exercise.type==="translate_to_pt" && <>
                    <div className="ex-type">🇬🇧 → 🇧🇷 Translate to Portuguese</div>
                    <div className="ex-q">{exercise.sentence_en}</div>
                    <div className="ex-hint">💡 {exercise.hint}</div>
                    <textarea className={`ex-input${exState.checked?(exState.isCorrect?" correct":" wrong"):""}`} rows={3}
                      placeholder="Digite a tradução em português…" value={exState.answer}
                      onChange={e=>!exState.checked&&setExState(s=>({...s,answer:e.target.value}))}
                      disabled={exState.checked}/>
                  </>}

                  {/* FILL BLANK */}
                  {exercise.type==="fill_blank" && <>
                    <div className="ex-type">✏️ Fill in the blank</div>
                    <div className="ex-q">{exercise.sentence}</div>
                    <div className="ex-hint">💡 {exercise.hint}</div>
                    <div className="options">
                      {exercise.options?.map((opt,i)=>(
                        <button key={i}
                          className={`option${exState.selOpt===opt?(exState.checked?(opt===exercise.answer?" correct":" wrong"):" selected"):(exState.checked&&opt===exercise.answer?" correct":"")}`}
                          onClick={()=>!exState.checked&&setExState(s=>({...s,selOpt:opt}))}
                          disabled={exState.checked}
                        >{opt}</button>
                      ))}
                    </div>
                  </>}

                  {/* WORD ORDER */}
                  {exercise.type==="word_order" && <>
                    <div className="ex-type">🔀 Put in the correct order</div>
                    <div className="ex-q">{exercise.words?.length} words to arrange</div>
                    <div className={`word-answer${exState.checked?(exState.isCorrect?" correct":" wrong"):""}`} onClick={removeLastWord}>
                      {exState.wordAns.length===0 && <span style={{color:"var(--text3)",fontSize:13}}>Tap words below — tap here to remove last word</span>}
                      {exState.wordAns.map((w,i)=><span key={i} className="answer-chip">{w}</span>)}
                    </div>
                    <div className="word-pool">
                      {exercise.words?.map((w,i)=>(
                        <button key={i} className={`word-chip${exState.usedIdx.includes(i)?" used":""}`}
                          onClick={()=>addWord(w,i)} disabled={exState.checked||exState.usedIdx.includes(i)}
                        >{w}</button>
                      ))}
                    </div>
                    <div className="ex-hint">💡 {exercise.hint}</div>
                  </>}

                  {/* FEEDBACK */}
                  {exState.checked && (
                    <div className={`feedback-bar ${exState.isCorrect?"correct":"wrong"}`}>
                      <span className="fb-icon">{exState.isCorrect?"✅":"❌"}</span>
                      <div className={`fb-text ${exState.isCorrect?"correct":"wrong"}`}>
                        <strong>{exState.isCorrect?"Correct! Well done!":"Not quite right."}</strong>
                        {!exState.isCorrect && <span>Correct answer: <strong>{exercise.answer}</strong></span>}
                      </div>
                    </div>
                  )}

                  <div className="mt-16">
                    {!exState.checked ? (
                      <button className="btn btn-primary" onClick={checkAnswer} disabled={!canCheck()||exState.checking}>
                        {exState.checking?"Checking…":"Check Answer"}
                      </button>
                    ) : (
                      <button className="btn btn-primary" onClick={nextExercise}>{exCount+1>=5?"Finish Session →":"Next Exercise →"}</button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* HOME TABS */}
          {screen==="home" && !showResult && p && (
            <>
              <div className="tabs">
                <button className={`tab${tab==="home"?" active":""}`} onClick={()=>setTab("home")}>Home</button>
                <button className={`tab${tab==="stats"?" active":""}`} onClick={()=>setTab("stats")}>Progress</button>
                <button className={`tab${tab==="levels"?" active":""}`} onClick={()=>setTab("levels")}>Levels</button>
              </div>

              {tab==="home" && (
                <div className="fade-in">
                  <div className="card">
                    <div className="xp-header">
                      <span className="xp-label">Level {currentLevel.id} · {currentLevel.name}</span>
                      <span className="xp-value">{p.xp} XP{nextLevel?` / ${nextLevel.xpRequired}`:""}</span>
                    </div>
                    <div className="xp-bar"><div className="xp-fill" style={{width:`${xpProgress}%`}}/></div>
                    <div className="level-row">
                      <span className="level-tag">{currentLevel.id}</span>
                      {nextLevel && <span style={{fontSize:12,color:"var(--text3)"}}>{xpProgress}% to {nextLevel.id}</span>}
                    </div>
                  </div>

                  <div className="streak-card mt-12">
                    <div className="streak-flame">🔥</div>
                    <div className="streak-info"><h3>{p.streak} day{p.streak!==1?"s":""}</h3><p>Keep your streak going!</p></div>
                    <div className="spacer"/>
                    <div className="hearts">{[...Array(5)].map((_,i)=><span key={i} className={`heart${i>=p.hearts?" empty":""}`}>❤️</span>)}</div>
                  </div>

                  <div className="card mt-12">
                    <div className="section-title">This week</div>
                    <div className="week-strip">
                      {weekDays().map((d,i)=>(
                        <div key={i} className="day-dot">
                          <div className="d-label">{d.label}</div>
                          <div className={`d-circle${d.done?" done":""}${d.isToday?" today":""}`}>{d.done?"✓":d.isToday?"·":""}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="section-title mt-20">Practice</div>
                  <div className="menu-grid">
                    <div className="menu-item" onClick={startExercise}><div className="menu-item-icon">✏️</div><div className="menu-item-label">Daily Practice</div><div className="menu-item-sub">5 exercises · {currentLevel.id}</div></div>
                    <div className="menu-item" onClick={()=>{setPStep(0);setPAnswers([]);setScreen("placement");}}>
                      <div className="menu-item-icon">🎯</div><div className="menu-item-label">Level Test</div>
                      <div className="menu-item-sub">{p.placementDone?`Placed at ${p.placementLevel}`:"Find your level"}</div>
                    </div>
                    <div className="menu-item" onClick={()=>setTab("stats")}><div className="menu-item-icon">📊</div><div className="menu-item-label">Progress</div><div className="menu-item-sub">Your stats</div></div>
                    <div className="menu-item" onClick={()=>setShowSwitcher(true)}><div className="menu-item-icon">👥</div><div className="menu-item-label">Profiles</div><div className="menu-item-sub">{store.profiles.length} profile{store.profiles.length!==1?"s":""}</div></div>
                  </div>
                  {p.hearts===0 && <div className="card mt-16" style={{borderColor:"var(--danger)",background:"var(--danger-light)"}}><div style={{fontSize:13,color:"var(--danger)",fontWeight:500}}>❤️ No hearts left — they reset tomorrow.</div></div>}
                </div>
              )}

              {tab==="stats" && (
                <div className="fade-in">
                  <div style={{display:"flex",alignItems:"center",gap:14,padding:"0 0 20px"}}>
                    <div style={{fontSize:42}}>{p.avatar}</div>
                    <div><div style={{fontFamily:"'DM Serif Display',serif",fontSize:20}}>{p.name}</div><div style={{fontSize:12,color:"var(--text2)"}}>Since {p.createdAt}</div></div>
                  </div>
                  <div className="stats-grid">
                    <div className="stat-box"><div className="big">{p.xp}</div><div className="lbl">Total XP</div></div>
                    <div className="stat-box"><div className="big">{p.streak}🔥</div><div className="lbl">Day Streak</div></div>
                    <div className="stat-box"><div className="big">{currentLevel.id}</div><div className="lbl">Level</div></div>
                    <div className="stat-box"><div className="big">{p.hearts}❤️</div><div className="lbl">Hearts</div></div>
                  </div>
                  <div className="card">
                    <div className="section-title">Level Progress</div>
                    <div className="xp-bar" style={{height:12}}><div className="xp-fill" style={{width:`${xpProgress}%`}}/></div>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:12,color:"var(--text2)"}}>
                      <span>{currentLevel.id} · {currentLevel.name}</span>
                      {nextLevel && <span>{nextLevel.id} · {nextLevel.name}</span>}
                    </div>
                  </div>
                  <div className="card mt-12">
                    <div className="section-title">All Profiles</div>
                    {store.profiles.map(prof=>{
                      const lv=getLevelFromXP(prof.xp);
                      return (
                        <div key={prof.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                          <div style={{fontSize:24}}>{prof.avatar}</div>
                          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{prof.name}{prof.id===store.activeId?" (you)":""}</div><div style={{fontSize:12,color:"var(--text2)"}}>{lv.id} · {prof.xp} XP · 🔥{prof.streak}</div></div>
                        </div>
                      );
                    })}
                    <button className="add-profile-btn" style={{marginTop:12}} onClick={()=>setScreen("create")}>+ Add Profile</button>
                  </div>
                </div>
              )}

              {tab==="levels" && (
                <div className="fade-in">
                  <div style={{textAlign:"center",marginBottom:24}}>
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"var(--accent-light)",color:"var(--accent)",fontSize:12,fontWeight:600,letterSpacing:".8px",textTransform:"uppercase",padding:"5px 12px",borderRadius:20,marginBottom:14}}>🏅 CEFR Framework</div>
                    <div style={{fontFamily:"'DM Serif Display',serif",fontSize:24,marginBottom:6}}>Your Path to Fluency</div>
                    <div style={{color:"var(--text2)",fontSize:14}}>From beginner to mastery.</div>
                  </div>
                  {LEVELS.map((lvl,i)=>{
                    const reached=p.xp>=lvl.xpRequired; const isCurr=lvl.id===currentLevel.id;
                    const nxt=LEVELS[i+1]; const prog=isCurr&&nxt?Math.round(((p.xp-lvl.xpRequired)/(nxt.xpRequired-lvl.xpRequired))*100):reached?100:0;
                    return (
                      <div key={lvl.id} className="card" style={{marginBottom:10,borderColor:isCurr?"var(--accent2)":undefined}}>
                        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:isCurr?12:0}}>
                          <div style={{width:44,height:44,borderRadius:"50%",background:reached?"var(--accent)":"var(--surface2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:reached?"#fff":"var(--text3)",flexShrink:0}}>{lvl.id}</div>
                          <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{lvl.name}{isCurr?" ← you":""}</div><div style={{fontSize:12,color:"var(--text2)"}}>{lvl.xpRequired} XP required</div></div>
                          <span>{reached?(isCurr?"🎯":"✅"):"🔒"}</span>
                        </div>
                        {isCurr&&nxt&&<><div className="xp-bar"><div className="xp-fill" style={{width:`${prog}%`}}/></div><div style={{fontSize:11,color:"var(--text3)",marginTop:6}}>{p.xp-lvl.xpRequired} / {nxt.xpRequired-lvl.xpRequired} XP to {nxt.id}</div></>}
                      </div>
                    );
                  })}
                  <button className="btn btn-primary mt-20" onClick={startExercise}>Practice Now →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
