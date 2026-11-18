/* Subject: Cloudflare */
window.SLA_SEED.push({
  id: "cf-pages",
  subjects: ["cloudflare"],
  title: "Cloudflare Pages, Functions and KV",
  subtitle: "How your own app is hosted, end to end",
  tag: "Cloudflare",
  lessons: [
    {
      id: "cf-1",
      title: "How this app is hosted",
      intro: "The best example to learn from is the one in your hand. Self Learn Anything runs on Cloudflare Pages, a Pages Function and a KV namespace. Four steps through how those fit together.",
      links: [
        { label: "Your repo — selflearnanything", url: "https://github.com/Jamiemac9/selflearnanything", note: "GitHub" },
        { label: "Pages Functions — routing", url: "https://developers.cloudflare.com/pages/functions/routing/", note: "Cloudflare docs" },
        { label: "Workers KV — limits", url: "https://developers.cloudflare.com/kv/platform/limits/", note: "Cloudflare docs" }
      ],
      steps: [
        {
          title: "Static files, plus a few functions",
          links: [
            { label: "The public/ folder", url: "https://github.com/Jamiemac9/selflearnanything/tree/main/public", note: "what Cloudflare serves" },
            { label: "functions/api/sync.js", url: "https://github.com/Jamiemac9/selflearnanything/blob/main/functions/api/sync.js", note: "the only server code" },
            { label: "Pages Functions — routing", url: "https://developers.cloudflare.com/pages/functions/routing/" }
          ],
          teach: "<p>Most of this app is <b>static files</b>: HTML, CSS and JavaScript in the <code>public/</code> folder. Nothing is running on a server waiting for you. Cloudflare holds copies of those files close to wherever you are and hands them over.</p>" +
            "<p>The one bit of server code lives in a <code>functions/</code> folder. Pages uses <b>file-based routing</b>: the file's path is the URL. So <code>functions/api/sync.js</code> answers requests to <code>/api/sync</code>. No router to configure.</p>" +
            "<p>Under the hood, a Pages Function is a <b>Worker</b>: same runtime, same <code>Request</code> and <code>Response</code>, same bindings. Pages just wires the routing up from the file names.</p>",
          look: "Open the repo on GitHub. Look at the public/ folder, then open functions/api/sync.js and find the line that starts <code>export async function onRequest</code>.",
          qs: [{
            q: "You add a file at <code>functions/api/health.js</code>. Which URL does it answer?",
            opts: ["/functions/api/health.js", "/api/health", "/health", "Nothing until you add it to a router"],
            correct: 1,
            why: "File-based routing: the path under <code>functions/</code> becomes the URL, minus the extension. That is why <code>sync.js</code> in <code>functions/api/</code> is reachable at <code>/api/sync</code>."
          }]
        },
        {
          title: "Bindings: how code reaches storage",
          links: [
            { label: "wrangler.toml", url: "https://github.com/Jamiemac9/selflearnanything/blob/main/wrangler.toml", note: "where SLA_KV is declared" }
          ],
          teach: "<p>The sync code never holds a password or a connection string. Instead, Cloudflare attaches a <b>binding</b>: a named handle to a resource, handed to your code at run time.</p>" +
            "<p>In this repo, <code>wrangler.toml</code> declares a KV namespace with the binding name <code>SLA_KV</code>. In the code, that shows up as <code>env.SLA_KV</code>. Change which namespace the name points at and the code does not change at all.</p>" +
            "<p>That is also why the sync API is written to answer <b>503 — sync storage is not connected</b> when <code>env.SLA_KV</code> is missing. It fails loudly instead of pretending to save.</p>",
          look: "Open wrangler.toml and find the <code>[[kv_namespaces]]</code> block. Note the binding name and the id.",
          qs: [{
            q: "The live app says sync storage is not connected. Where is the problem most likely to be?",
            opts: ["Your browser's local storage is full",
                   "The KV binding is not attached to that deployment",
                   "Your sync code is wrong",
                   "GitHub is down"],
            correct: 1,
            why: "The 503 comes from the function finding no <code>env.SLA_KV</code>. Check the project's <b>Settings → Bindings</b> in Cloudflare for <code>SLA_KV</code>, add it if missing, and redeploy."
          }]
        },
        {
          title: "What KV is good at, and its limits",
          links: [
            { label: "Workers KV — limits", url: "https://developers.cloudflare.com/kv/platform/limits/", note: "Cloudflare docs" }
          ],
          teach: "<p>KV is a key–value store: you put a value under a key and read it back. It is built for <b>lots of reads and fewer writes</b>.</p>" +
            "<p>On the free plan: <b>100,000 reads a day</b>, <b>1,000 writes a day</b> to different keys, and no more than <b>one write per second to the same key</b>.</p>" +
            "<p>It is also <b>eventually consistent</b>. A write shows up straight away where it was made, but other regions can take up to about <b>60 seconds</b> to see it.</p>" +
            "<p>This is why the app waits <b>five seconds</b> after your last change before syncing, rather than saving on every tap: it batches a burst of answers into one write and stays well under both the per-key and the daily limits.</p>",
          look: "Open the KV limits page and find the free-plan row for writes to the same key.",
          qs: [
            {
              q: "Why does the app wait a few seconds after a change before it syncs?",
              opts: ["To make the animation finish",
                     "To batch changes into one write and stay under KV's write limits",
                     "Because KV is read-only for five seconds",
                     "To save battery"],
              correct: 1,
              why: "One key per sync code, and KV allows one write per second per key and 1,000 writes a day on the free plan. Batching a burst of taps into one write keeps you safely inside both."
            },
            {
              q: "You answer on your laptop, then open your phone a few seconds later. What might you see?",
              opts: ["Always the new answer instantly",
                     "Possibly the old state for up to about a minute, until the change propagates",
                     "An error",
                     "Your progress wiped"],
              correct: 1,
              why: "Eventual consistency. The phone may read a slightly older copy for a short while. Nothing is lost: the merge keeps answers from both devices, so the next sync puts it right."
            }
          ]
        },
        {
          title: "One push, one deploy",
          links: [
            { label: "Your commit history", url: "https://github.com/Jamiemac9/selflearnanything/commits/main", note: "every push is a deploy" }
          ],
          teach: "<p>With the project connected to GitHub, Cloudflare watches the repo. Every push to <code>main</code> starts a build and publishes a new production deployment. Pushes to other branches get their own <b>preview deployments</b> on separate URLs, so you can check a change before it goes live.</p>" +
            "<p><code>wrangler.toml</code> tells Pages two things here: serve the <code>public</code> folder, and attach <code>SLA_KV</code>. Because it lives in the repo, the setup travels with the code instead of living only in a dashboard.</p>",
          look: "Open the commit history. Each commit on main is a version of the app that was, or will be, deployed.",
          qs: [{
            q: "You push a fix straight to main. What happens next, with the Git integration on?",
            opts: ["Nothing until you click deploy in the dashboard",
                   "Cloudflare builds and publishes it as the new production version",
                   "It goes to a preview URL only",
                   "GitHub publishes it"],
            correct: 1,
            why: "Main is the production branch. Push to it and Cloudflare builds and deploys. Use a separate branch when you want a preview first."
          }]
        }
      ],
      recap: [
        "Pages serves static files from public/ and runs anything in functions/ as Workers.",
        "File-based routing: functions/api/sync.js answers /api/sync.",
        "A binding (SLA_KV) gives code a named handle to storage, declared in wrangler.toml.",
        "KV free plan: 100,000 reads and 1,000 writes a day, one write per second per key, up to ~60s to propagate.",
        "Push to main and Cloudflare deploys; other branches get preview URLs."
      ],
      open: "Look at another project you run on Cloudflare. Which parts are static, and which, if any, need a Function?"
    }
  ],
  syllabus: [
    { title: "Custom domains and DNS for a Pages project", covers: "Point your own domain at a Pages site, what Cloudflare sets up for you, and how long it takes.", kind: "lesson" },
    { title: "Workers versus Pages", covers: "When a standalone Worker is the better fit than a Pages Function.", kind: "lesson" },
    { title: "D1 and R2", covers: "Cloudflare's SQL database and object storage, and when to reach for each instead of KV.", kind: "lesson" },
    { title: "Wrangler on the command line", covers: "Run the app with its Functions locally, tail logs, and deploy without the dashboard.", kind: "lesson" },
    { title: "Caching and cache rules", covers: "What Cloudflare caches by default and how _headers changes it.", kind: "lesson" },
    { title: "Cloudflare Access", covers: "Putting a private tool behind a login without writing auth code.", kind: "lesson" },
    { title: "Ship a second app end to end", covers: "Take one of your own projects from repo to live Pages URL with a binding.", kind: "milestone" }
  ]
});
