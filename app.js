/* Self Learn Anything — engine.
   No backend. No dates on lessons: progress is sequential, so nothing can fall behind.
   State lives in localStorage; Export/Import moves it between devices. */
"use strict";

var KEY = "sla.v1";
var LEVELS = [
  [0, "Beginner"], [150, "Learner"], [400, "Practitioner"], [800, "Confident"],
  [1400, "Adviser"], [2200, "Specialist"], [3200, "Expert"]
];
var GRADE_KEY = [["1", "read it"], ["2", "with notes"], ["3", "cold"], ["4", "under challenge"]];
var BADGES = [
  ["First step", "Answer one question correctly", function (c) { return c.right >= 1; }],
  ["First lesson", "Finish a whole lesson", function (c) { return c.lessons >= 1; }],
  ["Ten right", "Ten correct first-time answers", function (c) { return c.right >= 10; }],
  ["Fifty right", "Fifty correct first-time answers", function (c) { return c.right >= 50; }],
  ["Three days", "Three days in a row", function (c) { return c.best >= 3; }],
  ["Two weeks", "Fourteen days in a row", function (c) { return c.best >= 14; }],
  ["Author", "Write your own track", function (c) { return c.mine >= 1; }],
  ["Capturer", "Add ten questions of your own", function (c) { return c.captured >= 10; }],
  ["First seal", "Grade any track a 4", function (c) { return c.g4 >= 1; }],
  ["Finisher", "Finish every lesson in a track", function (c) { return c.tracksDone >= 1; }]
];

/* ---------------- state ---------------- */

function fresh() { return { v: 1, tracks: [], prog: {}, grades: {}, log: {}, hidden: [], theme: "" }; }
var S = fresh();

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var p = JSON.parse(raw);
      if (p && typeof p === "object") {
        Object.keys(fresh()).forEach(function (k) { if (p[k] != null) S[k] = p[k]; });
      }
    }
  } catch (e) { /* private mode or quota: run from defaults */ }
  if (S.theme) document.documentElement.setAttribute("data-theme", S.theme);
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch (e) { toast("Could not save — storage is full or blocked", true); }
}

