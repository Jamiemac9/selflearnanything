/* Self Learn Anything — engine.
   Lessons carry no dates: the next lesson is the first unfinished one, so nothing skips.
   State lives in localStorage and optionally syncs through /api/sync (Cloudflare KV).
   Motion is progressive: everything works and reads with reduced motion. */
"use strict";

var KEY = "sla.v1", SYNC_KEY = "sla.sync.code", SYNC_AT = "sla.sync.at";
var RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

var LEVELS = [
  [0, "Beginner"], [150, "Learner"], [400, "Practitioner"], [800, "Confident"],
  [1400, "Adviser"], [2200, "Specialist"], [3200, "Expert"]
];
var GRADE_KEY = [["1", "Read it"], ["2", "With notes"], ["3", "Cold"], ["4", "Under challenge"]];
var BADGES = [
  ["First step", "One question right", function (c) { return c.right >= 1; }],
  ["First lesson", "A whole lesson finished", function (c) { return c.lessons >= 1; }],
  ["Ten right", "Ten right first time", function (c) { return c.right >= 10; }],
  ["Fifty right", "Fifty right first time", function (c) { return c.right >= 50; }],
  ["Three days", "Three days running", function (c) { return c.best >= 3; }],
  ["Two weeks", "Fourteen days running", function (c) { return c.best >= 14; }],
  ["Author", "Wrote your own track", function (c) { return c.mine >= 1; }],
  ["Capturer", "Ten questions of your own", function (c) { return c.captured >= 10; }],
  ["First seal", "Graded a track 4", function (c) { return c.g4 >= 1; }],
  ["Finisher", "Every lesson in a track", function (c) { return c.tracksDone >= 1; }]
];
var SHADES = ["red", "maroon", "ink", "lime"];

/* ================= state ================= */

function fresh() { return { v: 1, tracks: [], prog: {}, grades: {}, log: {}, hidden: [], subjects: [], focus: "", theme: "", at: 0 }; }
var S = fresh();

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var p = JSON.parse(raw);
      if (p && typeof p === "object") Object.keys(fresh()).forEach(function (k) { if (p[k] != null) S[k] = p[k]; });
    }
  } catch (e) { /* private mode: run from defaults */ }
  applyTheme();
}
function saveLocal() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch (e) { toast("Could not save — storage is full or blocked", true); }
}
function save() { S.at = Date.now(); saveLocal(); queueSync(); }
function applyTheme() {
  if (S.theme) document.documentElement.setAttribute("data-theme", S.theme);
  else document.documentElement.removeAttribute("data-theme");
}

