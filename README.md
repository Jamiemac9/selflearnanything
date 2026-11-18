# Self Learn Anything

Turn whatever you are working on into something you will still know in six months.

A small, static, offline-capable learning app. No backend, no accounts, no build step.

**Live:** _add your Cloudflare Pages URL here once deployed_

---

## What it does

Every lesson is a sequence of steps, and every step has the same three beats:

1. **Teach** — plain English. Why the thing exists and what it means.
2. **Look** — one specific thing to go and open or do. Not a reading list.
3. **Check** — a multiple-choice question that marks itself and explains why, including why the wrong answers are wrong.

Only one step is on screen at a time, because a wall of questions is what makes people stop.

### Nothing skips

Lessons carry no dates. A lesson is not *Tuesday's lesson*, it is simply the next one. Miss a week and the same lesson is waiting — nothing is marked late and nothing is jumped over. The only cost of a gap is the streak, which counts days you did something rather than days you were supposed to.

This is the main design decision in the app. Date-driven plans punish you for a bad week, and a plan that punishes you gets abandoned.

### Gamified, lightly

- **XP** — 10 per question right first time, 40 per lesson finished, 15 per grade point.
- **Levels** — Beginner through Expert.
- **Streak** — consecutive days with any activity, with a seven-day strip.
- **Grades** — grade yourself 1 to 4 per track. 4 means *you can hold it when someone who does this for a living pushes back*, and it is the only one that counts.
- **Badges** — ten, each tied to a specific thing you actually did.

### Add your own

- **Quick question** — twenty seconds. Question, right answer, wrong answers, and the explanation you want to be given when you get it wrong in three months. Anything you have looked up twice is a question you should have had.
- **New track** — a subject to work through properly.
- **Paste a lesson** — JSON, for a full guided lesson. Schema below.

Seed tracks ship read-only. The moment you add something to one, the app copies it into your own tracks and edits the copy, so your changes are never lost to an update.

---

## Running it

It is plain files. No bundler, no dependencies.

```bash
git clone https://github.com/Jamiemac9/selflearnanything
cd selflearnanything
python3 -m http.server 8080
# http://localhost:8080
```

Service worker registration is skipped on anything but HTTPS, so local development never serves you a stale cache.

---

## Deploying to Cloudflare Pages

No build command and no output directory — it is already static.

### Through the dashboard (two minutes)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Pick `Jamiemac9/selflearnanything`, branch `main`
3. Build settings:
   - Framework preset: **None**
   - Build command: *leave empty*
   - Build output directory: `/`
4. **Save and Deploy**

Every push to `main` redeploys. `_headers` is picked up automatically.

### Through the GitHub Action instead

`.github/workflows/deploy.yml` is included and runs on push to `main`. It needs two repository secrets:

| Secret | Where to get it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | My Profile → API Tokens → Create Token → **Edit Cloudflare Workers** template |
| `CLOUDFLARE_ACCOUNT_ID` | Any Cloudflare dashboard URL, or the account home sidebar |

Then create an empty Pages project named `selflearnanything` once (Workers & Pages → Create → Pages → Direct Upload) so the action has somewhere to push.

Use one method or the other, not both — a Git-connected project rejects direct uploads.

---

## Lesson JSON

Paste one object, or an array of them, into **Add → Paste a lesson**. `teach` takes HTML, so `<p>`, `<ul>`, `<table>`, `<b>` and `<code>` all work. Tables are made horizontally scrollable automatically.

```json
{
  "title": "Where the licensing regime comes from",
  "intro": "One line on what this lesson gives you.",
  "link": "https://www.legislation.gov.uk/ukpga/2023/26/contents",
  "linkLabel": "The Act",
  "steps": [
    {
      "title": "Why this exists",
      "teach": "<p>Plain English. Explain the thing before naming it.</p>",
      "look": "The one specific thing to go and open.",
      "qs": [
        {
          "q": "The question.",
          "opts": ["Wrong", "Right", "Wrong", "Wrong"],
          "correct": 1,
          "why": "Why that is the answer — and why the tempting wrong one is wrong."
        }
      ]
    }
  ],
  "recap": ["One line per thing they now know."],
  "open": "One optional thing to write down in their own words."
}
```

Required: `title`, `steps`, and for each step `title` and `teach`. Each question needs `q`, at least two `opts`, and a `correct` index inside range. Anything invalid is rejected with the step and question number, and nothing is added.

### Writing good questions

The weak version tests recognition. The strong version tests the thing you are actually training for.

| Weak | Strong |
|---|---|
| "Section 4 is the licensing power" | "A provider asks which section could force them to hold a licence. Where do you point?" |
| "There are six standards" | "Someone in the meeting says seven. What do you say?" |

Put the real reasoning in `why`. That is the text you will read when you get it wrong, and it is doing most of the teaching.

---

## Your data

Everything is in `localStorage` under `sla.v1`: progress, answers, notes, grades, streak and any track you wrote. That makes it fast, private and offline — and means it does not travel on its own.

**Stats → Export backup** writes a JSON file. **Import** on the other device restores it, replacing what is there. Export before importing anything you care about, and before using Reset.

Install to a phone home screen: Safari → Share → Add to Home Screen, or Chrome → menu → Install.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Shell. Top bar, tab bar, main, toast |
| `app.js` | Engine: state, router, views, authoring, import/export |
| `app.css` | Mobile-first styles, light and dark, one accent |
| `tracks.js` | Seed tracks in `window.SLA_SEED` |
| `sw.js` | Offline shell. HTML network-first, assets cache-first. Bump `VERSION` on release |
| `_headers` | Cloudflare Pages security and caching headers |
| `manifest.webmanifest` | PWA manifest |

Vanilla JS, no framework, no dependencies. Roughly 1,000 lines total.

## Licence

MIT.