/* ---------------- helpers ---------------- */

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function today() {
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function dayKey(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function toast(msg, bad) {
  var t = document.getElementById("toast");
  t.textContent = msg; t.className = "toast show" + (bad ? " bad" : "");
  clearTimeout(toast._t); toast._t = setTimeout(function () { t.className = "toast"; }, 2600);
}
function uid(p) { return (p || "x") + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function wrapTables(html) { return String(html).replace(/<table/g, '<div class="tablewrap"><table').replace(/<\/table>/g, "</table></div>"); }

/* ---------------- data ---------------- */

function allTracks() {
  var seed = (window.SLA_SEED || []).filter(function (t) { return S.hidden.indexOf(t.id) < 0; });
  return seed.concat(S.tracks || []);
}
function getTrack(id) {
  var all = allTracks();
  for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
  return null;
}
function isMine(id) { return (S.tracks || []).some(function (t) { return t.id === id; }); }
function lp(tid, lid) {
  S.prog[tid] = S.prog[tid] || {};
  S.prog[tid][lid] = S.prog[tid][lid] || { step: 0, ans: {}, note: "" };
  return S.prog[tid][lid];
}
function qTotal(lesson) { var n = 0; (lesson.steps || []).forEach(function (s) { n += (s.qs || []).length; }); return n; }
function qRight(tid, lesson) {
  var p = (S.prog[tid] || {})[lesson.id]; if (!p) return 0;
  var n = 0;
  (lesson.steps || []).forEach(function (s, si) {
    (s.qs || []).forEach(function (q, qi) { if (p.ans[si + "-" + qi] === q.correct) n++; });
  });
  return n;
}
function lessonDone(tid, lesson) { var t = qTotal(lesson); return t > 0 && qRight(tid, lesson) === t; }
function stepDone(tid, lesson, si) {
  var p = (S.prog[tid] || {})[lesson.id]; if (!p) return false;
  var qs = lesson.steps[si].qs || [];
  if (!qs.length) return false;
  return qs.every(function (q, qi) { return p.ans[si + "-" + qi] === q.correct; });
}
/* Sequential: the next lesson is simply the first unfinished one. Never skipped, never late. */
function nextLesson(track) {
  var ls = track.lessons || [];
  for (var i = 0; i < ls.length; i++) if (!lessonDone(track.id, ls[i])) return { lesson: ls[i], i: i };
  return null;
}
function trackCounts(track) {
  var ls = track.lessons || [], done = 0;
  ls.forEach(function (l) { if (lessonDone(track.id, l)) done++; });
  return { total: ls.length, done: done, pct: ls.length ? Math.round(done / ls.length * 100) : 0 };
}

function counts() {
  var c = { right: 0, answered: 0, lessons: 0, tracksDone: 0, mine: (S.tracks || []).length, captured: 0, g4: 0 };
  allTracks().forEach(function (t) {
    var tc = trackCounts(t);
    if (tc.total && tc.done === tc.total) c.tracksDone++;
    (t.lessons || []).forEach(function (l) {
      var p = (S.prog[t.id] || {})[l.id];
      if (p) {
        (l.steps || []).forEach(function (s, si) {
          (s.qs || []).forEach(function (q, qi) {
            var a = p.ans[si + "-" + qi];
            if (a != null) { c.answered++; if (a === q.correct) c.right++; }
          });
        });
      }
      if (l.id === "captured") c.captured += qTotal(l);
      if (lessonDone(t.id, l)) c.lessons++;
    });
  });
  Object.keys(S.grades).forEach(function (k) { if (S.grades[k] === 4) c.g4++; });
  var gsum = 0; Object.keys(S.grades).forEach(function (k) { gsum += S.grades[k] || 0; });
  c.xp = c.right * 10 + c.lessons * 40 + gsum * 15;
  c.streak = streak(0); c.best = bestStreak();
  return c;
}
function streak() {
  var run = 0, p = new Date();
  if (!S.log[today()]) p.setDate(p.getDate() - 1);
  for (var i = 0; i < 500; i++) {
    if (!S.log[dayKey(p)]) break;
    run++; p.setDate(p.getDate() - 1);
  }
  return run;
}
function bestStreak() {
  var ks = Object.keys(S.log).sort(), best = 0, run = 0, prev = null;
  ks.forEach(function (k) {
    if (prev) {
      var a = new Date(prev + "T00:00:00"), b = new Date(k + "T00:00:00");
      run = Math.round((b - a) / 86400000) === 1 ? run + 1 : 1;
    } else run = 1;
    if (run > best) best = run;
    prev = k;
  });
  return best;
}
function levelOf(xp) {
  var i = 0; LEVELS.forEach(function (l, j) { if (xp >= l[0]) i = j; });
  return { i: i, name: LEVELS[i][1], next: LEVELS[i + 1] || null };
}
function touch() { S.log[today()] = (S.log[today()] || 0) + 1; }

/* ---------------- chrome ---------------- */

var SPARK = '<svg class="sp" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3.4"/></svg>';

function chrome(route) {
  var c = counts(), L = levelOf(c.xp);
  var top = document.getElementById("topbar");
  var isSub = route[0] === "l" || route[0] === "t";
  top.innerHTML = isSub
    ? '<button class="back" id="backbtn">← Back</button>' +
      '<span class="chip fire" title="Day streak">◆ ' + c.streak + '</span>' +
      '<span class="chip lvl">' + c.xp + ' XP</span>'
    : '<span class="brand">' + SPARK + '<span>Self Learn Anything</span></span>' +
      '<span class="chip fire" title="Day streak">◆ ' + c.streak + '</span>' +
      '<span class="chip lvl">' + esc(L.name) + '</span>';
  var b = document.getElementById("backbtn");
  if (b) b.addEventListener("click", function () { history.length > 1 ? history.back() : go("#/"); });

  var ic = function (d) {
    return '<span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg></span>';
  };
  var tabs = [
    ["#/", "Learn", ic('<path d="M7 4.5v15l12-7.5z"/>')],
    ["#/tracks", "Tracks", ic('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>')],
    ["#/add", "Add", ic('<path d="M12 5v14M5 12h14"/>')],
    ["#/stats", "Stats", ic('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>')]
  ];
  var cur = "#/" + (["", "tracks", "add", "stats"].indexOf(route[0]) > 0 ? route[0] : "");
  document.getElementById("tabbar").innerHTML = tabs.map(function (t) {
    return '<a href="' + t[0] + '"' + (t[0] === cur ? ' aria-current="page"' : '') + '>' + t[2] + t[1] + '</a>';
  }).join("");
}

/* ---------------- views ---------------- */

function viewLearn() {
  var c = counts(), L = levelOf(c.xp), h = [];
  var tracks = allTracks();
  var up = null;
  for (var i = 0; i < tracks.length; i++) {
    var n = nextLesson(tracks[i]);
    if (n) { up = { track: tracks[i], lesson: n.lesson, i: n.i }; break; }
  }

  if (!tracks.length) {
    return '<div class="empty"><h3>Nothing to learn yet</h3><p>Make a track for something you are working on.</p>' +
      '<a class="btn" href="#/add">Add a track</a></div>';
  }

  if (up) {
    var tc = trackCounts(up.track), lt = qTotal(up.lesson), lr = qRight(up.track.id, up.lesson);
    h.push('<section><div class="nextup"><div class="bar"></div><div class="in">' +
      '<div class="kicker">Next up · ' + esc(up.track.title) + '</div>' +
      '<h2>' + esc(up.lesson.title) + '</h2>' +
      '<p>' + esc(up.lesson.intro || "") + '</p>' +
      '<div class="meta">Lesson ' + (up.i + 1) + ' of ' + tc.total +
      ' · ' + (up.lesson.steps || []).length + ' steps · ' + lt + ' questions' +
      (lr ? ' · ' + lr + ' already right' : '') + '</div>' +
      '<a class="btn block" href="#/l/' + esc(up.track.id) + '/' + esc(up.lesson.id) + '">' +
      (lr ? "Continue" : "Start") + ' →</a>' +
      '</div></div></section>');
  } else {
    h.push('<section><div class="card"><h2 style="font-size:19px">Everything is finished</h2>' +
      '<p style="color:var(--ink-2);font-size:14.5px;margin:7px 0 13px">Every lesson in every track is done. Add something new, or grade your tracks honestly on the Stats tab.</p>' +
      '<div class="btnrow"><a class="btn sm" href="#/add">Add a track</a>' +
      '<a class="btn sm ghost" href="#/stats">Grade yourself</a></div></div></section>');
  }

  h.push('<section><div class="sechead"><h2>Today</h2><span class="n">' +
    (S.log[today()] ? "logged" : "nothing yet") + '</span></div><div class="card">' + weekStrip(c) + '</div></section>');

  h.push('<section><div class="sechead"><h2>Your tracks</h2><a class="n" href="#/tracks">See all</a></div><div class="grid two">');
  tracks.slice(0, 4).forEach(function (t) { h.push(trackCard(t)); });
  h.push('</div></section>');
  return h.join("");
}

function weekStrip(c) {
  var h = ['<div class="week">'], names = ["S", "M", "T", "W", "T", "F", "S"];
  for (var i = 6; i >= 0; i--) {
    var d = new Date(); d.setDate(d.getDate() - i);
    var on = !!S.log[dayKey(d)];
    h.push('<div class="d"><div class="dot' + (on ? " on" : "") + '">' + (on ? "◆" : "") + '</div>' +
      '<div class="lb">' + names[d.getDay()] + '</div></div>');
  }
  h.push('</div><p class="proglab">' + (c.streak ? c.streak + ' day streak · best ' + c.best : 'No streak yet — answer one question to start one') +
    '. Lessons never expire, so a gap costs the streak and nothing else.</p>');
  return h.join("");
}

function trackCard(t) {
  var tc = trackCounts(t), g = S.grades[t.id] || 0;
  return '<a class="tcard" href="#/t/' + esc(t.id) + '">' +
    (t.tag ? '<span class="tag">' + esc(t.tag) + '</span>' : '') +
    '<h3>' + esc(t.title) + '</h3>' +
    (t.subtitle ? '<p class="sub">' + esc(t.subtitle) + '</p>' : '') +
    '<div class="prog"><i style="width:' + tc.pct + '%"></i></div>' +
    '<div class="foot"><span class="proglab" style="margin:0">' + tc.done + ' of ' + tc.total + ' lessons</span>' +
    '<span class="gradepill g' + g + '">' + (g ? "Grade " + g : "Ungraded") + '</span></div></a>';
}

function viewTracks() {
  var tracks = allTracks();
  if (!tracks.length) return '<div class="empty"><h3>No tracks</h3><p>Add one on the Add tab.</p><a class="btn" href="#/add">Add a track</a></div>';
  return '<section><div class="sechead"><h2>All tracks</h2><span class="n">' + tracks.length + '</span></div>' +
    '<div class="grid two">' + tracks.map(trackCard).join("") + '</div></section>';
}

function viewTrack(id) {
  var t = getTrack(id);
  if (!t) return '<div class="empty"><h3>Track not found</h3><a class="btn" href="#/tracks">All tracks</a></div>';
  var tc = trackCounts(t), nx = nextLesson(t), g = S.grades[t.id] || 0, h = [];

  h.push('<section><h1 style="font-size:24px">' + esc(t.title) + '</h1>' +
    (t.subtitle ? '<p style="color:var(--ink-2);margin:6px 0 13px;font-size:15px">' + esc(t.subtitle) + '</p>' : '') +
    '<div class="prog"><i style="width:' + tc.pct + '%"></i></div>' +
    '<p class="proglab">' + tc.done + ' of ' + tc.total + ' lessons finished' +
    (nx ? ' · next is lesson ' + (nx.i + 1) : ' · all done') + '</p></section>');

  if (!tc.total) {
    h.push('<div class="empty"><h3>No lessons yet</h3><p>Add a quick question, or paste a lesson, on the Add tab.</p>' +
      '<a class="btn" href="#/add">Add to this track</a></div>');
  } else {
    h.push('<section><div class="sechead"><h2>Lessons</h2></div><div class="llist">');
    (t.lessons || []).forEach(function (l, i) {
      var done = lessonDone(t.id, l), isNext = nx && nx.lesson.id === l.id;
      var tot = qTotal(l), rt = qRight(t.id, l);
      h.push('<a class="lrow' + (done ? " done" : "") + (isNext ? " next" : "") + '" href="#/l/' + esc(t.id) + '/' + esc(l.id) + '">' +
        '<span class="no">' + (done ? "✓" : (i + 1)) + '</span>' +
        '<span class="tx"><b>' + esc(l.title) + '</b><small>' +
        (done ? "Finished" : (rt ? rt + " of " + tot + " questions right" : (l.steps || []).length + " steps · " + tot + " questions")) +
        (isNext ? " · next up" : "") + '</small></span><span class="go">→</span></a>');
    });
    h.push('</div></section>');
  }

  h.push('<section><div class="sechead"><h2>Your grade</h2><span class="n">be honest</span></div><div class="card">' +
    '<div class="grades">' + [1, 2, 3, 4].map(function (n) {
      return '<button type="button" data-grade="' + esc(t.id) + '" data-g="' + n + '" aria-pressed="' + (g === n ? "true" : "false") + '">' + n + '</button>';
    }).join("") + '</div><div class="gkey">' + GRADE_KEY.map(function (k) {
      return '<span><b>' + k[0] + '</b> ' + k[1] + '</span>';
    }).join("") + '</div>' +
    '<p class="hint">Grade 4 is the only one that counts: you can hold it when someone who does this for a living pushes back.</p></div></section>');

  if (isMine(t.id)) {
    h.push('<section><div class="btnrow"><button class="btn sm ghost" data-deltrack="' + esc(t.id) + '">Delete this track</button></div></section>');
  }
  return h.join("");
}

function viewLesson(tid, lid) {
  var t = getTrack(tid); if (!t) return '<div class="empty"><h3>Track not found</h3></div>';
  var ls = (t.lessons || []).filter(function (x) { return x.id === lid; })[0];
  if (!ls) return '<div class="empty"><h3>Lesson not found</h3><a class="btn" href="#/t/' + esc(tid) + '">Back to track</a></div>';

  var p = lp(tid, lid), tot = (ls.steps || []).length;
  var si = Math.min(p.step || 0, tot), h = [];
  var passed = 0; (ls.steps || []).forEach(function (s, i) { if (stepDone(tid, ls, i)) passed++; });

  h.push('<section><h1 style="font-size:23px">' + esc(ls.title) + '</h1>' +
    '<p class="proglab" style="margin-top:5px">' + esc(t.title) + '</p></section>');

  if (si === 0 && ls.intro) {
    h.push('<div class="lead"><p>' + esc(ls.intro) + '</p>' +
      (ls.link ? '<p class="src">Open alongside: <a href="' + esc(ls.link) + '" target="_blank" rel="noopener">' +
        esc(ls.linkLabel || ls.link) + '</a></p>' : '') + '</div>');
  }

  h.push('<div class="steps">');
  (ls.steps || []).forEach(function (s, i) {
    h.push('<button type="button" class="pip' + (i === si ? " now" : "") + (stepDone(tid, ls, i) ? " ok" : "") +
      '" data-step="' + i + '" title="' + esc(s.title) + '" aria-label="Step ' + (i + 1) + ': ' + esc(s.title) + '">' + (i + 1) + '</button>');
  });
  h.push('<button type="button" class="pip' + (si === tot ? " now" : "") + (passed === tot && tot ? " ok" : "") +
    '" data-step="' + tot + '" title="Recap" aria-label="Recap">✓</button>');
  h.push('<span class="stepnote">' + (si === tot ? "Recap" : "Step " + (si + 1) + " of " + tot) + ' · ' + passed + '/' + tot + '</span></div>');

  if (si === tot) {
    h.push('<div class="recap"><h3>' + (passed === tot ? "You now know this" : "Where you are") + '</h3><ul>' +
      (ls.recap || ["No recap written for this lesson."]).map(function (r) { return '<li>' + r + '</li>'; }).join("") + '</ul>' +
      (passed < tot ? '<p class="nudge">' + (tot - passed) + ' step' + (tot - passed === 1 ? "" : "s") +
        ' still unanswered. Go back and finish them — a recap only sticks if you earned it.</p>' : '') + '</div>');
    if (ls.open) {
      h.push('<section><div class="sechead"><h2>One thing to write down</h2></div><div class="card">' +
        '<p style="margin:0 0 10px;font-size:15px">' + esc(ls.open) + '</p>' +
        '<textarea id="note" placeholder="A rough line is fine.">' + esc(p.note || "") + '</textarea>' +
        '<p class="hint">Saved as you type.</p></div></section>');
    }
    var nx = nextLesson(t);
    h.push('<div class="stepnav">' +
      '<button class="btn ghost" data-step="' + Math.max(0, tot - 1) + '">← Back</button>' +
      (nx && nx.lesson.id !== lid
        ? '<a class="btn" href="#/l/' + esc(tid) + '/' + esc(nx.lesson.id) + '">Next lesson →</a>'
        : '<a class="btn' + (passed === tot ? " ok" : "") + '" href="#/t/' + esc(tid) + '">Done →</a>') +
      '</div>');
  } else {
    var st = ls.steps[si];
    h.push('<div class="step"><h3>' + esc(st.title) + '</h3>');
    h.push('<div class="teach">' + wrapTables(st.teach || "") + '</div>');
    if (st.look) h.push('<div class="look"><b>Now go and look</b><p>' + st.look + '</p></div>');
    (st.qs || []).forEach(function (q, qi) {
      var key = si + "-" + qi, given = p.ans[key];
      h.push('<div class="qz"><div class="qt">' + q.q + '</div><div class="opts">');
      (q.opts || []).forEach(function (o, oi) {
        var cl = "opt";
        if (given != null) cl += oi === q.correct ? " right" : (oi === given ? " wrong" : " dim");
        h.push('<button type="button" class="' + cl + '" data-ans="' + key + ":" + oi + '"' +
          (given != null ? " disabled" : "") + '><span class="ltr">' + "ABCDEF".charAt(oi) + '</span><span>' + o + '</span></button>');
      });
      h.push('</div>');
      if (given != null) {
        h.push('<div class="fb ' + (given === q.correct ? "good" : "bad") + '"><b>' +
          (given === q.correct ? "Right." : "Not that one.") + '</b> ' + (q.why || "") + '</div>');
        if (given !== q.correct) h.push('<button class="btn sm ghost" style="margin-top:10px" data-retry="' + key + '">Try again</button>');
      }
      h.push('</div>');
    });
    h.push('<div class="stepnav">');
    if (si > 0) h.push('<button class="btn ghost" data-step="' + (si - 1) + '">← Back</button>');
    h.push('<button class="btn" data-step="' + (si + 1) + '">' + (si + 1 === tot ? "Finish" : "Next") + ' →</button>');
    h.push('</div></div>');
  }
  return h.join("");
}

function viewAdd() {
  var tracks = allTracks();
  var opts = tracks.map(function (t) { return '<option value="' + esc(t.id) + '">' + esc(t.title) + '</option>'; }).join("");
  return '' +
  '<section><div class="sechead"><h2>Quick question</h2><span class="n">20 seconds</span></div><div class="card">' +
    '<p class="hint" style="margin:0 0 13px">Just worked something out? Capture it now. Anything you have looked up twice is a question you should have had.</p>' +
    (tracks.length ? '<div class="field"><label class="fl" for="qt">Track</label><select id="qt">' + opts + '</select></div>' +
      '<div class="field"><label class="fl" for="qq">Question</label><input type="text" id="qq" placeholder="What does s.263 actually test?"></div>' +
      '<div class="field"><label class="fl" for="qa">Right answer</label><input type="text" id="qa" placeholder="Who receives the rents and who is owner or lessee"></div>' +
      '<div class="field"><label class="fl" for="qw1">Wrong answer</label><input type="text" id="qw1" placeholder="Who delivers the support"></div>' +
      '<div class="field"><label class="fl" for="qw2">Wrong answer</label><input type="text" id="qw2" placeholder="Whoever signs the tenancy"></div>' +
      '<div class="field"><label class="fl" for="qw3">Wrong answer <span style="font-weight:400;color:var(--muted)">(optional)</span></label><input type="text" id="qw3"></div>' +
      '<div class="field"><label class="fl" for="qy">Why that is the answer</label><textarea id="qy" style="min-height:76px" placeholder="The bit you want to be told when you get it wrong in three months."></textarea></div>' +
      '<button class="btn block" id="addq">Add question</button>'
      : '<p class="hint" style="margin:0">Make a track first.</p>') +
  '</div></section>' +

  '<section><div class="sechead"><h2>New track</h2></div><div class="card">' +
    '<div class="field"><label class="fl" for="nt">Title</label><input type="text" id="nt" placeholder="Cloudflare Workers"></div>' +
    '<div class="field"><label class="fl" for="ns">What it covers <span style="font-weight:400;color:var(--muted)">(optional)</span></label><input type="text" id="ns" placeholder="Routing, KV, bindings, deploys"></div>' +
    '<div class="field"><label class="fl" for="ng">Tag <span style="font-weight:400;color:var(--muted)">(optional)</span></label><input type="text" id="ng" placeholder="Dev"></div>' +
    '<button class="btn block" id="addt">Create track</button>' +
  '</div></section>' +

  '<section><div class="sechead"><h2>Paste a lesson</h2><span class="n">JSON</span></div><div class="card">' +
    '<p class="hint" style="margin:0 0 11px">For a full guided lesson with teach, look and check steps. Paste the JSON for one lesson or an array of them.</p>' +
    (tracks.length ? '<div class="field"><label class="fl" for="jt">Add to track</label><select id="jt">' + opts + '</select></div>' : '') +
    '<div class="field"><textarea id="jp" style="min-height:150px;font-family:var(--mono);font-size:13px" placeholder=\'{"title":"...","intro":"...","steps":[{"title":"...","teach":"&lt;p&gt;...&lt;/p&gt;","look":"...","qs":[{"q":"...","opts":["a","b"],"correct":0,"why":"..."}]}],"recap":["..."],"open":"..."}\'></textarea></div>' +
    '<button class="btn block ghost" id="addj">Add lesson</button>' +
  '</div></section>';
}

function viewStats() {
  var c = counts(), L = levelOf(c.xp), tracks = allTracks(), h = [];
  h.push('<section><div class="tiles">' +
    tile("Level", L.name, L.next ? (L.next[0] - c.xp) + " XP to " + L.next[1] : "top") +
    tile("XP", c.xp, c.right + " right · " + c.lessons + " lessons") +
    tile("Streak", c.streak, "best " + c.best) +
    tile("Accuracy", c.answered ? Math.round(c.right / c.answered * 100) + "%" : "–", c.right + " of " + c.answered) +
    '</div></section>');

  h.push('<section><div class="sechead"><h2>Last seven days</h2></div><div class="card">' + weekStrip(c) + '</div></section>');

  h.push('<section><div class="sechead"><h2>Grades</h2></div><div class="stack">');
  tracks.forEach(function (t) {
    var g = S.grades[t.id] || 0;
    h.push('<div class="card"><b style="font-size:15px">' + esc(t.title) + '</b>' +
      '<div class="grades" style="margin-top:10px">' + [1, 2, 3, 4].map(function (n) {
        return '<button type="button" data-grade="' + esc(t.id) + '" data-g="' + n + '" aria-pressed="' + (g === n ? "true" : "false") + '">' + n + '</button>';
      }).join("") + '</div></div>');
  });
  h.push('</div><div class="gkey">' + GRADE_KEY.map(function (k) { return '<span><b>' + k[0] + '</b> ' + k[1] + '</span>'; }).join("") + '</div></section>');

  h.push('<section><div class="sechead"><h2>Badges</h2><span class="n">' +
    BADGES.filter(function (b) { return b[2](c); }).length + ' of ' + BADGES.length + '</span></div><div class="badges">');
  BADGES.forEach(function (b) {
    var got = false; try { got = !!b[2](c); } catch (e) { }
    h.push('<div class="badge' + (got ? " got" : "") + '"><div class="t">' + esc(b[0]) + '</div><div class="c">' + esc(b[1]) + '</div></div>');
  });
  h.push('</div></section>');

  h.push('<section><div class="sechead"><h2>Your data</h2></div><div class="card">' +
    '<p class="hint" style="margin:0 0 12px">Everything is in this browser. Export a file to move it to another device, then import it there.</p>' +
    '<div class="btnrow"><button class="btn sm" id="exp">Export backup</button>' +
    '<button class="btn sm ghost" id="imp">Import backup</button>' +
    '<button class="btn sm ghost" id="theme">Switch theme</button></div>' +
    '<input type="file" id="impf" accept="application/json,.json" hidden>' +
    '<hr class="sep"><button class="btn sm ghost" id="reset" style="color:var(--bad);border-color:var(--bad)">Reset everything</button>' +
    '<p class="hint">Reset clears progress, grades, streak and any track you wrote. Export first.</p>' +
    '</div></section>');
  return h.join("");
}
function tile(k, v, n) {
  return '<div class="tile"><div class="k">' + esc(k) + '</div><div class="v">' + esc(v) + '</div><div class="n">' + esc(n) + '</div></div>';
}

/* ---------------- router ---------------- */

function parse() {
  var r = (location.hash || "#/").replace(/^#\/?/, "").split("/").filter(Boolean);
  return r.length ? r : [""];
}
function go(h) { location.hash = h; }

function render() {
  var r = parse(), main = document.getElementById("main"), html;
  if (r[0] === "tracks") html = viewTracks();
  else if (r[0] === "t") html = viewTrack(decodeURIComponent(r[1] || ""));
  else if (r[0] === "l") html = viewLesson(decodeURIComponent(r[1] || ""), decodeURIComponent(r[2] || ""));
  else if (r[0] === "add") html = viewAdd();
  else if (r[0] === "stats") html = viewStats();
  else html = viewLearn();
  main.innerHTML = html;
  chrome(r);
  wire(r);
}

/* ---------------- events ---------------- */

function wire(r) {
  var m = document.getElementById("main");
  function on(sel, ev, fn) { m.querySelectorAll(sel).forEach(function (n) { n.addEventListener(ev, function (e) { fn(n, e); }); }); }

  /* lesson */
  if (r[0] === "l") {
    var tid = decodeURIComponent(r[1]), lid = decodeURIComponent(r[2]);
    on("[data-step]", "click", function (n) {
      lp(tid, lid).step = +n.getAttribute("data-step"); save(); render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    on("[data-ans]", "click", function (n) {
      var pr = n.getAttribute("data-ans").split(":"), p = lp(tid, lid);
      if (p.ans[pr[0]] != null) return;
      p.ans[pr[0]] = +pr[1];
      touch(); save(); render();
    });
    on("[data-retry]", "click", function (n) {
      var p = lp(tid, lid); delete p.ans[n.getAttribute("data-retry")]; save(); render();
    });
    var nt = document.getElementById("note");
    if (nt) nt.addEventListener("input", function () {
      lp(tid, lid).note = nt.value.slice(0, 6000);
      clearTimeout(wire._n); wire._n = setTimeout(save, 450);
    });
  }

  /* grading */
  on("[data-grade]", "click", function (n) {
    var id = n.getAttribute("data-grade"), g = +n.getAttribute("data-g");
    if (S.grades[id] === g) delete S.grades[id]; else S.grades[id] = g;
    save(); render();
  });

  /* delete a track you wrote */
  on("[data-deltrack]", "click", function (n) {
    var id = n.getAttribute("data-deltrack");
    if (n.dataset.sure !== "1") { n.dataset.sure = "1"; n.textContent = "Tap again to delete"; return; }
    S.tracks = (S.tracks || []).filter(function (t) { return t.id !== id; });
    delete S.prog[id]; delete S.grades[id];
    save(); toast("Track deleted"); go("#/tracks");
  });

  /* authoring */
  var addq = document.getElementById("addq");
  if (addq) addq.addEventListener("click", function () {
    var tid = document.getElementById("qt").value;
    var q = document.getElementById("qq").value.trim();
    var a = document.getElementById("qa").value.trim();
    var w = [document.getElementById("qw1").value.trim(), document.getElementById("qw2").value.trim(), document.getElementById("qw3").value.trim()].filter(Boolean);
    var why = document.getElementById("qy").value.trim();
    if (!q || !a || !w.length) { toast("Need a question, a right answer and at least one wrong one", true); return; }
    var opts = [a].concat(w), order = opts.map(function (o, i) { return i; });
    for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t2 = order[i]; order[i] = order[j]; order[j] = t2; }
    var shuffled = order.map(function (i) { return opts[i]; });
    addQuestion(tid, { q: q, opts: shuffled, correct: shuffled.indexOf(a), why: why || "You wrote this one yourself." });
    toast("Question added");
    go("#/t/" + encodeURIComponent(tid));
  });

  var addt = document.getElementById("addt");
  if (addt) addt.addEventListener("click", function () {
    var title = document.getElementById("nt").value.trim();
    if (!title) { toast("Give it a title", true); return; }
    var id = uid("t");
    S.tracks.push({
      id: id, title: title,
      subtitle: document.getElementById("ns").value.trim(),
      tag: document.getElementById("ng").value.trim(), lessons: []
    });
    save(); toast("Track created"); go("#/t/" + encodeURIComponent(id));
  });

  var addj = document.getElementById("addj");
  if (addj) addj.addEventListener("click", function () {
    var sel = document.getElementById("jt");
    if (!sel) { toast("Make a track first", true); return; }
    var raw = document.getElementById("jp").value.trim();
    if (!raw) { toast("Nothing pasted", true); return; }
    var data;
    try { data = JSON.parse(raw); } catch (e) { toast("That is not valid JSON", true); return; }
    var list = Array.isArray(data) ? data : [data], added = 0, bad = "";
    for (var i = 0; i < list.length; i++) {
      var v = validateLesson(list[i]);
      if (v) { bad = v; break; }
    }
    if (bad) { toast(bad, true); return; }
    var t = getTrack(sel.value);
    if (!t) { toast("Track not found", true); return; }
    var target = isMine(t.id) ? t : adoptSeed(t);
    list.forEach(function (l) {
      l.id = l.id || uid("l");
      target.lessons.push(l); added++;
    });
    save(); toast(added + (added === 1 ? " lesson added" : " lessons added"));
    go("#/t/" + encodeURIComponent(target.id));
  });

  /* data */
  var exp = document.getElementById("exp");
  if (exp) exp.addEventListener("click", function () {
    var blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "self-learn-anything-" + today() + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    toast("Backup downloaded");
  });
  var imp = document.getElementById("imp"), impf = document.getElementById("impf");
  if (imp && impf) {
    imp.addEventListener("click", function () { impf.click(); });
    impf.addEventListener("change", function () {
      var f = impf.files && impf.files[0]; if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        var p; try { p = JSON.parse(fr.result); } catch (e) { toast("That file is not valid JSON", true); return; }
        if (!p || typeof p !== "object" || !p.prog) { toast("That does not look like a backup", true); return; }
        S = fresh();
        Object.keys(fresh()).forEach(function (k) { if (p[k] != null) S[k] = p[k]; });
        save(); toast("Backup imported"); go("#/"); render();
      };
      fr.readAsText(f);
    });
  }
  var th = document.getElementById("theme");
  if (th) th.addEventListener("click", function () {
    S.theme = S.theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", S.theme);
    save(); toast(S.theme === "dark" ? "Dark" : "Light");
  });
  var rs = document.getElementById("reset");
  if (rs) rs.addEventListener("click", function () {
    if (rs.dataset.sure !== "1") { rs.dataset.sure = "1"; rs.textContent = "Tap again to wipe everything"; return; }
    S = fresh(); save(); document.documentElement.removeAttribute("data-theme");
    toast("Reset"); go("#/"); render();
  });
}

/* A seed track cannot be edited in place, so copy it into your own tracks first. */
function adoptSeed(t) {
  var copy = JSON.parse(JSON.stringify(t));
  copy.lessons = copy.lessons || [];
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
  save();
}
function validateLesson(l) {
  if (!l || typeof l !== "object") return "Each lesson must be an object";
  if (!l.title) return "A lesson needs a title";
  if (!Array.isArray(l.steps) || !l.steps.length) return "A lesson needs a steps array";
  for (var i = 0; i < l.steps.length; i++) {
    var s = l.steps[i];
    if (!s || !s.title) return "Step " + (i + 1) + " needs a title";
    if (!s.teach) return "Step " + (i + 1) + " needs teach text";
    if (s.qs != null && !Array.isArray(s.qs)) return "Step " + (i + 1) + ": qs must be an array";
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

/* ---------------- boot ---------------- */

load();
window.addEventListener("hashchange", render);
render();

if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js").catch(function () { /* offline is a bonus, not a requirement */ });
  });
}