/* ================= helpers ================= */

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function dayKey(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function today() { return dayKey(new Date()); }
function uid(p) { return (p || "x") + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function wrapTables(h) { return String(h).replace(/<table/g, '<div class="tablewrap"><table').replace(/<\/table>/g, "</table></div>"); }
function plural(n, w) { return n + " " + w + (n === 1 ? "" : "s"); }
function ago(ms) {
  var s = Math.round((Date.now() - ms) / 1000);
  if (s < 45) return "just now";
  if (s < 3600) return Math.round(s / 60) + " min ago";
  if (s < 86400) return Math.round(s / 3600) + " h ago";
  return Math.round(s / 86400) + " d ago";
}
function toast(msg, bad) {
  var t = document.getElementById("toast");
  t.innerHTML = msg; t.className = "toast show" + (bad ? " bad" : "");
  clearTimeout(toast._t); toast._t = setTimeout(function () { t.className = "toast"; }, 2800);
}

/* ================= data ================= */

function allTracks() {
  var seed = (window.SLA_SEED || []).filter(function (t) { return S.hidden.indexOf(t.id) < 0; });
  return seed.concat((S.tracks || []).map(hydrate));
}
function getTrack(id) { var a = allTracks(); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; }
function isMine(id) { return (S.tracks || []).some(function (t) { return t.id === id; }); }

/* ================= subjects ================= */

function allSubjects() {
  var seen = {}, out = [];
  (window.SLA_SUBJECTS || []).concat(S.subjects || []).forEach(function (x) {
    if (x && x.id && !seen[x.id]) { seen[x.id] = 1; out.push(x); }
  });
  return out;
}
function subjectById(id) { var a = allSubjects(); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; }
function tracksIn(sid) { return allTracks().filter(function (t) { return (t.subjects || []).indexOf(sid) >= 0; }); }
function focusTracks() { return S.focus && subjectById(S.focus) ? tracksIn(S.focus) : allTracks(); }
function seedFor(id) { var a = window.SLA_SEED || []; for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; }
/* A seed track you have added to is stored as your own copy; keep feeding it the seed's links and subjects. */
function hydrate(t) {
  var src = seedFor(t.id); if (!src) return t;
  if (!t.subjects) t.subjects = (src.subjects || []).slice();
  (t.lessons || []).forEach(function (l) {
    var sl = (src.lessons || []).filter(function (x) { return x.id === l.id; })[0]; if (!sl) return;
    if (!l.links && sl.links) l.links = sl.links;
    (l.steps || []).forEach(function (st, i) {
      var ss = (sl.steps || [])[i];
      if (ss && ss.title === st.title && !st.links && ss.links) st.links = ss.links;
    });
  });
  return t;
}
function subjectTags(t) {
  var tags = (t.subjects || []).map(subjectById).filter(Boolean);
  if (!tags.length) return "";
  return '<div class="stags">' + tags.map(function (x) {
    return '<a class="stag tone-' + esc(x.tone || "ink") + '" href="#/s/' + esc(x.id) + '">' + esc(x.name) + '</a>';
  }).join("") + '</div>';
}
function chipsRow() {
  var subs = allSubjects().filter(function (x) { return tracksIn(x.id).length; });
  if (!subs.length) return "";
  var h = ['<div class="chips" aria-label="Focus on a subject"><button type="button" class="chipf' + (!S.focus ? " on" : "") + '" data-focus="" aria-pressed="' + (!S.focus) + '">All</button>'];
  subs.forEach(function (x) {
    var on = S.focus === x.id;
    h.push('<button type="button" class="chipf tone-' + esc(x.tone || "ink") + (on ? " on" : "") + '" data-focus="' + esc(x.id) + '" aria-pressed="' + on + '">' +
      esc(x.name) + '<small>' + tracksIn(x.id).length + '</small></button>');
  });
  h.push('</div>');
  return h.join("");
}

/* ================= reading links ================= */

function lessonLinks(l) {
  var out = [], seen = {};
  function add(x, where, step) {
    if (!x || !x.url || seen[x.url]) return;
    seen[x.url] = 1;
    out.push({ label: x.label || x.url, url: x.url, note: x.note || "", where: where, step: step });
  }
  (l.links || []).forEach(function (x) { add(x, "For this lesson", -1); });
  if (l.link) add({ label: l.linkLabel || l.link, url: l.link }, "For this lesson", -1);
  (l.steps || []).forEach(function (st, i) { (st.links || []).forEach(function (x) { add(x, "Step " + (i + 1) + " · " + st.title, i); }); });
  return out;
}
function host(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } }
function linkBtn(x) {
  return '<a class="linkbtn" href="' + esc(x.url) + '" target="_blank" rel="noopener noreferrer">' +
    '<span class="lb-tx"><span class="lb-t">' + esc(x.label) + '</span><span class="lb-m">' + esc(x.note ? x.note + " · " + host(x.url) : host(x.url)) + '</span></span>' +
    '<i aria-hidden="true">↗</i></a>';
}
function readingSheet(links, si) {
  if (!links.length) return "";
  var here = links.filter(function (x) { return x.step === si; });
  var rest = links.filter(function (x) { return x.step !== si; });
  var groups = {}, order = [];
  rest.forEach(function (x) { if (!groups[x.where]) { groups[x.where] = []; order.push(x.where); } groups[x.where].push(x); });
  return '<div class="sheet" id="sheet" hidden><div class="sheet-back" data-close></div>' +
    '<div class="sheet-panel" role="dialog" aria-modal="true" aria-labelledby="sheet-t"><div class="sheet-grab" aria-hidden="true"></div>' +
    '<div class="sheet-head"><h2 id="sheet-t">READING</h2><button type="button" class="sheet-x" data-close aria-label="Close reading">×</button></div>' +
    '<p class="fine" style="margin-top:0">Opens in a new tab. Your place in the lesson stays put.</p>' +
    (here.length ? '<h3 class="sheet-g">This step</h3><div class="links">' + here.map(linkBtn).join("") + '</div>' : '') +
    order.map(function (g) { return '<h3 class="sheet-g">' + esc(g) + '</h3><div class="links">' + groups[g].map(linkBtn).join("") + '</div>'; }).join("") +
    '</div></div>';
}
function lp(tid, lid) {
  S.prog[tid] = S.prog[tid] || {};
  S.prog[tid][lid] = S.prog[tid][lid] || { step: 0, ans: {}, note: "", at: 0 };
  return S.prog[tid][lid];
}
function qTotal(l) { var n = 0; (l.steps || []).forEach(function (s) { n += (s.qs || []).length; }); return n; }
function qRight(tid, l) {
  var p = (S.prog[tid] || {})[l.id]; if (!p) return 0;
  var n = 0;
  (l.steps || []).forEach(function (s, si) { (s.qs || []).forEach(function (q, qi) { if (p.ans[si + "-" + qi] === q.correct) n++; }); });
  return n;
}
function lessonDone(tid, l) { var t = qTotal(l); return t > 0 && qRight(tid, l) === t; }
function stepDone(tid, l, si) {
  var p = (S.prog[tid] || {})[l.id]; if (!p) return false;
  var qs = (l.steps[si] || {}).qs || [];
  return qs.length > 0 && qs.every(function (q, qi) { return p.ans[si + "-" + qi] === q.correct; });
}
/* Sequential. The next lesson is the first unfinished one — never skipped, never late. */
function nextLesson(t) {
  var ls = t.lessons || [];
  for (var i = 0; i < ls.length; i++) if (!lessonDone(t.id, ls[i])) return { lesson: ls[i], i: i };
  return null;
}
function trackCounts(t) {
  var ls = t.lessons || [], done = 0;
  ls.forEach(function (l) { if (lessonDone(t.id, l)) done++; });
  var road = (t.syllabus || []).length;
  return { total: ls.length, done: done, road: road, pct: ls.length ? Math.round(done / ls.length * 100) : 0 };
}
function counts() {
  var c = { right: 0, answered: 0, lessons: 0, tracksDone: 0, mine: (S.tracks || []).length, captured: 0, g4: 0 };
  allTracks().forEach(function (t) {
    var tc = trackCounts(t);
    if (tc.total && tc.done === tc.total && !tc.road) c.tracksDone++;
    (t.lessons || []).forEach(function (l) {
      var p = (S.prog[t.id] || {})[l.id];
      if (p) (l.steps || []).forEach(function (s, si) {
        (s.qs || []).forEach(function (q, qi) {
          var a = p.ans[si + "-" + qi];
          if (a != null) { c.answered++; if (a === q.correct) c.right++; }
        });
      });
      if (l.id === "captured") c.captured += qTotal(l);
      if (lessonDone(t.id, l)) c.lessons++;
    });
  });
  var gsum = 0;
  Object.keys(S.grades).forEach(function (k) { gsum += S.grades[k] || 0; if (S.grades[k] === 4) c.g4++; });
  c.xp = c.right * 10 + c.lessons * 40 + gsum * 15;
  c.streak = streak(); c.best = bestStreak();
  return c;
}
function streak() {
  var run = 0, p = new Date();
  if (!S.log[today()]) p.setDate(p.getDate() - 1);
  for (var i = 0; i < 1000; i++) { if (!S.log[dayKey(p)]) break; run++; p.setDate(p.getDate() - 1); }
  return run;
}
function bestStreak() {
  var ks = Object.keys(S.log).sort(), best = 0, run = 0, prev = null;
  ks.forEach(function (k) {
    run = prev && Math.round((new Date(k + "T00:00:00") - new Date(prev + "T00:00:00")) / 86400000) === 1 ? run + 1 : 1;
    if (run > best) best = run; prev = k;
  });
  return best;
}
function levelOf(xp) {
  var i = 0; LEVELS.forEach(function (l, j) { if (xp >= l[0]) i = j; });
  var cur = LEVELS[i][0], nxt = LEVELS[i + 1];
  return { i: i, name: LEVELS[i][1], next: nxt || null, pct: nxt ? Math.round((xp - cur) / (nxt[0] - cur) * 100) : 100 };
}
function touch() { S.log[today()] = (S.log[today()] || 0) + 1; }

/* What you actually know: recap lines from finished lessons, plus your own questions. */
function knowledge() {
  var out = [];
  allTracks().forEach(function (t) {
    (t.lessons || []).forEach(function (l) {
      if (l.id === "captured") {
        ((l.steps[0] || {}).qs || []).forEach(function (q) { out.push({ t: t.title, s: q.q, mine: true }); });
      } else if (lessonDone(t.id, l)) {
        (l.recap || []).forEach(function (r) { out.push({ t: t.title, s: r.replace(/<[^>]+>/g, "") }); });
      }
    });
  });
  return out;
}

/* ================= merge (sync + import never lose progress) ================= */

function merge(a, b) {
  a = a || fresh(); b = b || fresh();
  var out = fresh();
  var newer = (b.at || 0) > (a.at || 0) ? b : a, older = newer === a ? b : a;

  var byId = {};
  (older.tracks || []).forEach(function (t) { byId[t.id] = t; });
  (newer.tracks || []).forEach(function (t) {
    var o = byId[t.id];
    byId[t.id] = !o || (t.updatedAt || 0) >= (o.updatedAt || 0) ? t : o;
  });
  out.tracks = Object.keys(byId).map(function (k) { return byId[k]; });

  out.hidden = (a.hidden || []).concat(b.hidden || []).filter(function (v, i, arr) { return arr.indexOf(v) === i; });
  var subs = {};
  (a.subjects || []).concat(b.subjects || []).forEach(function (x) { if (x && x.id) subs[x.id] = x; });
  out.subjects = Object.keys(subs).map(function (k) { return subs[k]; });
  out.focus = a.focus || "";

  [a.prog || {}, b.prog || {}].forEach(function (pg) {
    Object.keys(pg).forEach(function (tid) {
      out.prog[tid] = out.prog[tid] || {};
      Object.keys(pg[tid]).forEach(function (lid) {
        var inc = pg[tid][lid] || {}, cur = out.prog[tid][lid];
        if (!cur) { out.prog[tid][lid] = { step: inc.step || 0, ans: Object.assign({}, inc.ans || {}), note: inc.note || "", at: inc.at || 0 }; return; }
        var incNewer = (inc.at || 0) > (cur.at || 0);
        var ans = incNewer ? Object.assign({}, cur.ans, inc.ans) : Object.assign({}, inc.ans, cur.ans);
        out.prog[tid][lid] = {
          step: incNewer ? (inc.step || 0) : cur.step,
          ans: ans,
          note: incNewer ? (inc.note || cur.note || "") : (cur.note || inc.note || ""),
          at: Math.max(inc.at || 0, cur.at || 0)
        };
      });
    });
  });

  out.grades = Object.assign({}, older.grades || {}, newer.grades || {});
  [a.log || {}, b.log || {}].forEach(function (lg) {
    Object.keys(lg).forEach(function (k) { out.log[k] = Math.max(out.log[k] || 0, lg[k] || 0); });
  });
  out.theme = a.theme || b.theme || "";
  out.at = Math.max(a.at || 0, b.at || 0);
  return out;
}

/* ================= sync ================= */

var SY = { busy: false, err: "", timer: null };
function syncCode() { try { return localStorage.getItem(SYNC_KEY) || ""; } catch (e) { return ""; } }
function setSyncCode(c) { try { c ? localStorage.setItem(SYNC_KEY, c) : localStorage.removeItem(SYNC_KEY); } catch (e) { } }
function syncAt() { try { return +localStorage.getItem(SYNC_AT) || 0; } catch (e) { return 0; } }
function newCode() {
  var abc = "0123456789ABCDEFGHJKMNPQRSTVWXYZ", b = new Uint8Array(16), s = "";
  crypto.getRandomValues(b);
  for (var i = 0; i < 16; i++) s += abc[b[i] % 32];
  return s;
}
function fmtCode(c) { return c.replace(/(.{4})(?=.)/g, "$1-"); }
function normCode(c) { return String(c || "").toUpperCase().replace(/[^0-9A-Z]/g, ""); }
function validCode(c) { return /^[0-9A-HJKMNP-TV-Z]{16}$/.test(c); }

function queueSync() {
  if (!syncCode()) return;
  clearTimeout(SY.timer);
  SY.timer = setTimeout(function () { syncNow(true); }, 5000);
}
function syncNow(silent) {
  var code = syncCode();
  if (!code || SY.busy) return Promise.resolve();
  if (navigator.onLine === false) { SY.err = "Offline"; paintSync(); return Promise.resolve(); }
  SY.busy = true; SY.err = ""; paintSync();
  var before = JSON.stringify(S);
  return fetch("/api/sync", { headers: { "x-sync-code": code }, cache: "no-store" })
    .then(function (r) {
      if (r.status === 200) return r.json().then(function (j) { return j && j.state; });
      if (r.status === 404) return null;
      return r.json().catch(function () { return {}; }).then(function (j) { throw new Error(j.error || ("Sync error " + r.status)); });
    })
    .then(function (remote) {
      if (remote) S = merge(S, remote);
      saveLocal();
      return fetch("/api/sync", {
        method: "PUT", headers: { "x-sync-code": code, "content-type": "application/json" },
        body: JSON.stringify({ state: S })
      });
    })
    .then(function (r) {
      if (!r.ok) return r.json().catch(function () { return {}; }).then(function (j) { throw new Error(j.error || ("Sync error " + r.status)); });
      try { localStorage.setItem(SYNC_AT, String(Date.now())); } catch (e) { }
      if (JSON.stringify(S) !== before) safeRerender();
      if (!silent) toast("Synced");
    })
    .catch(function (e) {
      SY.err = (e && e.message) || "Sync failed";
      if (/Failed to fetch|NetworkError|Load failed/i.test(SY.err)) SY.err = "Sync service not reachable";
      if (!silent) toast(esc(SY.err), true);
    })
    .then(function () { SY.busy = false; paintSync(); });
}
function safeRerender() {
  var a = document.activeElement;
  if (a && (a.tagName === "TEXTAREA" || a.tagName === "INPUT")) return;
  render(true);
}
function paintSync() {
  var el = document.getElementById("syncstat"); if (!el) return;
  var code = syncCode();
  el.className = "syncstat" + (SY.err ? " bad" : "") + (SY.busy ? " busy" : "");
  el.textContent = !code ? "Off" : SY.busy ? "Syncing…" : SY.err ? SY.err : syncAt() ? "Synced " + ago(syncAt()) : "Not synced yet";
}

/* ================= motion ================= */

var FX = {};               /* one-shot effects for the next render */
var IO = null;

function reveal(root) {
  if (RM || !("IntersectionObserver" in window)) {
    root.querySelectorAll(".rv").forEach(function (e) { e.classList.add("in"); });
    return;
  }
  if (IO) IO.disconnect();
  IO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); IO.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
  var n = 0;
  root.querySelectorAll(".rv").forEach(function (e) {
    var r = e.getBoundingClientRect();
    if (r.top < innerHeight) e.style.setProperty("--d", (n++ % 8) * 70 + "ms");
    IO.observe(e);
  });
}
function countUp(root) {
  root.querySelectorAll("[data-count]").forEach(function (el) {
    var to = +el.getAttribute("data-count") || 0, suf = el.getAttribute("data-suffix") || "";
    if (RM || to === 0) { el.textContent = to + suf; return; }
    var t0 = null, dur = 900 + Math.min(700, to * 4);
    el.textContent = "0" + suf;
    function step(ts) {
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * e) + suf;
      if (k < 1) requestAnimationFrame(step);
    }
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { io.disconnect(); requestAnimationFrame(step); }
    });
    io.observe(el);
  });
}
function marqueeFill(root) {
  root.querySelectorAll(".mq-track").forEach(function (tr) {
    if (tr.dataset.filled) return;
    tr.dataset.filled = "1";
    tr.innerHTML = tr.innerHTML + tr.innerHTML;   /* doubled so the loop is seamless */
  });
}

