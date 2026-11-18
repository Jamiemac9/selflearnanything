# Self Learn Anything

Turn whatever you are working on into something you will still know in six months.

A static, offline-capable learning app with optional sync. No accounts, no framework, no build step.

**Live:** _add your Cloudflare Pages URL here once deployed_

---

## What it does

Every lesson is a sequence of steps, and every step has three beats:

1. **Teach** — plain English. Why the thing exists and what it means.
2. **Look** — one specific thing to go and open or do.
3. **Check** — a question that marks itself and explains why, including why the wrong answers are wrong.

One step on screen at a time, because a wall of questions is what makes people stop.

### Nothing skips

Lessons carry no dates. The next lesson is the first unfinished one, so a gap of a week leaves the same lesson waiting. A gap costs the streak and nothing else. Tracks can also carry a **road ahead**: a numbered list of lessons not written yet, so you can see where a subject goes without anything pretending to be overdue.

### Feedback that means something

- **What you know** — every finished lesson's recap, plus every question you wrote yourself, collected in one place and running along the home screen. This is the real score.
- **XP and levels** — 10 per question right first time, 40 per finished lesson, 15 per grade point.
- **Streak** — consecutive days with any activity.
- **Self-grades** — 1 to 4 per track. 4 means you can hold it when someone who does this for a living pushes back.
- Motion marks real events only: a right answer, a wrong one, a finished lesson, a new level.

---

## Repo layout

```
public/            the site — this is what Cloudflare serves
  index.html
  app.js           engine: state, merge, sync client, router, views
  app.css          the visual language and all motion
  tracks.js        subjects (window.SLA_SUBJECTS) and the supported housing track
  tracks/*.js      one starter track per subject, each pushed into window.SLA_SEED
  sw.js            offline shell; never caches /api/
  _headers         security and caching headers
functions/
  api/sync.js      the sync endpoint (Cloudflare Pages Function)
wrangler.toml      output directory and the KV binding
```

## Run it locally

```bash
python3 -m http.server 8080 --directory public
# http://localhost:8080
```

That runs everything except sync. To run sync locally too:

```bash
npx wrangler pages dev
```

---

## Deploy to Cloudflare Pages

`wrangler.toml` carries the build output directory (`public`) and the KV binding, so a Git-connected project needs almost nothing set in the dashboard.

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Pick `Jamiemac9/selflearnanything`, branch `main`
3. Framework preset **None**, build command **empty**, build output directory **`public`**
4. **Save and Deploy**

Then check the binding landed: project → **Settings** → **Bindings**. You should see `SLA_KV` → `selflearnanything-sync`. If it is not there, add it by hand as a KV namespace binding with exactly that variable name, then redeploy.

Every push to `main` redeploys.

This repo deploys through Cloudflare's Git integration. `.github/workflows/check.yml` only checks the JavaScript parses on every push; it does not deploy.

---

## Sync

No accounts. On the **You** tab, **Turn on sync** generates a private 16-character code. Enter it on another device under **I have a code** and both devices share progress.

- The code is the only credential. It travels in a request header, never in a URL.
- KV stores the data under a SHA-256 of the code, so the namespace never holds a usable code.
- Syncs on open, five seconds after a change, when you leave the tab, and when you come back online.
- **Merges rather than overwrites.** Answers from both devices are kept; the newer device wins on step position and notes; the activity log is a union. Losing progress is the one outcome the design rules out.
- 1 MB per code.

Anyone holding your code can read your progress. Treat it like a password.

---

## Subjects

Tracks belong to one or more **subjects**: Supported Housing, Compliance, Property, Cloudflare, GitHub, AI and IT to start. The Learn screen has a chip row to focus on one subject, and "next up" follows the focus. The Subjects tab shows every subject with its progress; tap one for its tracks. Add your own subject from the Add tab, then tick it when you create a track.

To add a starter track for a subject, create `public/tracks/<name>.js` that calls `window.SLA_SEED.push({...})` with a `subjects` array, then add it to `index.html` and to `SHELL` in `sw.js`, and bump `VERSION`.

## Reading links

Every lesson can carry sources. They show in three places, all built for a phone: a **Read** button in the lesson's sticky step bar opens a bottom sheet listing every source, grouped by step, with the current step first; each step's "Now go and look" box shows its own links as large buttons; and each track page has a reading list. Links open in a new tab, so your place in the lesson stays put.

## Adding your own material

- **Quick question** — question, right answer, wrong answers, and the explanation you want when you get it wrong in three months. Anything you have looked up twice is a question you should have had.
- **New track** — a subject to work through.
- **Paste a lesson** — JSON. If its title matches the first item on a track's road ahead, that item is ticked off the road.

Seed tracks are copy-on-write: add anything to one and the app copies it into your own tracks first, so an update to the seed never overwrites your work.

### Lesson JSON

```json
{
  "title": "Schedule 3 — licence conditions",
  "intro": "One line on what this lesson gives you.",
  "links": [{ "label": "The draft regulations", "url": "https://www.legislation.gov.uk/…", "note": "optional" }],
  "steps": [
    {
      "title": "Why this exists",
      "teach": "<p>Plain English. Explain the thing before naming it.</p>",
      "look": "The one specific thing to go and open.",
      "links": [{ "label": "The section to read", "url": "https://…" }],
      "qs": [
        { "q": "The question.", "opts": ["Wrong", "Right", "Wrong"], "correct": 1,
          "why": "Why that is the answer, and why the tempting wrong one is wrong." }
      ]
    }
  ],
  "recap": ["One line per thing they now know."],
  "open": "One optional thing to write down in their own words."
}
```

`links` are optional on the lesson and on each step; every `url` must start with http:// or https://. The older `link`/`linkLabel` pair still works. Required: `title`, `steps`, and for each step `title` and `teach`. Each question needs `q`, two or more `opts`, and a `correct` index in range. Anything invalid is rejected with the step and question number, and nothing is added.

Put the real reasoning in `why`. That is the text you read when you get it wrong, and it does most of the teaching.

---

## Your data

Progress lives in `localStorage` (`sla.v1`) and, if sync is on, in KV. **Export** writes a full JSON backup. **Import merges** into what is there — it never wipes anything.

Install to a phone home screen: Safari → Share → Add to Home Screen, or Chrome → menu → Install.

## Licence

MIT.
