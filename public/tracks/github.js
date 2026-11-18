/* Subject: GitHub */
window.SLA_SEED.push({
  id: "gh-basics",
  subjects: ["github"],
  title: "Git and GitHub for shipping",
  subtitle: "Commit, push, deploy — and keep secrets out",
  tag: "GitHub",
  lessons: [
    {
      id: "gh-1",
      title: "Commit, push, deploy",
      intro: "You have already shipped this app twice through GitHub. This lesson names what actually happened at each step, so you can do it on purpose next time.",
      links: [
        { label: "Your repo", url: "https://github.com/Jamiemac9/selflearnanything", note: "GitHub" },
        { label: "GitHub Docs — Get started", url: "https://docs.github.com/en/get-started", note: "official" },
        { label: "GitHub Docs — Actions", url: "https://docs.github.com/en/actions", note: "official" }
      ],
      steps: [
        {
          title: "Git and GitHub are different things",
          links: [{ label: "Commit history", url: "https://github.com/Jamiemac9/selflearnanything/commits/main" }],
          teach: "<p><b>Git</b> is version history that lives on your machine. Every <b>commit</b> is a snapshot of the whole project with a message saying what changed and why.</p>" +
            "<p><b>GitHub</b> is a website that hosts a copy of that history online, so other machines, people and services can reach it. Cloudflare deploys from GitHub, not from your laptop.</p>" +
            "<p>So there are always two copies: yours, and GitHub's. Most confusion comes from forgetting which one you are looking at.</p>",
          look: "Open the commit history. Read the first line of each commit message. Each line is one snapshot.",
          qs: [{
            q: "What is a commit?",
            opts: ["An upload to GitHub",
                   "A saved snapshot of the project, with a message, in Git's history",
                   "A Cloudflare deployment",
                   "A backup file"],
            correct: 1,
            why: "A commit is local first. It only reaches GitHub when you <b>push</b>."
          }]
        },
        {
          title: "The loop: add, commit, push",
          teach: "<p>The everyday loop is three commands:</p>" +
            "<ul><li><code>git add -A</code> — stage everything that changed.</li>" +
            "<li><code>git commit -m \"What and why\"</code> — save the snapshot locally.</li>" +
            "<li><code>git push</code> — send your new commits to GitHub.</li></ul>" +
            "<p>Nothing reaches GitHub, and so nothing reaches Cloudflare, until the push. A commit sitting on your laptop is invisible to everyone else.</p>",
          look: "Next time you change a project, run <code>git status</code> before committing. It lists exactly what is about to go in.",
          qs: [{
            q: "You committed a fix an hour ago but the live site has not changed and GitHub shows nothing new. Most likely?",
            opts: ["Cloudflare is slow", "You never pushed", "The commit failed silently", "GitHub needs a refresh"],
            correct: 1,
            why: "Committing saves locally. Pushing sends it. Run <code>git push</code> and check the commit appears on GitHub."
          }]
        },
        {
          title: "Never commit a secret",
          links: [{ label: "GitHub Docs — Actions", url: "https://docs.github.com/en/actions", note: "see: using secrets" }],
          teach: "<p>This repo is <b>public</b>. Anything committed can be read by anyone, and it stays in the history <b>even after you delete the file</b> in a later commit.</p>" +
            "<p>So API keys, tokens, passwords and personal data never go in. They go in <b>secrets</b>: GitHub Actions secrets, or environment variables and bindings in Cloudflare. That is also why your progress export with your notes was kept out of this repo on purpose.</p>" +
            "<p>A <code>.gitignore</code> file lists things Git should never pick up, such as local tool folders.</p>",
          look: "Open .gitignore in the repo and read what it excludes.",
          qs: [{
            q: "You committed an API key by mistake, then deleted it in the next commit. Are you safe?",
            opts: ["Yes, it is gone",
                   "No — it is still in the history; revoke and replace the key",
                   "Yes, if the repo is private later",
                   "Only if nobody starred the repo"],
            correct: 1,
            why: "Deleting the file does not delete the old commit that contains it. Treat the key as leaked: revoke it at the provider and issue a new one."
          }]
        },
        {
          title: "Actions: checks that run on push",
          links: [
            { label: "check.yml", url: "https://github.com/Jamiemac9/selflearnanything/blob/main/.github/workflows/check.yml", note: "this repo's workflow" },
            { label: "Actions runs", url: "https://github.com/Jamiemac9/selflearnanything/actions", note: "green tick or red cross" }
          ],
          teach: "<p><b>GitHub Actions</b> runs jobs automatically when something happens in the repo. In this repo, <code>.github/workflows/check.yml</code> runs on every push and checks that each JavaScript file parses. A broken file shows as a red cross next to the commit.</p>" +
            "<p>Deploying is a separate job, done by <b>Cloudflare's Git integration</b>, which shows up as its own check on each commit.</p>" +
            "<p>A real lesson from this repo: it once had a second deploy job in Actions as well. That job needed a Cloudflare API token stored as a <b>repository secret</b>. None was set, so it failed on every push while Cloudflare deployed fine. Two systems doing one job means one of them is noise. Pick one.</p>" +
            "<p>When a workflow does need a credential, it reads it as <code>${{ secrets.NAME }}</code> from the repo's secret store, never from the file.</p>",
          look: "Open the Actions runs. Find a red cross and a green tick, and open one to read which step failed.",
          qs: [
            {
              q: "Every push shows a red cross from a deploy workflow, but the live site updates fine. Most likely?",
              opts: ["The site is broken",
                     "A second deploy job is failing, often for a missing secret, while another system does the real deploy",
                     "GitHub is down",
                     "The commit was never pushed"],
              correct: 1,
              why: "Read the failed step's log before assuming the worst. Here the log said no API token was set, and Cloudflare's own check on the same commit said deploy successful."
            },
            {
              q: "Where should a workflow get an API token from?",
              opts: ["Written in the workflow file", "Repository secrets, read at run time", "Your laptop", "wrangler.toml"],
              correct: 1,
              why: "Secrets are stored encrypted in the repo settings and injected when the job runs. The workflow file only names them."
            }
          ]
        }
      ],
      recap: [
        "Git is local history; GitHub hosts a copy that services like Cloudflare deploy from.",
        "add → commit → push. Nothing leaves your machine until the push.",
        "Never commit secrets: history keeps them even after deletion. Revoke anything leaked.",
        "Actions run checks on repo events; credentials come from repository secrets.", "One job, one system: a duplicate deploy job just produces red crosses."
      ],
      open: "Which of your other repos is public? Is there anything in its history that should not be?"
    }
  ],
  syllabus: [
    { title: "Branches and pull requests", covers: "Work on a change without touching main, then merge it in on purpose.", kind: "lesson" },
    { title: "Reading a diff", covers: "What a diff shows, and how to review your own change before it ships.", kind: "lesson" },
    { title: "Undoing things safely", covers: "revert versus reset, and which one is safe on a shared branch.", kind: "lesson" },
    { title: "Issues as a task board", covers: "Tracking work in Issues and closing them from commit messages.", kind: "lesson" },
    { title: "Tags and releases", covers: "Marking a version you can always get back to.", kind: "lesson" },
    { title: "Audit a public repo", covers: "Check one of your public repos end to end for secrets and personal data.", kind: "milestone" }
  ]
});