/* ================= chrome ================= */

var MARK = '<svg class="mark" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="var(--red)"/>' +
  '<path d="M13 21.5l4.6 4.6L28 14.7" fill="none" stroke="var(--paper)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function chrome(route) {
  var c = counts(), L = levelOf(c.xp), top = document.getElementById("topbar");
  var sub = route[0] === "l" || route[0] === "t" || route[0] === "s";
  top.innerHTML =
    (sub ? '<button class="back" id="backbtn" aria-label="Back"><span aria-hidden="true">←</span> Back</button>'
         : '<a class="brand" href="#/" aria-label="Self Learn Anything home">' + MARK + '<span>SELF LEARN <i>anything</i></span></a>') +
    '<span class="chip fire" title="' + c.streak + ' day' + (c.streak === 1 ? "" : "s") + ' in a row">' +
      '<svg class="fl" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-4-1-6 1-9z"/></svg>' +
      '<b>' + c.streak + '</b><span class="lbl">day' + (c.streak === 1 ? "" : "s") + '</span></span>' +
    '<span class="chip xp' + (FX.xpBump ? " bump" : "") + '" id="xpchip" title="' + esc(L.name) + '"><b>' + c.xp + '</b><span class="lbl">XP</span></span>';
  var b = document.getElementById("backbtn");
  if (b) b.addEventListener("click", function () { history.length > 1 ? history.back() : go("#/"); });

  var ic = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var tabs = [
    ["#/", "Learn", ic('<path d="M7 4.5v15l12-7.5z"/>')],
    ["#/tracks", "Subjects", ic('<path d="M3 7h6l2 2h10v10H3z"/>')],
    ["#/add", "Add", ic('<path d="M12 5v14M5 12h14"/>')],
    ["#/stats", "You", ic('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>')]
  ];
  var cur = "#/" + (route[0] === "s" ? "tracks" : ["tracks", "add", "stats"].indexOf(route[0]) >= 0 ? route[0] : "");
  document.getElementById("tabbar").innerHTML = tabs.map(function (t) {
    return '<a href="' + t[0] + '"' + (t[0] === cur ? ' aria-current="page"' : '') + '>' + t[2] + '<span>' + t[1] + '</span></a>';
  }).join("");
}

/* ================= views ================= */

function nextUpAll() {
  var tracks = focusTracks();
  for (var i = 0; i < tracks.length; i++) {
    var n = nextLesson(tracks[i]);
    if (n) return { track: tracks[i], lesson: n.lesson, i: n.i };
  }
  for (var j = 0; j < tracks.length; j++) {
    if ((tracks[j].syllabus || []).length) return { track: tracks[j], unwritten: tracks[j].syllabus[0], i: (tracks[j].lessons || []).length };
  }
  return null;
}

function viewLearn() {
  var c = counts(), tracks = focusTracks(), up = nextUpAll(), h = [];
  var started = c.answered > 0;

  var head = !started ? 'LEARN THE THING YOU’RE <em>actually</em> DOING'
    : up && !up.unwritten ? 'PICK UP <em>where</em> YOU LEFT OFF'
    : 'EVERYTHING’S <em>done</em>. ADD MORE.';
  h.push('<section class="hero rv"><span class="eyebrow">' + (c.streak ? "Day " + c.streak + " running" : "Fifteen minutes is enough") + '</span>' +
    '<h1 class="mega">' + head + '</h1>' +
    '<span class="sticker tilt-r">' + (c.lessons ? plural(c.lessons, "lesson") + " down" : started ? "In progress" : "No dates. No falling behind.") + '</span></section>');
  h.push(chipsRow());

  if (up && !up.unwritten) {
    var tc = trackCounts(up.track), lt = qTotal(up.lesson), lr = qRight(up.track.id, up.lesson);
    var pct = lt ? Math.round(lr / lt * 100) : 0;
    h.push('<section class="folder shade-red rv"><div class="tab"><span>Next up</span></div><div class="fbody">' +
      '<div class="fhead"><span class="tracklbl">' + esc(up.track.title) + '</span><span class="lnum">' + (up.i + 1) + '<small>/' + (tc.total + tc.road) + '</small></span></div>' +
      '<h2 class="ftitle">' + esc(up.lesson.title) + '</h2>' +
      '<p class="fintro">' + esc(up.lesson.intro || "") + '</p>' +
      '<div class="meter"><i style="--w:' + pct + '%"></i></div>' +
      '<div class="fmeta">' + plural((up.lesson.steps || []).length, "step") + ' · ' + plural(lt, "question") + (lr ? ' · ' + lr + ' right so far' : '') + '</div>' +
      '<a class="cta" href="#/l/' + esc(up.track.id) + '/' + esc(up.lesson.id) + '"><span>' + (lr ? "Continue" : "Start") + '</span><i aria-hidden="true">→</i></a>' +
      '</div></section>');
  } else if (up && up.unwritten) {
    h.push('<section class="folder shade-maroon rv"><div class="tab"><span>Up next</span></div><div class="fbody">' +
      '<div class="fhead"><span class="tracklbl">' + esc(up.track.title) + '</span><span class="lnum">' + (up.i + 1) + '</span></div>' +
      '<h2 class="ftitle">' + esc(up.unwritten.title) + '</h2>' +
      '<p class="fintro">Every written lesson is finished. This one is on the road ahead but not written yet. Ask Claude to write it and paste it in on the Add tab.</p>' +
      '<button class="cta" data-copy="' + esc('Write lesson ' + (up.i + 1) + ' of my "' + up.track.title + '" track for Self Learn Anything, as lesson JSON: ' + up.unwritten.title + ' — ' + up.unwritten.covers) + '"><span>Copy the ask</span><i aria-hidden="true">⎘</i></button>' +
      '</div></section>');
  } else if (!tracks.length) {
    h.push('<section class="empty rv"><h2 class="mega sm">NOTHING <em>yet</em></h2><p>Make a track for something you are working on.</p><a class="cta" href="#/add"><span>Add a track</span><i>→</i></a></section>');
  }

  var kb = knowledge();
  if (kb.length) {
    h.push('<section class="mq rv" aria-label="Things you now know"><div class="mq-label">Things you now know · ' + kb.length + '</div>' +
      '<div class="mq-viewport"><div class="mq-track">' +
      kb.slice(0, 18).map(function (k, i) { return '<span class="mq-item' + (k.mine ? " mine" : "") + '" style="--r:' + ((i % 3) - 1) * 1.5 + 'deg">' + esc(k.s) + '</span>'; }).join("") +
      '</div></div></section>');
  }

  h.push('<section class="rv"><div class="sechead"><h2 class="h2">Your <em>week</em></h2><span class="n">' + (S.log[today()] ? "Today is logged" : "Nothing yet today") + '</span></div>' + weekStrip(c) + '</section>');

  if (tracks.length) {
    h.push('<section class="rv"><div class="sechead"><h2 class="h2">' + (S.focus && subjectById(S.focus) ? esc(subjectById(S.focus).name) + ' <em>tracks</em>' : 'Your <em>tracks</em>') + '</h2><a class="n link" href="#/tracks">All ' + tracks.length + ' →</a></div>' +
      '<div class="fan">' + tracks.map(function (t, i) { return fanCard(t, i); }).join("") + '</div></section>');
  }
  return h.join("");
}

function weekStrip(c) {
  var names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], h = ['<div class="week">'];
  for (var i = 6; i >= 0; i--) {
    var d = new Date(); d.setDate(d.getDate() - i);
    var n = S.log[dayKey(d)] || 0, isToday = i === 0;
    h.push('<div class="wd' + (n ? " on" : "") + (isToday ? " today" : "") + '" style="--i:' + (6 - i) + '">' +
      '<div class="wdot">' + (n ? '<b>' + Math.min(n, 99) + '</b>' : '') + '</div><div class="wlb">' + (isToday ? "Today" : names[d.getDay()]) + '</div></div>');
  }
  h.push('</div><p class="fine">' + (c.streak ? plural(c.streak, "day") + ' running · best ' + c.best : 'Answer one question to start a streak') +
    '. Lessons never expire — a gap costs the streak and nothing else.</p>');
  return h.join("");
}

function fanCard(t, i) {
  var tc = trackCounts(t), g = S.grades[t.id] || 0, shade = SHADES[i % SHADES.length];
  return '<a class="fcard shade-' + shade + '" style="--r:' + [-3, 2.5, -1.5, 3][i % 4] + 'deg" href="#/t/' + esc(t.id) + '">' +
    (t.tag ? '<span class="ftag">' + esc(t.tag) + '</span>' : '') +
    '<h3>' + esc(t.title) + '</h3>' +
    '<div class="fcount"><b>' + tc.done + '</b>/' + (tc.total + tc.road) + '<small>lessons</small></div>' +
    '<div class="meter thin"><i style="--w:' + (tc.total + tc.road ? Math.round(tc.done / (tc.total + tc.road) * 100) : 0) + '%"></i></div>' +
    (g ? '<span class="stamp g' + g + '">' + g + '</span>' : '') + '</a>';
}

function folderCard(t, i) {
  var tc = trackCounts(t), nx = nextLesson(t), g = S.grades[t.id] || 0;
  var shade = ["red", "maroon", "ink"][i % 3];
  return '<a class="folder big shade-' + shade + '" style="--i:' + i + '" href="#/t/' + esc(t.id) + '">' +
    '<div class="tab"><span>' + String(i + 1).padStart(2, "0") + (t.tag ? " · " + esc(t.tag) : "") + '</span></div>' +
    '<div class="fbody"><h2 class="ftitle">' + esc(t.title) + '</h2>' +
    (t.subtitle ? '<p class="fintro">' + esc(t.subtitle) + '</p>' : '') +
    '<div class="meter"><i style="--w:' + tc.pct + '%"></i></div>' +
    '<div class="fmeta">' + tc.done + ' of ' + tc.total + ' written lessons' + (tc.road ? ' · ' + tc.road + ' on the road ahead' : '') +
    (nx ? ' · next: ' + esc(nx.lesson.title) : '') + '</div>' +
    (g ? '<span class="stamp g' + g + '">' + g + '</span>' : '') +
    '</div></a>';
}
function subjectStats(sid) {
  var ts = tracksIn(sid), done = 0, total = 0, road = 0;
  ts.forEach(function (t) { var c = trackCounts(t); done += c.done; total += c.total; road += c.road; });
  return { tracks: ts.length, done: done, total: total, road: road, pct: total + road ? Math.round(done / (total + road) * 100) : 0 };
}

function viewTracks() {
  var tracks = allTracks();
  if (!tracks.length) return '<section class="empty rv"><h2 class="mega sm">NO <em>tracks</em></h2><a class="cta" href="#/add"><span>Add one</span><i>→</i></a></section>';
  var subs = allSubjects();
  var h = ['<section class="hero compact rv"><span class="eyebrow">' + plural(subs.length, "subject") + ' · ' + plural(tracks.length, "track") + '</span><h1 class="mega">WHAT YOU’RE <em>building</em></h1>' +
    '<p class="lede">Each subject grows as you add tracks to it. Tap one to see everything in it.</p></section>'];
  h.push('<div class="subgrid rv">');
  subs.forEach(function (x) {
    var st = subjectStats(x.id);
    h.push('<a class="subcard tone-' + esc(x.tone || "ink") + '" href="#/s/' + esc(x.id) + '">' +
      '<span class="sc-n">' + esc(x.name) + '</span>' +
      '<span class="sc-m">' + (st.tracks ? plural(st.tracks, "track") + ' · ' + st.done + '/' + (st.total + st.road) + ' lessons' : 'Nothing yet — add a track') + '</span>' +
      '<span class="sc-bar"><i style="--w:' + st.pct + '%"></i></span></a>');
  });
  h.push('<a class="subcard add" href="#/add"><span class="sc-n">+ Subject</span><span class="sc-m">Something new you’re working on</span></a></div>');
  var loose = tracks.filter(function (t) { return !(t.subjects || []).some(subjectById); });
  if (loose.length) {
    h.push('<section class="rv"><div class="sechead"><h2 class="h2">Start <em>here</em></h2></div><div class="stackfolders">');
    loose.forEach(function (t, i) { h.push(folderCard(t, i)); });
    h.push('</div></section>');
  }
  return h.join("");
}

function viewSubject(sid) {
  var x = subjectById(sid);
  if (!x) return '<section class="empty"><h2 class="mega sm">NOT <em>found</em></h2><a class="cta" href="#/tracks"><span>All subjects</span><i>→</i></a></section>';
  var ts = tracksIn(sid), st = subjectStats(sid), h = [];
  h.push('<section class="hero compact rv"><span class="eyebrow">Subject</span><h1 class="mega">' + esc(x.name).toUpperCase() + '</h1>' +
    '<div class="bigmeter"><i style="--w:' + st.pct + '%"></i><span>' + st.done + ' / ' + (st.total + st.road) + ' lessons</span></div></section>');
  if (ts.length) {
    h.push('<div class="stackfolders">');
    ts.forEach(function (t, i) { h.push(folderCard(t, i)); });
    h.push('</div>');
  } else {
    h.push('<section class="empty rv"><p>No tracks in ' + esc(x.name) + ' yet.</p></section>');
  }
  h.push('<section class="rv"><a class="cta" href="#/add/' + esc(x.id) + '"><span>Add a track to ' + esc(x.name) + '</span><i>→</i></a></section>');
  return h.join("");
}

function viewTrack(id) {
  var t = getTrack(id);
  if (!t) return '<section class="empty"><h2 class="mega sm">NOT <em>found</em></h2><a class="cta" href="#/tracks"><span>All tracks</span><i>→</i></a></section>';
  var tc = trackCounts(t), nx = nextLesson(t), g = S.grades[t.id] || 0, h = [];

  h.push('<section class="hero compact rv">' + (t.tag ? '<span class="eyebrow">' + esc(t.tag) + '</span>' : '') +
    '<h1 class="mega">' + esc(t.title).toUpperCase() + '</h1>' +
    (t.subtitle ? '<p class="lede">' + esc(t.subtitle) + '</p>' : '') + subjectTags(t) +
    '<div class="bigmeter"><i style="--w:' + tc.pct + '%"></i><span>' + tc.done + ' / ' + tc.total + ' written</span></div></section>');

  if (!tc.total && !tc.road) {
    h.push('<section class="empty rv"><p>No lessons yet. Add a quick question or paste a lesson.</p><a class="cta" href="#/add"><span>Add to this track</span><i>→</i></a></section>');
  }
  if (tc.total) {
    h.push('<section class="rv"><div class="sechead"><h2 class="h2">The <em>lessons</em></h2></div><div class="lessons">');
    (t.lessons || []).forEach(function (l, i) {
      var done = lessonDone(t.id, l), isNext = nx && nx.lesson.id === l.id, tot = qTotal(l), rt = qRight(t.id, l);
      h.push('<a class="lrow rv' + (done ? " done" : "") + (isNext ? " next" : "") + '" href="#/l/' + esc(t.id) + '/' + esc(l.id) + '">' +
        '<span class="lno">' + (done ? "✓" : String(i + 1).padStart(2, "0")) + '</span>' +
        '<span class="ltx"><b>' + esc(l.title) + '</b><small>' +
        (done ? "Finished" : rt ? rt + " of " + tot + " right" : plural((l.steps || []).length, "step") + " · " + plural(tot, "question")) + '</small></span>' +
        (isNext ? '<span class="sticker sm">Next</span>' : '<span class="arr" aria-hidden="true">→</span>') + '</a>');
    });
    h.push('</div></section>');
  }

  if (tc.road) {
    var road = t.syllabus, show = FX.showRoad === t.id ? road.length : Math.min(8, road.length);
    h.push('<section class="rv"><div class="sechead"><h2 class="h2">The road <em>ahead</em></h2><span class="n">' + road.length + ' to write</span></div>' +
      '<p class="fine" style="margin-top:-4px">Numbered, not dated. These get written as proper lessons as you reach them.</p><ol class="road" start="' + (tc.total + 1) + '">');
    road.slice(0, show).forEach(function (r, k) {
      h.push('<li class="rv' + (r.kind === "milestone" ? " ms" : "") + '"><span class="rn">' + (tc.total + k + 1) + '</span><div><b>' + esc(r.title) + '</b>' +
        (r.kind === "milestone" ? '<span class="sticker sm">Milestone</span>' : '') +
        '<small>' + esc(r.covers) + '</small></div></li>');
    });
    h.push('</ol>' + (show < road.length ? '<button class="btn ghost" data-road="' + esc(t.id) + '">Show all ' + road.length + '</button>' : '') + '</section>');
  }

  var rl = [], rseen = {};
  (t.lessons || []).forEach(function (l) { lessonLinks(l).forEach(function (x) { if (!rseen[x.url]) { rseen[x.url] = 1; rl.push(x); } }); });
  if (rl.length) {
    h.push('<section class="rv"><div class="sechead"><h2 class="h2">The <em>reading</em></h2><span class="n">' + rl.length + ' sources</span></div>' +
      '<div class="links">' + rl.slice(0, FX.showRead === t.id ? rl.length : 6).map(linkBtn).join("") + '</div>' +
      (rl.length > 6 && FX.showRead !== t.id ? '<button class="btn ghost" data-readall="' + esc(t.id) + '">Show all ' + rl.length + '</button>' : '') + '</section>');
  }

  h.push('<section class="rv"><div class="sechead"><h2 class="h2">Your <em>grade</em></h2><span class="n">be honest</span></div>' + gradeRow(t.id, g) +
    '<p class="fine">4 is the only one that counts: you can hold it when someone who does this for a living pushes back.</p></section>');

  if (isMine(t.id)) h.push('<section><button class="btn ghost danger" data-deltrack="' + esc(t.id) + '">Delete this track</button></section>');
  return h.join("");
}
function gradeRow(id, g) {
  return '<div class="grades">' + [1, 2, 3, 4].map(function (n) {
    return '<button type="button" data-grade="' + esc(id) + '" data-g="' + n + '" aria-pressed="' + (g === n ? "true" : "false") + '">' +
      '<b>' + n + '</b><small>' + GRADE_KEY[n - 1][1] + '</small></button>';
  }).join("") + '</div>';
}

function viewLesson(tid, lid) {
  var t = getTrack(tid); if (!t) return '<section class="empty"><h2 class="mega sm">NOT <em>found</em></h2></section>';
  var ls = (t.lessons || []).filter(function (x) { return x.id === lid; })[0];
  if (!ls) return '<section class="empty"><h2 class="mega sm">NOT <em>found</em></h2><a class="cta" href="#/t/' + esc(tid) + '"><span>Back to track</span><i>→</i></a></section>';

  var p = lp(tid, lid), tot = (ls.steps || []).length, si = Math.min(p.step || 0, tot), h = [], passed = 0;
  (ls.steps || []).forEach(function (s, i) { if (stepDone(tid, ls, i)) passed++; });
  var dir = FX.dir || 0, links = lessonLinks(ls);

  h.push('<section class="lhead"><span class="eyebrow">' + esc(t.title) + '</span><h1 class="ltitle">' + esc(ls.title) + '</h1></section>');

  h.push('<div class="segs" role="tablist" aria-label="Steps">');
  (ls.steps || []).forEach(function (s, i) {
    h.push('<button type="button" class="seg' + (i === si ? " now" : "") + (stepDone(tid, ls, i) ? " ok" : "") +
      '" data-step="' + i + '" aria-label="Step ' + (i + 1) + ': ' + esc(s.title) + '"><i></i><span>' + (i + 1) + '</span></button>');
  });
  h.push('<button type="button" class="seg fin' + (si === tot ? " now" : "") + (passed === tot && tot ? " ok" : "") + '" data-step="' + tot + '" aria-label="Recap"><i></i><span>✓</span></button>' +
    (links.length ? '<button type="button" class="readbtn" id="readbtn" aria-haspopup="dialog" aria-controls="sheet"><span>Read</span><b>' + links.length + '</b></button>' : '') + '</div>');

  h.push('<div class="stage' + (dir > 0 ? " from-r" : dir < 0 ? " from-l" : "") + '">');
  if (si === 0 && ls.intro) {
    h.push('<div class="lead"><p>' + esc(ls.intro) + '</p>' +
      (links.filter(function (x) { return x.step === -1; }).length ? '<div class="links">' + links.filter(function (x) { return x.step === -1; }).map(linkBtn).join("") + '</div>' : '') + '</div>');
  }

  if (si === tot) {
    var stampNow = FX.stamp === tid + "/" + lid;
    h.push('<div class="recap' + (passed === tot ? " won" : "") + '">' +
      (passed === tot ? '<div class="seal' + (stampNow ? " slam" : "") + '" aria-hidden="true"><span>LESSON<br>DONE</span></div>' : '') +
      '<span class="eyebrow">' + (passed === tot ? "Recap" : "Where you are") + '</span>' +
      '<h2 class="mega sm">' + (passed === tot ? 'YOU NOW <em>know</em> THIS' : 'NEARLY <em>there</em>') + '</h2><ul>' +
      (ls.recap || []).map(function (r, k) { return '<li style="--i:' + k + '">' + r + '</li>'; }).join("") + '</ul>' +
      (passed < tot ? '<p class="nudge">' + plural(tot - passed, "step") + ' still to answer. A recap only sticks if you earned it.</p>' : '') + '</div>');
    if (ls.open) {
      h.push('<div class="write"><span class="eyebrow">In your own words</span><p>' + esc(ls.open) + '</p>' +
        '<textarea id="note" rows="5" placeholder="A rough line is fine.">' + esc(p.note || "") + '</textarea><p class="fine">Saved as you type.</p></div>');
    }
    var nx = nextLesson(t);
    h.push('<div class="stepnav"><button class="btn ghost" data-step="' + Math.max(0, tot - 1) + '">← Back</button>' +
      (nx && nx.lesson.id !== lid ? '<a class="cta" href="#/l/' + esc(tid) + '/' + esc(nx.lesson.id) + '"><span>Next lesson</span><i>→</i></a>'
        : '<a class="cta" href="#/t/' + esc(tid) + '"><span>Done</span><i>→</i></a>') + '</div>');
  } else {
    var st = ls.steps[si];
    h.push('<article class="step"><div class="stepno"><span class="sticker">Step ' + (si + 1) + ' of ' + tot + '</span></div>' +
      '<h2 class="steptitle">' + esc(st.title) + '</h2><div class="teach">' + wrapTables(st.teach || "") + '</div>');
    if (st.look || (st.links || []).length) h.push('<div class="look"><div class="looktab">Now go and look</div>' + (st.look ? '<p>' + st.look + '</p>' : '') +
      ((st.links || []).length ? '<div class="links">' + st.links.map(function (x) { return linkBtn({ label: x.label || x.url, url: x.url, note: x.note || "" }); }).join("") + '</div>' : '') + '</div>');
    (st.qs || []).forEach(function (q, qi) {
      var key = si + "-" + qi, given = p.ans[key], just = FX.ans === tid + "/" + lid + "/" + key;
      h.push('<div class="qz' + (given != null ? (given === q.correct ? " is-right" : " is-wrong") : "") + (just ? " just" : "") + '">' +
        '<div class="qhead"><span class="qno">Q' + (qi + 1) + '</span><p class="qt">' + q.q + '</p></div><div class="opts">');
      (q.opts || []).forEach(function (o, oi) {
        var cl = "opt";
        if (given != null) cl += oi === q.correct ? " right" : (oi === given ? " wrong" : " dim");
        h.push('<button type="button" class="' + cl + '" style="--i:' + oi + '" data-ans="' + key + ":" + oi + '"' + (given != null ? " disabled" : "") + '>' +
          '<span class="ltr">' + "ABCDEF".charAt(oi) + '</span><span class="otx">' + o + '</span>' +
          (given != null && oi === q.correct ? '<span class="tick" aria-hidden="true">✓</span>' : '') + '</button>');
      });
      h.push('</div>');
      if (given != null) {
        var right = given === q.correct;
        h.push('<div class="fb ' + (right ? "good" : "bad") + '">' +
          (right ? '<span class="sticker pop">Right' + (just ? ' +10' : '') + '</span>' : '<span class="sticker red pop">Not that one</span>') +
          '<p>' + (q.why || "") + '</p>' +
          (!right ? '<button class="btn ghost sm" data-retry="' + key + '">Try again</button>' : '') + '</div>');
      }
      h.push('</div>');
    });
    h.push('<div class="stepnav">' + (si > 0 ? '<button class="btn ghost" data-step="' + (si - 1) + '">← Back</button>' : '<span></span>') +
      '<button class="cta" data-step="' + (si + 1) + '"><span>' + (si + 1 === tot ? "Finish" : "Next step") + '</span><i>→</i></button></div></article>');
  }
  h.push('</div>');
  h.push(readingSheet(links, si));
  return h.join("");
}

function trackOptions(tracks) {
  var subs = allSubjects(), used = {}, out = [];
  subs.forEach(function (x) {
    var ts = tracks.filter(function (t) { return !used[t.id] && (t.subjects || [])[0] === x.id; });
    if (!ts.length) return;
    out.push('<optgroup label="' + esc(x.name) + '">' + ts.map(function (t) { used[t.id] = 1; return '<option value="' + esc(t.id) + '">' + esc(t.title) + '</option>'; }).join("") + '</optgroup>');
  });
  var rest = tracks.filter(function (t) { return !used[t.id]; });
  if (rest.length) out.push('<optgroup label="Other">' + rest.map(function (t) { return '<option value="' + esc(t.id) + '">' + esc(t.title) + '</option>'; }).join("") + '</optgroup>');
  return out.join("");
}
function viewAdd(pre) {
  var tracks = allTracks();
  var opts = trackOptions(tracks);
  var picks = allSubjects().map(function (x) {
    var on = pre === x.id;
    return '<button type="button" class="chipf pick tone-' + esc(x.tone || "ink") + (on ? " on" : "") + '" data-pick="' + esc(x.id) + '" aria-pressed="' + on + '">' + esc(x.name) + '</button>';
  }).join("");
  return '' +
  '<section class="hero compact rv"><span class="eyebrow">Capture it while it’s fresh</span><h1 class="mega">LOOKED IT UP <em>twice?</em> ADD IT.</h1></section>' +
  '<section class="card form rv"><div class="cardtab">Quick question · 20 seconds</div>' +
    (tracks.length ?
      field("qt", "Track", '<select id="qt">' + opts + '</select>') +
      field("qq", "Question", '<input type="text" id="qq" placeholder="What does s.263 actually test?">') +
      field("qa", "Right answer", '<input type="text" id="qa" class="ok-in" placeholder="Who receives the rents, and who is owner or lessee">') +
      field("qw1", "Wrong answer", '<input type="text" id="qw1" placeholder="Who delivers the support">') +
      field("qw2", "Another wrong answer", '<input type="text" id="qw2" placeholder="Whoever signs the tenancy">') +
      field("qw3", "One more <span class=\"opt-l\">optional</span>", '<input type="text" id="qw3">') +
      field("qy", "Why that is the answer", '<textarea id="qy" rows="3" placeholder="What you want to be told when you get it wrong in three months."></textarea>') +
      '<button class="cta block" id="addq"><span>Add question</span><i>→</i></button>'
      : '<p class="fine">Make a track first.</p>') +
  '</section>' +
  '<section class="card form rv"><div class="cardtab">New track</div>' +
    field("nt", "Title", '<input type="text" id="nt" placeholder="Cloudflare Workers">') +
    field("ns", "What it covers <span class=\"opt-l\">optional</span>", '<input type="text" id="ns" placeholder="Routing, KV, bindings, deploys">') +
    field("ng", "Tag <span class=\"opt-l\">optional</span>", '<input type="text" id="ng" placeholder="Dev">') +
    '<div class="field"><span class="flabel">Subjects <span class="opt-l">tap any that fit</span></span><div class="chips wrap" id="picks">' + picks + '</div></div>' +
    '<button class="cta block" id="addt"><span>Create track</span><i>→</i></button>' +
  '</section>' +
  '<section class="card form rv"><div class="cardtab">New subject</div>' +
    '<p class="fine" style="margin-top:0">A whole area you are working in, such as Marketing or Finance. Tracks go inside it.</p>' +
    field("sn", "Name", '<input type="text" id="sn" maxlength="28" placeholder="Marketing">') +
    '<button class="btn block" id="adds">Add subject</button>' +
  '</section>' +
  '<section class="card form rv"><div class="cardtab">Paste a lesson · JSON</div>' +
    '<p class="fine" style="margin-top:0">A full guided lesson with teach, look and check steps. One lesson or an array. Ask Claude for one in this format.</p>' +
    (tracks.length ? field("jt", "Add to track", '<select id="jt">' + opts + '</select>') : '') +
    field("jp", "Lesson JSON", '<textarea id="jp" rows="7" class="mono" placeholder=\'{"title":"…","intro":"…","steps":[{"title":"…","teach":"<p>…</p>","look":"…","qs":[{"q":"…","opts":["a","b"],"correct":0,"why":"…"}]}],"recap":["…"]}\'></textarea>') +
    '<button class="btn block" id="addj">Add lesson</button>' +
  '</section>';
}
function field(id, label, control) { return '<div class="field"><label for="' + id + '">' + label + '</label>' + control + '</div>'; }

function viewStats() {
  var c = counts(), L = levelOf(c.xp), tracks = allTracks(), kb = knowledge(), code = syncCode(), h = [];
  h.push('<section class="hero compact rv"><span class="eyebrow">Level ' + (L.i + 1) + ' of ' + LEVELS.length + '</span>' +
    '<h1 class="mega">' + esc(L.name).toUpperCase() + '</h1>' +
    '<div class="bigmeter"><i style="--w:' + L.pct + '%"></i><span>' + (L.next ? (L.next[0] - c.xp) + ' XP to ' + esc(L.next[1]) : 'Top level') + '</span></div></section>');

  h.push('<section class="tiles rv">' +
    tile("XP", c.xp, "", "10 per question right first time") +
    tile("Right", c.right, "", c.answered ? Math.round(c.right / c.answered * 100) + "% first-time accuracy" : "nothing answered yet") +
    tile("Lessons", c.lessons, "", "finished end to end") +
    tile("Streak", c.streak, "", "best " + c.best) + '</section>');

  h.push('<section class="rv"><div class="sechead"><h2 class="h2">Last <em>seven</em> days</h2></div>' + weekStrip(c) + '</section>');

  h.push('<section class="rv"><div class="sechead"><h2 class="h2">What you <em>know</em></h2><span class="n">' + kb.length + '</span></div>' +
    (kb.length ? '<ul class="known">' + kb.map(function (k) {
      return '<li class="rv' + (k.mine ? " mine" : "") + '"><small>' + esc(k.t) + (k.mine ? " · yours" : "") + '</small>' + esc(k.s) + '</li>';
    }).join("") + '</ul>' : '<p class="fine">Finish a lesson and its recap lands here. This is the real score.</p>') + '</section>');

  h.push('<section class="rv"><div class="sechead"><h2 class="h2">Self <em>grades</em></h2></div><div class="gradelist">');
  tracks.forEach(function (t) { h.push('<div class="gl"><b>' + esc(t.title) + '</b>' + gradeRow(t.id, S.grades[t.id] || 0) + '</div>'); });
  h.push('</div></section>');

  var got = BADGES.filter(function (b) { try { return b[2](c); } catch (e) { return false; } }).length;
  h.push('<section class="rv"><div class="sechead"><h2 class="h2"><em>Badges</em></h2><span class="n">' + got + ' / ' + BADGES.length + '</span></div><div class="badges">');
  BADGES.forEach(function (b, i) {
    var on = false; try { on = !!b[2](c); } catch (e) { }
    h.push('<div class="badge' + (on ? " got" : "") + '" style="--r:' + [-4, 3, -2, 5, -3][i % 5] + 'deg"><b>' + esc(b[0]) + '</b><small>' + esc(b[1]) + '</small></div>');
  });
  h.push('</div></section>');

  h.push('<section class="card rv"><div class="cardtab">Sync between devices</div>');
  if (!code) {
    h.push('<p class="fine" style="margin-top:0">Turn this on and your progress follows you between laptop and phone. No account: a private code is the key. Anyone with the code can read your progress, so treat it like a password.</p>' +
      '<div class="btnrow"><button class="cta" id="syncon"><span>Turn on sync</span><i>↻</i></button>' +
      '<button class="btn ghost" id="synchave">I have a code</button></div>' +
      '<div class="field" id="syncjoin" hidden><label for="syncin">Code from your other device</label>' +
      '<input type="text" id="syncin" class="mono" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="XXXX-XXXX-XXXX-XXXX">' +
      '<button class="btn" id="syncjoinbtn" style="margin-top:9px">Join</button></div>');
  } else {
    h.push('<div class="syncrow"><span class="syncstat" id="syncstat"></span><button class="btn sm" id="syncnow">Sync now</button></div>' +
      '<div class="codebox" id="codebox" hidden><span class="mono">' + fmtCode(code) + '</span><button class="btn ghost sm" id="copycode">Copy</button></div>' +
      '<p class="fine">Enter this code on your other device under <b>I have a code</b>. Progress merges — answers from both devices are kept.</p>' +
      '<div class="btnrow"><button class="btn ghost sm" id="showcode">Show code</button><button class="btn ghost sm danger" id="syncoff">Turn off on this device</button></div>');
  }
  h.push('</section>');

  h.push('<section class="card rv"><div class="cardtab">Your data</div>' +
    '<p class="fine" style="margin-top:0">Export is a full backup. Import <b>merges</b> into what is here — nothing you have done is overwritten.</p>' +
    '<div class="btnrow"><button class="btn" id="exp">Export backup</button><button class="btn ghost" id="imp">Import</button>' +
    '<button class="btn ghost" id="theme">' + (S.theme === "dark" ? "Light" : "Dark") + ' theme</button></div>' +
    '<input type="file" id="impf" accept="application/json,.json" hidden>' +
    '<hr class="sep"><button class="btn ghost danger sm" id="reset">Reset everything on this device</button></section>');
  return h.join("");
}
function tile(k, v, suf, n) {
  return '<div class="tile"><span class="tk">' + esc(k) + '</span><b class="tv" data-count="' + v + '" data-suffix="' + esc(suf) + '">' + v + suf + '</b><span class="tn">' + esc(n) + '</span></div>';
}

/* ================= router ================= */

function parse() { var r = (location.hash || "#/").replace(/^#\/?/, "").split("/").filter(Boolean); return r.length ? r : [""]; }
function go(h) { location.hash = h; }

function render(quiet) {
  var r = parse(), main = document.getElementById("main"), html;
  if (r[0] === "tracks") html = viewTracks();
  else if (r[0] === "t") html = viewTrack(decodeURIComponent(r[1] || ""));
  else if (r[0] === "l") html = viewLesson(decodeURIComponent(r[1] || ""), decodeURIComponent(r[2] || ""));
  else if (r[0] === "add") html = viewAdd(decodeURIComponent(r[1] || ""));
  else if (r[0] === "s") html = viewSubject(decodeURIComponent(r[1] || ""));
  else if (r[0] === "stats") html = viewStats();
  else html = viewLearn();
  main.innerHTML = html;
  document.body.setAttribute("data-view", r[0] || "learn");
  chrome(r);
  wire(r);
  reveal(main);
  countUp(main);
  marqueeFill(main);
  paintSync();
  FX = {};
  if (!quiet) main.focus({ preventScroll: true });
}
function navigate() {
  if (!RM && document.startViewTransition) document.startViewTransition(function () { render(); window.scrollTo(0, 0); });
  else { render(); window.scrollTo(0, 0); }
}

/* ================= events ================= */

function wire(r) {
  var m = document.getElementById("main");
  function on(sel, ev, fn) { m.querySelectorAll(sel).forEach(function (n) { n.addEventListener(ev, function (e) { fn(n, e); }); }); }
  function byId(id) { return document.getElementById(id); }

  if (r[0] === "l") {
    var tid = decodeURIComponent(r[1]), lid = decodeURIComponent(r[2]);
    on("[data-step]", "click", function (n) {
      var p = lp(tid, lid), to = +n.getAttribute("data-step");
      FX.dir = to > (p.step || 0) ? 1 : to < (p.step || 0) ? -1 : 0;
      p.step = to; p.at = Date.now(); save(); render();
      window.scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" });
    });
    on("[data-ans]", "click", function (n) {
      var pr = n.getAttribute("data-ans").split(":"), p = lp(tid, lid);
      if (p.ans[pr[0]] != null) return;
      var t = getTrack(tid), l = (t.lessons || []).filter(function (x) { return x.id === lid; })[0];
      var before = counts(), wasDone = lessonDone(tid, l);
      p.ans[pr[0]] = +pr[1]; p.at = Date.now();
      touch(); save();
      var after = counts();
      FX.ans = tid + "/" + lid + "/" + pr[0];
      if (after.xp > before.xp) FX.xpBump = true;
      var y = window.scrollY;
      render(true);
      window.scrollTo(0, y);
      var finished = !wasDone && lessonDone(tid, l);
      if (levelOf(after.xp).i > levelOf(before.xp).i) toast('<b>Level up</b> · ' + esc(levelOf(after.xp).name));
      else if (finished) toast("<b>Lesson done</b> · +40 XP");
      /* Survives this render's reset so the recap seal slams in when they reach it. */
      if (finished) FX.stamp = tid + "/" + lid;
    });
    on("[data-retry]", "click", function (n) {
      var p = lp(tid, lid); delete p.ans[n.getAttribute("data-retry")]; p.at = Date.now();
      save(); var y = window.scrollY; render(true); window.scrollTo(0, y);
    });
    var nt = byId("note");
    if (nt) nt.addEventListener("input", function () {
      var p = lp(tid, lid); p.note = nt.value.slice(0, 6000); p.at = Date.now();
      clearTimeout(wire._n); wire._n = setTimeout(save, 450);
    });
  }

  on("[data-grade]", "click", function (n) {
    var id = n.getAttribute("data-grade"), g = +n.getAttribute("data-g");
    if (S.grades[id] === g) delete S.grades[id]; else S.grades[id] = g;
    save(); var y = window.scrollY; render(true); window.scrollTo(0, y);
  });
  on("[data-focus]", "click", function (n) {
    S.focus = n.getAttribute("data-focus") || ""; saveLocal(); render(true);
  });
  on("[data-readall]", "click", function (n) { FX.showRead = n.getAttribute("data-readall"); var y = window.scrollY; render(true); window.scrollTo(0, y); });
  on("[data-pick]", "click", function (n) {
    var on2 = !n.classList.contains("on"); n.classList.toggle("on", on2); n.setAttribute("aria-pressed", on2);
  });
  var sheet = byId("sheet"), rb = byId("readbtn");
  if (sheet && rb) {
    var openSheet = function () { sheet.hidden = false; requestAnimationFrame(function () { sheet.classList.add("open"); }); document.body.classList.add("noscroll"); var x = sheet.querySelector(".sheet-x"); if (x) x.focus(); };
    var closeSheet = function () { sheet.classList.remove("open"); document.body.classList.remove("noscroll"); setTimeout(function () { sheet.hidden = true; }, RM ? 0 : 260); rb.focus(); };
    rb.addEventListener("click", openSheet);
    sheet.querySelectorAll("[data-close]").forEach(function (c) { c.addEventListener("click", closeSheet); });
    sheet.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(); });
  }
  on("[data-road]", "click", function (n) { FX.showRoad = n.getAttribute("data-road"); var y = window.scrollY; render(true); window.scrollTo(0, y); });
  on("[data-copy]", "click", function (n) {
    var txt = n.getAttribute("data-copy");
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { toast("Copied — paste it to Claude"); },
      function () { toast("Copy failed: select and copy it manually", true); });
  });
  on("[data-deltrack]", "click", function (n) {
    var id = n.getAttribute("data-deltrack");
    if (n.dataset.sure !== "1") { n.dataset.sure = "1"; n.textContent = "Tap again to delete"; return; }
    S.tracks = (S.tracks || []).filter(function (t) { return t.id !== id; });
    delete S.prog[id]; delete S.grades[id]; save(); toast("Track deleted"); go("#/tracks");
  });

  /* authoring */
  var addq = byId("addq");
  if (addq) addq.addEventListener("click", function () {
    var tid = byId("qt").value, q = byId("qq").value.trim(), a = byId("qa").value.trim();
    var w = [byId("qw1").value.trim(), byId("qw2").value.trim(), byId("qw3").value.trim()].filter(Boolean);
    var why = byId("qy").value.trim();
    if (!q || !a || !w.length) { toast("Need a question, a right answer and at least one wrong one", true); return; }
    var opts = [a].concat(w);
    for (var i = opts.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp; }
    addQuestion(tid, { q: esc(q), opts: opts.map(esc), correct: opts.indexOf(a), why: why ? esc(why) : "You wrote this one yourself." });
    toast("Question added"); go("#/t/" + encodeURIComponent(tid));
  });
  var addt = byId("addt");
  if (addt) addt.addEventListener("click", function () {
    var title = byId("nt").value.trim();
    if (!title) { toast("Give it a title", true); return; }
    var id = uid("t");
    var subs = [].map.call(document.querySelectorAll("#picks .on"), function (b) { return b.getAttribute("data-pick"); });
    S.tracks.push({ id: id, title: title, subtitle: byId("ns").value.trim(), tag: byId("ng").value.trim(), subjects: subs, lessons: [], updatedAt: Date.now() });
    save(); toast("Track created"); go("#/t/" + encodeURIComponent(id));
  });
  var adds = byId("adds");
  if (adds) adds.addEventListener("click", function () {
    var name = byId("sn").value.trim().slice(0, 28);
    if (!name) { toast("Give it a name", true); return; }
    var sid = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || uid("s");
    if (subjectById(sid)) { toast("You already have " + esc(subjectById(sid).name), true); return; }
    S.subjects = S.subjects || [];
    S.subjects.push({ id: sid, name: name, tone: ["red", "deep", "maroon", "flame", "ink", "lime", "slate"][S.subjects.length % 7] });
    save(); toast("Subject added"); go("#/add/" + encodeURIComponent(sid));
  });
  var addj = byId("addj");
  if (addj) addj.addEventListener("click", function () {
    var sel = byId("jt"); if (!sel) { toast("Make a track first", true); return; }
    var raw = byId("jp").value.trim(); if (!raw) { toast("Nothing pasted", true); return; }
    var data; try { data = JSON.parse(raw); } catch (e) { toast("That is not valid JSON", true); return; }
    var list = Array.isArray(data) ? data : [data];
    for (var i = 0; i < list.length; i++) { var v = validateLesson(list[i]); if (v) { toast(esc(v), true); return; } }
    var t = getTrack(sel.value); if (!t) { toast("Track not found", true); return; }
    var target = isMine(t.id) ? t : adoptSeed(t);
    list.forEach(function (l) {
      l.id = l.id || uid("l");
      target.lessons.push(l);
      if (target.syllabus && target.syllabus.length && target.syllabus[0].title === l.title) target.syllabus.shift();
    });
    target.updatedAt = Date.now();
    save(); toast(plural(list.length, "lesson") + " added"); go("#/t/" + encodeURIComponent(target.id));
  });

  /* sync */
  var son = byId("syncon");
  if (son) son.addEventListener("click", function () {
    setSyncCode(newCode()); save(); render(true);
    syncNow(false).then(function () { var cb = byId("codebox"); if (cb) cb.hidden = false; });
  });
  var shv = byId("synchave");
  if (shv) shv.addEventListener("click", function () { byId("syncjoin").hidden = false; byId("syncin").focus(); });
  var sj = byId("syncjoinbtn");
  if (sj) sj.addEventListener("click", function () {
    var c = normCode(byId("syncin").value);
    if (!validCode(c)) { toast("That code is not valid — 16 letters and numbers", true); return; }
    setSyncCode(c); render(true); syncNow(false);
  });
  var snow = byId("syncnow"); if (snow) snow.addEventListener("click", function () { syncNow(false); });
  var shc = byId("showcode"); if (shc) shc.addEventListener("click", function () { var cb = byId("codebox"); cb.hidden = !cb.hidden; shc.textContent = cb.hidden ? "Show code" : "Hide code"; });
  var cpc = byId("copycode");
  if (cpc) cpc.addEventListener("click", function () {
    (navigator.clipboard ? navigator.clipboard.writeText(fmtCode(syncCode())) : Promise.reject()).then(function () { toast("Code copied"); }, function () { toast("Copy failed: select it manually", true); });
  });
  var soff = byId("syncoff");
  if (soff) soff.addEventListener("click", function () {
    if (soff.dataset.sure !== "1") { soff.dataset.sure = "1"; soff.textContent = "Tap again — your data stays here"; return; }
    setSyncCode(""); try { localStorage.removeItem(SYNC_AT); } catch (e) { }
    toast("Sync off on this device"); render(true);
  });

  /* data */
  var exp = byId("exp");
  if (exp) exp.addEventListener("click", function () {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: "application/json" }));
    a.download = "self-learn-anything-" + today() + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
    toast("Backup downloaded");
  });
  var imp = byId("imp"), impf = byId("impf");
  if (imp && impf) {
    imp.addEventListener("click", function () { impf.click(); });
    impf.addEventListener("change", function () {
      var f = impf.files && impf.files[0]; if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        var p; try { p = JSON.parse(fr.result); } catch (e) { toast("That file is not valid JSON", true); return; }
        if (!p || typeof p !== "object" || !p.prog) { toast("That does not look like a backup", true); return; }
        var before = counts().answered;
        S = merge(S, p); save();
        toast("Merged · " + (counts().answered - before) + " answers added"); go("#/"); render();
      };
      fr.readAsText(f);
    });
  }
  var th = byId("theme");
  if (th) th.addEventListener("click", function () {
    var dark = S.theme ? S.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    S.theme = dark ? "light" : "dark"; applyTheme(); save(); render(true);
  });
  var rs = byId("reset");
  if (rs) rs.addEventListener("click", function () {
    if (rs.dataset.sure !== "1") { rs.dataset.sure = "1"; rs.textContent = "Tap again — this wipes this device"; return; }
    S = fresh(); saveLocal(); applyTheme(); toast("Reset"); go("#/"); render();
  });
}

/* Seed tracks are read-only: copy one into your own tracks before editing. */
function adoptSeed(t) {
  var copy = JSON.parse(JSON.stringify(t));
  copy.lessons = copy.lessons || []; copy.updatedAt = Date.now();
  S.tracks.push(copy);
  if (S.hidden.indexOf(t.id) < 0) S.hidden.push(t.id);
  return copy;
}
function addQuestion(tid, q) {
  var t = getTrack(tid); if (!t) return;
  var target = isMine(t.id) ? t : adoptSeed(t);
  var cap = (target.lessons || []).filter(function (l) { return l.id === "captured"; })[0];
  if (!cap) {
    cap = { id: "captured", title: "Things I worked out", intro: "Questions you captured as you went.", steps: [], recap: ["Your own material, in your own words."], open: "" };
    target.lessons.push(cap);
  }
  if (!cap.steps.length) cap.steps.push({ title: "Captured questions", teach: "<p>You wrote these.</p>", look: "", qs: [] });
  cap.steps[0].qs.push(q);
  target.updatedAt = Date.now();
  save();
}
function badLinks(ls) {
  if (ls == null) return "";
  if (!Array.isArray(ls)) return "links must be an array";
  for (var k = 0; k < ls.length; k++) {
    if (!ls[k] || typeof ls[k].url !== "string" || !/^https?:\/\//i.test(ls[k].url)) return "link " + (k + 1) + " needs an http(s) url";
  }
  return "";
}
function validateLesson(l) {
  if (!l || typeof l !== "object") return "Each lesson must be an object";
  if (!l.title) return "A lesson needs a title";
  if (!Array.isArray(l.steps) || !l.steps.length) return "A lesson needs a steps array";
  var lb = badLinks(l.links); if (lb) return lb;
  for (var i = 0; i < l.steps.length; i++) {
    var s = l.steps[i];
    if (!s || !s.title) return "Step " + (i + 1) + " needs a title";
    if (!s.teach) return "Step " + (i + 1) + " needs teach text";
    if (s.qs != null && !Array.isArray(s.qs)) return "Step " + (i + 1) + ": qs must be an array";
    var bad = badLinks(s.links); if (bad) return "Step " + (i + 1) + ": " + bad;
    var qs = s.qs || [];
    for (var j = 0; j < qs.length; j++) {
      var q = qs[j];
      if (!q.q) return "Step " + (i + 1) + " question " + (j + 1) + " needs q";
      if (!Array.isArray(q.opts) || q.opts.length < 2) return "Step " + (i + 1) + " question " + (j + 1) + " needs 2+ opts";
      if (typeof q.correct !== "number" || q.correct < 0 || q.correct >= q.opts.length) return "Step " + (i + 1) + " question " + (j + 1) + ": bad correct index";
    }
  }
  return "";
}

/* ================= boot ================= */

load();
if (!RM) document.documentElement.classList.add("motion");
window.addEventListener("hashchange", navigate);
render(true);
if (syncCode()) syncNow(true);
document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden" && syncCode()) syncNow(true); });
window.addEventListener("online", function () { if (syncCode()) syncNow(true); });
if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () { }); });
}
