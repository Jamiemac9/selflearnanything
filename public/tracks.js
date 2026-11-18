/* Self Learn Anything — seed tracks.
   A track is a subject. A lesson is one sitting. A step is teach -> look -> check.
   Nothing here is tied to a calendar date: lessons are sequential and never expire. */

window.SLA_SUBJECTS = [
  { id: "housing",    name: "Supported Housing", tone: "red" },
  { id: "compliance", name: "Compliance",        tone: "deep" },
  { id: "property",   name: "Property",          tone: "maroon" },
  { id: "cloudflare", name: "Cloudflare",        tone: "flame" },
  { id: "github",     name: "GitHub",            tone: "ink" },
  { id: "ai",         name: "AI",                tone: "lime" },
  { id: "it",         name: "IT",                tone: "slate" }
];

window.SLA_SEED = [

{
  id: "sla-how",
  subjects: [],
  title: "How to use this",
  subtitle: "The loop, in one lesson",
  tag: "Start here",
  lessons: [
    {
      id: "how-1",
      title: "The loop",
      intro: "Five minutes. By the end you will know how a lesson works, why nothing here can fall behind, and how to add your own material.",
      steps: [
        {
          title: "Teach, look, check",
          teach: "<p>Every step has the same three beats, in the same order.</p>" +
            "<ol><li><b>Teach</b> — plain English. Why the thing exists and what it means. No jargon before it has been explained.</li>" +
            "<li><b>Look</b> — one specific thing to open or do. Not a reading list. One thing.</li>" +
            "<li><b>Check</b> — a question that marks itself and tells you why, including why the wrong answers are wrong.</li></ol>" +
            "<p>You only ever see one step at a time. That is deliberate: a wall of questions is what makes people stop.</p>",
          look: "Nothing to open. Just notice you are already inside the loop — this is a teach beat, and a check is coming.",
          qs: [{
            q: "What comes between the explanation and the question?",
            opts: ["A summary to memorise", "One specific thing to go and look at", "A timed test", "Nothing"],
            correct: 1,
            why: "Reading alone does not stick. The <b>look</b> beat makes you handle the real thing — the actual document, tool or screen — before you are asked about it. That is where the learning happens."
          }]
        },
        {
          title: "Nothing skips",
          teach: "<p>There are no dates on lessons. None. A lesson is not <i>Tuesday's lesson</i> — it is simply the next one.</p>" +
            "<p>Miss three days and nothing is lost or marked late. You come back and the same lesson is waiting. The only thing a missed day costs you is the <b>streak</b>, which counts days you did something, not days you were supposed to.</p>" +
            "<p>This matters more than it sounds. Date-driven plans punish you for a bad week, and a plan that punishes you gets abandoned. This one waits.</p>",
          look: "Open the Tracks tab and look at any track. Notice the lessons are numbered, not dated.",
          qs: [{
            q: "You do nothing for five days. What happens to your place in a track?",
            opts: ["Lessons are marked overdue", "You are moved forward to catch up", "Nothing — the next lesson is still next", "The track resets"],
            correct: 2,
            why: "Progress is <b>sequential</b>, not scheduled. The next unfinished lesson is always next. Your streak resets, which is the honest cost of a gap, but no content is skipped."
          }]
        },
        {
          title: "Add what you are actually doing",
          teach: "<p>The strongest use of this is not pre-written courses. It is turning whatever you are working on right now into something you will still know in six months.</p>" +
            "<p>Two ways in, both on the <b>Add</b> tab:</p>" +
            "<ul><li><b>New track</b> — a subject you want to work through properly. Give it a title, then add lessons as you learn them.</li>" +
            "<li><b>Quick question</b> — you just worked something out and do not want to lose it. Add it as a single question to any track, in twenty seconds. No lesson structure needed.</li></ul>" +
            "<p>Quick questions are the habit worth building. Every time you look something up twice, that is a question you should have had.</p>",
          look: "Open the Add tab. Look at the Quick question form. Do not fill it in yet.",
          qs: [{
            q: "You have just spent twenty minutes working out something you had looked up once before. What is the move?",
            opts: ["Write it in a notes app", "Add it as a quick question so it comes back to you", "Start a new track for it", "Nothing — you will remember now"],
            correct: 1,
            why: "Looking a thing up twice is the signal. A note is somewhere you have to remember to go back to; a question comes back to you on its own. That is the whole difference."
          }]
        },
        {
          title: "Your progress lives in this browser",
          teach: "<p>There is no account and no server. Everything you do is stored in the browser you are using, which means it is fast, private and works offline.</p>" +
            "<p>It also means it does not travel on its own. To move between your laptop and your phone, use <b>Export</b> on the Stats tab to save a file, and <b>Import</b> on the other device.</p>" +
            "<p>On a phone you can install this to your home screen and it behaves like any other app. In Safari, Share then Add to Home Screen. In Chrome, the menu then Install.</p>",
          look: "Open the Stats tab and find the Export button. That file is your backup.",
          qs: [{
            q: "What is the only way your progress reaches a second device?",
            opts: ["It syncs automatically", "Log in on the other device", "Export a file and import it there", "It does not — each device is separate forever"],
            correct: 2,
            why: "No account means no sync. <b>Export then import</b> moves everything: tracks you wrote, answers, streak, grades. Worth doing after any big session."
          }]
        }
      ],
      recap: [
        "Every step is teach, then look, then check.",
        "Lessons have no dates. The next unfinished one is always next, however long you leave it.",
        "A missed day costs the streak and nothing else.",
        "Add tab: new tracks for subjects, quick questions for things you just worked out.",
        "Progress is in this browser. Export and import to move it."
      ],
      open: "Name one thing you are working on right now that you would have to look up again in a month. That is your first track."
    }
  ]
},

{
  id: "sea-compliance",
  subjects: ["housing", "compliance"],
  title: "Supported Housing Compliance",
  subtitle: "SHROA 2023, licensing, Housing Benefit, the standards",
  tag: "UK property",
  syllabus: [{"title": "Schedule 3 — licence conditions", "covers": "This is the product spec: what a provider gets audited against.", "kind": "lesson", "mod": "M1"},
    {"title": "Schedule 2 + Part 4", "covers": "Grounds for unfitness; fit and proper person test; licence content; five-year duration.", "kind": "lesson", "mod": "M1"},
    {"title": "Part 6 — the enforcement ladder", "covers": "Memorise the ladder in order and both figures: up to £7,000 alongside an improvement notice; up to £40,000 for non-compliance with one.", "kind": "lesson", "mod": "M1"},
    {"title": "Double block — Sch 1, Parts 2–3, 7–9", "covers": "Exemptions still require an application.", "kind": "lesson", "mod": "M1"},
    {"title": "Boss fight 1 + consolidation", "covers": "The three-minute FD brief, out loud, no notes.", "kind": "milestone", "mod": "M1"},
    {"title": "The April 2026 government response", "covers": "What changed from the 2025 consultation, across 500+ responses.", "kind": "lesson", "mod": "M1"},
    {"title": "Standards 1–3", "covers": "For each: what document proves it, who holds it, how often it is reviewed.", "kind": "lesson", "mod": "M1"},
    {"title": "Standards 4–6", "covers": "Same mapping. Standard 6 is where files most often contradict the provider's own stated purpose — an easy, unarguable finding.", "kind": "lesson", "mod": "M1"},
    {"title": "Who holds the licence", "covers": "Build the decision tree for a three-party lease-based scheme: owner, managing agent, support provider.", "kind": "lesson", "mod": "M1"},
    {"title": "Commissioned services and the HB link", "covers": "Licence required, NSHS condition not.", "kind": "lesson", "mod": "M1"},
    {"title": "The local authority side", "covers": "What a licensing officer will actually be able to process, and how fast.", "kind": "lesson", "mod": "M1"},
    {"title": "Nineteen questions", "covers": "Draft an answer to each: a position and a reason, not a view.", "kind": "milestone", "mod": "M1"},
    {"title": "Exempt accommodation — the definition", "covers": "Both limbs: the landlord type limb, and 'or a person acting on its behalf'.", "kind": "lesson", "mod": "M2"},
    {"title": "Specified accommodation — reg 75H", "covers": "Four categories; exempt accommodation is only one.", "kind": "lesson", "mod": "M2"},
    {"title": "R(H) 7/07 in full", "covers": "The 'more than minimal' test, and what failed on the facts.", "kind": "lesson", "mod": "M2"},
    {"title": "CSH/250/2014 and the IHM cases", "covers": "The four-limb test: more than de minimis; more than or different from ordinary property management; significant benefit; a need connecting person, accommodation", "kind": "lesson", "mod": "M2"},
    {"title": "Allerdale BC v JD", "covers": "Para 1(f) read against its legislative history.", "kind": "lesson", "mod": "M2"},
    {"title": "File the response", "covers": "Finalise and submit to MHCLG.", "kind": "milestone", "mod": "M1"},
    {"title": "Awaab's Law Phase 2 — the day before", "covers": "Phase 2 is in force tomorrow.", "kind": "lesson", "mod": "M4"},
    {"title": "Phase 2 is live", "covers": "The law changed while you were reading it.", "kind": "lesson", "mod": "M4"},
    {"title": "Schedule 1 para 1 — word by word", "covers": "1(f) excludes general counselling and any other support services, whoever provides them.", "kind": "lesson", "mod": "M2"},
    {"title": "Eligible by subtraction", "covers": "There is no list of eligible charges — only the ineligible list.", "kind": "lesson", "mod": "M2"},
    {"title": "Intensive housing management", "covers": "Staff and non-staff costs.", "kind": "lesson", "mod": "M2"},
    {"title": "Rent restrictions and the LA's incentive", "covers": "Why exempt status matters in cash terms, and why a local authority has a structural reason to challenge.", "kind": "lesson", "mod": "M2"},
    {"title": "The October 2026 disregards", "covers": "Verify the five figures against the SI and correct the table in M2-HB-Exempt-Accommodation.", "kind": "lesson", "mod": "M2"},
    {"title": "Defend the charge", "covers": "Ten minutes defending a 42-bed IHM charge against a para 1(f) challenge, out loud, no notes.", "kind": "milestone", "mod": "M2"},
    {"title": "Why files fail", "covers": "Build the eight-failure taxonomy: no needs assessment; generic plan; plan but no delivery record; support funded from HB; no link between need and accommodation", "kind": "lesson", "mod": "M2"},
    {"title": "The evidence chain", "covers": "Needs assessment → support plan → delivery record → review → updated plan.", "kind": "lesson", "mod": "M2"},
    {"title": "The contested ground", "covers": "Is a separately funded layer of support required on top of housing management?", "kind": "lesson", "mod": "M2"},
    {"title": "Consultation closes 23:59 tonight", "covers": "Confirm the response is filed — it went in on Day 20.", "kind": "lesson", "mod": "M1"},
    {"title": "Mock review", "covers": "Score it against the taxonomy.", "kind": "lesson", "mod": "M2"},
    {"title": "Cold exam M1+M2", "covers": "20 questions from the 'defend these' lists, closed book, 40 minutes.", "kind": "milestone", "mod": ""},
    {"title": "Safety and Quality Standard", "covers": "Required outcomes and specific expectations.", "kind": "lesson", "mod": "M3"},
    {"title": "TIA and STAIRs", "covers": "New access-to-information requirements folded in from 1 October 2026.", "kind": "lesson", "mod": "M3"},
    {"title": "Neighbourhood and Community; Tenancy", "covers": "The two least-discussed and therefore the two most likely to catch a provider who has prepared only for Safety and Quality.", "kind": "lesson", "mod": "M3"},
    {"title": "Competence and Conduct", "covers": "Standalone fifth consumer standard from 1 Oct 2026.", "kind": "lesson", "mod": "M3"},
    {"title": "Three judgements", "covers": "Extract language, not facts.", "kind": "lesson", "mod": "M3"},
    {"title": "Three notices", "covers": "The failures. Build the phrase bank as a note.", "kind": "lesson", "mod": "M3"},
    {"title": "Write like the regulator", "covers": "A judgement-style finding on a fictional provider.", "kind": "milestone", "mod": "M3"},
    {"title": "Gas", "covers": "CP12 per appliance; Gas Safe registration; evidence it was served on the resident; the no-access procedure and its audit trail.", "kind": "lesson", "mod": "M4"},
    {"title": "Electrical", "covers": "C1/C2/C3 coding, remedial completion evidence, next inspection date.", "kind": "lesson", "mod": "M4"},
    {"title": "Fire", "covers": "A fire risk assessment by a competent person — and evidence the recommendations were actioned.", "kind": "lesson", "mod": "M4"},
    {"title": "Building Safety Act 2022", "covers": "18m or 7+ storeys with 2+ residential units.", "kind": "lesson", "mod": "M4"},
    {"title": "Legionella and asbestos", "covers": "Reg 4 duty to manage: register, management plan, evidence it was shared with anyone likely to disturb the material, re-inspection record.", "kind": "lesson", "mod": "M4"},
    {"title": "HHSRS and Decent Homes", "covers": "Category 1 and category 2 hazards.", "kind": "lesson", "mod": "M4"},
    {"title": "The evidence index", "covers": "Build and ship the integrated compliance evidence matrix.", "kind": "milestone", "mod": "M4"},
    {"title": "Awaab's Law, live", "covers": "What providers got wrong first.", "kind": "lesson", "mod": "M4"},
    {"title": "The integrated matrix", "covers": "Finish it. Add the support-side rows from M1 and M2 — needs assessment, support plan, delivery record, review, service manager assurance.", "kind": "lesson", "mod": "M4"},
    {"title": "Renters' Rights Act — the frame", "covers": "s21 abolished, periodic tenancies default, in force 1 May 2026.", "kind": "lesson", "mod": "M5"},
    {"title": "The supported housing grounds", "covers": "Mandatory versus discretionary.", "kind": "lesson", "mod": "M5"},
    {"title": "The October 2027 point", "covers": "Social housing assured tenancies provided by PRPs are not caught until October 2027.", "kind": "lesson", "mod": "M5"},
    {"title": "Ground 2ZA and the viability limb", "covers": "The lease-based model's exposure when a superior lease ends.", "kind": "lesson", "mod": "M5"},
    {"title": "Possession decision tree", "covers": "Six fact patterns. Route, ground, mandatory or discretionary, notice period, and whether the reforms bite on that landlord yet.", "kind": "milestone", "mod": "M5"},
    {"title": "The Supported Accommodation Regs 2023", "covers": "Scope: looked-after children and care leavers aged 16 and 17 where the local authority has a duty to accommodate or arrange accommodation.", "kind": "lesson", "mod": "M5"},
    {"title": "The quality standards", "covers": "The standards providers are inspected against.", "kind": "lesson", "mod": "M5"},
    {"title": "Registration mechanics", "covers": "Provider-level registration, not setting-level — with a per-building list the provider must keep current.", "kind": "lesson", "mod": "M5"},
    {"title": "SCCIF", "covers": "The April 2026 changes: placement stability, equality duties, complaints handling.", "kind": "lesson", "mod": "M5"},
    {"title": "Outcomes and enforcement", "covers": "Three outcomes, not four.", "kind": "lesson", "mod": "M5"},
    {"title": "Three inspection reports", "covers": "Phrase bank. Ofsted's register is the child's experience, not organisational process — a report for this lane has to sound like that, not like an RSH judgement.", "kind": "lesson", "mod": "M5"},
    {"title": "Ofsted readiness tool", "covers": "Build and ship the readiness audit.", "kind": "milestone", "mod": "M5"},
    {"title": "The 60-point audit", "covers": "Map everything onto one diagnostic instrument.", "kind": "lesson", "mod": ""},
    {"title": "Objection bank", "covers": "Twelve objections an FD or MD will raise, each with the answer and the citation.", "kind": "lesson", "mod": ""},
    {"title": "Pricing", "covers": "Fixed-price diagnostic wedge converting to evidence monitoring.", "kind": "lesson", "mod": ""},
    {"title": "The authority asset", "covers": "Briefing note: what a provider should do before designation.", "kind": "lesson", "mod": ""},
    {"title": "Red team day", "covers": "Argue the other side on every position you hold.", "kind": "lesson", "mod": ""},
    {"title": "Mock meeting", "covers": "Thirty minutes, hostile finance director, recorded.", "kind": "lesson", "mod": ""},
    {"title": "The hostile meeting", "covers": "No bluffs. 'That is contested, and here is where the line sits' is a pass.", "kind": "milestone", "mod": ""},
    {"title": "The gap list", "covers": "Everything still at #conf/3 → push to 4, or list it honestly as unsettled.", "kind": "lesson", "mod": ""},
    {"title": "Case law, cold", "covers": "State each one's principle and what it does not decide, before opening anything.", "kind": "lesson", "mod": "M2"},
    {"title": "What changed in twelve months", "covers": "One page. Every change since Nov 2025 across the five modules.", "kind": "lesson", "mod": ""},
    {"title": "The horizon scanner", "covers": "Set the weekly slot. Run it once now.", "kind": "lesson", "mod": ""},
    {"title": "Maintenance design", "covers": "20 minutes recall daily, one boss fight monthly, one artefact quarterly, the weekly scan.", "kind": "lesson", "mod": ""},
    {"title": "Final mock", "covers": "Ten minutes on each module, out loud, no notes, to a timer.", "kind": "lesson", "mod": ""},
    {"title": "The retainer pitch", "covers": "End to end, out loud, evidence matrix on the table.", "kind": "milestone", "mod": ""}],
  lessons: [
    {
      id: "sea-1",
      title: "Where the licensing regime comes from",
      intro: "You need no law at all to start. This explains why the 2023 Act exists, what it actually does, and the one phrase in it that decides who carries a licence.",
      link: "https://www.legislation.gov.uk/ukpga/2023/26/contents",
      linkLabel: "Supported Housing (Regulatory Oversight) Act 2023",
      steps: [
        {
          title: "Why this Act exists",
          links: [{"label": "The Act — contents", "url": "https://www.legislation.gov.uk/ukpga/2023/26/contents", "note": "legislation.gov.uk"}],
          teach: "<p>Until 2023 there was <b>no national licensing system for supported housing</b> in England. Anyone could set up as a provider, house vulnerable people, claim enhanced Housing Benefit for it, and nobody licensed them or checked whether the support was real.</p>" +
            "<p>Councils could only reach for tools built for something else: HMO licensing and selective licensing under the Housing Act 2004. Those regulate the <i>building</i>. Neither says anything about the support.</p>" +
            "<p>The <b>Supported Housing (Regulatory Oversight) Act 2023</b> is Parliament's answer. But here is the part that catches people out: the Act does not license anybody. It <b>hands the Secretary of State the power</b> to create a licensing system later, through regulations. That is why nothing has changed for providers yet — and why the draft regulations published in October 2026 matter so much. Regulations are where duties land.</p>",
          look: "Open the Act's contents page. Do not read a section yet. Just look at the group headings and notice how short it is: 14 sections, no schedules.",
          qs: [{
            q: "What does the 2023 Act itself require a supported housing provider to do today?",
            opts: ["Hold a licence from its local council",
                   "Nothing directly — it creates powers for the Secretary of State to use later",
                   "Meet the six national standards, which are written into the Act",
                   "Register with the Regulator of Social Housing"],
            correct: 1,
            why: "It is an <b>enabling Act</b>: powers, not provider duties. This is the honest answer when a provider asks what they have to do under it — nothing yet, and that is exactly the problem, because the regulations are drafted and the clock has started."
          }]
        },
        {
          title: "The map",
          links: [{"label": "The Act — contents", "url": "https://www.legislation.gov.uk/ukpga/2023/26/contents", "note": "14 sections, no schedules"}],
          teach: "<p>The Act is in four groups. You do not need detail yet — you need to know where to <i>look</i>.</p>" +
            "<table><tr><th>Group</th><th>What lives there</th></tr>" +
            "<tr><td>Advice, strategy and standards</td><td><b>s.1</b> advisory panel &middot; <b>s.2</b> councils must assess need and publish a strategy &middot; <b>s.3</b> power to set the national standards</td></tr>" +
            "<tr><td>Licensing</td><td><b>s.4</b> the power to require a licence &middot; <b>s.5</b> more on that power &middot; <b>s.6</b> duty to consult &middot; <b>s.7</b> what councils do</td></tr>" +
            "<tr><td>Planning and homelessness</td><td><b>s.8</b> planning &middot; <b>s.9</b> homelessness</td></tr>" +
            "<tr><td>Information</td><td><b>s.10</b> sharing it &middot; <b>s.11</b> using it for statutory purposes</td></tr>" +
            "<tr><td>Interpretation</td><td><b>s.12</b> what 'supported exempt accommodation' means &middot; <b>s.13</b> borrowed definitions &middot; <b>s.14</b> commencement and extent</td></tr></table>" +
            "<p>Two sections carry nearly all the commercial weight: <b>s.4</b> (who needs a licence) and <b>s.12</b> (what counts as supported housing at all).</p>",
          look: "Read the section headings only, sections 1 to 7. Thirty seconds. You are building an index, not learning content.",
          qs: [
            {
              q: "A provider asks which section could force them to hold a licence. Where do you point?",
              opts: ["Section 2", "Section 3", "Section 4", "Section 12"], correct: 2,
              why: "<b>Section 4</b> is the parent power for the whole regime. Every word of the draft regulations traces back to it."
            },
            {
              q: "And which section decides whether a scheme counts as supported housing in the first place?",
              opts: ["Section 3", "Section 7", "Section 12", "Section 14"], correct: 2,
              why: "<b>Section 12</b> defines 'supported exempt accommodation' — the gateway test, and the first question of any audit."
            }
          ]
        },
        {
          title: "The phrase that decides who pays",
          links: [{"label": "Section 4 — licensing regulations", "url": "https://www.legislation.gov.uk/ukpga/2023/26/section/4"}, {"label": "Section 13 — borrowed definitions", "url": "https://www.legislation.gov.uk/ukpga/2023/26/section/13"}, {"label": "Housing Act 2004, s.263", "url": "https://www.legislation.gov.uk/ukpga/2004/34/section/263", "note": "person having control / managing"}],
          teach: "<p>Read s.4(1). The people it catches are described as a person <b>'having control of, or managing'</b> supported exempt accommodation.</p>" +
            "<p>That sounds vague. It is not — <b>s.13</b> says both expressions take their meaning from <b>section 263 of the Housing Act 2004</b>.</p>" +
            "<p>In broad terms under s.263: a <b>person having control</b> is the person who receives the rack-rent. A <b>person managing</b> is an owner or lessee who receives rents or other payments from the people living there, directly or through an agent.</p>" +
            "<p><b>Why this is the money question.</b> A typical non-commissioned scheme has a private owner, a lease to a provider, maybe a managing agent, and support staff. The phrase does not obviously pick out one of them, and it can catch more than one. Every provider will ask you this, and most have quietly assumed the answer is 'not us'.</p>",
          look: "Read s.4(1), then open s.263 of the Housing Act 2004 and read the two definitions. Write the s.4(1) phrase out by hand.",
          qs: [
            {
              q: "A provider asks: is it us or the freeholder who needs the licence? What is your first move?",
              opts: ["Tell them it is always the freeholder, as owner",
                     "Tell them it is always the support provider, because they deliver the support",
                     "Establish who receives the residents' payments and who holds the lease, because s.263 turns on that",
                     "Tell them nobody knows until the regulations are made"],
              correct: 2,
              why: "The test is about <b>money and legal interest</b>, not who does the support work. s.263 turns on who receives the rents and who is owner or lessee — so the answer comes from the structure, and may catch more than one party."
            },
            {
              q: "Why is it an advantage that s.4(1) borrows from s.263 Housing Act 2004?",
              opts: ["The licence will be cheaper",
                     "It is the same test already used for HMO licensing",
                     "Registered providers become exempt",
                     "It removes the fit and proper person test"],
              correct: 1,
              why: "Anyone coming at supported housing from the support side has never touched s.263. Anyone with HMO experience has. The hardest question in the new regime is one that is already familiar."
            }
          ]
        },
        {
          title: "What non-compliance costs",
          links: [{"label": "Section 4 — licensing regulations", "url": "https://www.legislation.gov.uk/ukpga/2023/26/section/4"}, {"label": "Housing and Planning Act 2016, Part 2", "url": "https://www.legislation.gov.uk/ukpga/2016/22/part/2", "note": "banning orders"}],
          teach: "<p>Still in s.4. The regulations may plug a licensing offence into <b>two other Acts</b>, and the difference matters.</p>" +
            "<ul><li><b>Housing Act 2004</b> — a licensing offence can be made a <b>financial penalty</b> offence. A council can fine the organisation.</li>" +
            "<li><b>Housing and Planning Act 2016</b>, Chapters 2 and 3 of Part 2 — it can be made a <b>banning order offence</b>. A banning order is made against <b>a person</b>: it bars that individual from letting or managing housing, and their name goes on a national database.</li></ul>" +
            "<p>One is a cost to the business. The other ends a career.</p>" +
            "<p>One more thing in s.4: the regulations may <b>disapply</b> HMO licensing (Part 2 Housing Act 2004) and selective licensing (Part 3). So a supported housing licence may <i>replace</i> an HMO licence rather than sit on top of it.</p>",
          look: "Find the subsections in s.4 mentioning those two Acts, and the one about disapplying Parts 2 and 3.",
          qs: [
            {
              q: "Why does the Housing and Planning Act 2016 link land harder on a director than on the company?",
              opts: ["The fines are larger",
                     "A banning order is made against an individual and bars them from letting or managing housing",
                     "It gives the company a criminal record",
                     "It transfers the licence to the council"],
              correct: 1,
              why: "Banning orders are <b>personal</b>, with a place on a national database. A fine is a line in the accounts; a banning order removes the person from the sector."
            },
            {
              q: "A client holds HMO licences on eight schemes and asks whether this means two licences each. What does s.4 allow?",
              opts: ["Nothing — they will always need both",
                     "The regulations may disapply HMO and selective licensing, so one may replace the other",
                     "HMO licences are cancelled automatically by the Act",
                     "Councils decide, with no statutory basis"],
              correct: 1,
              why: "s.4 contains a power to disapply Parts 2 and 3 of the Housing Act 2004. Whether and how it is used is a question for the regulations — a precise answer rather than a guess."
            }
          ]
        },
        {
          title: "Why there is a consultation open",
          links: [{"label": "Section 6 — consultation", "url": "https://www.legislation.gov.uk/ukpga/2023/26/section/6"}, {"label": "The consultation on the draft regulations", "url": "https://www.gov.uk/government/consultations/supported-housing-licensing-regime-consultation-on-draft-regulations", "note": "GOV.UK · closes 10 Dec 2026"}],
          teach: "<p><b>s.6</b> says the Secretary of State <b>must</b> consult before making licensing regulations, and names statutory consultees — including the National Housing Federation and the Regulator of Social Housing.</p>" +
            "<p>So the consultation that opened on 15 October 2026 and closes at 23:59 on <b>10 December 2026</b> is not a courtesy exercise. It is the discharge of a statutory duty under s.6.</p>" +
            "<p>That changes what a response is worth. 'We gave some feedback' is forgettable. 'We filed a response to the s.6 consultation on the draft regulations' is a dated, checkable record of being engaged before the regime commenced.</p>",
          look: "Read s.6 and note who the statutory consultees are.",
          qs: [{
            q: "What does filing a consultation response give you that reading the draft regulations does not?",
            opts: ["Early access to the final regulations",
                   "A dated, citable record that you engaged before the regime commenced",
                   "A say in who gets designated first",
                   "Exemption from the licence fee"],
            correct: 1,
            why: "Reading puts you ahead of people who only read summaries. <b>Filing</b> puts you on the record, with a date on it."
          }]
        }
      ],
      recap: [
        "The 2023 Act creates powers, not provider duties — the regulations are where duties land.",
        "s.4 is the licensing power; s.12 is the scope definition. Those two carry the weight.",
        "s.4(1) catches a person 'having control of, or managing', borrowed from s.263 Housing Act 2004.",
        "A licensing offence can become a financial penalty (company) or a banning order (person).",
        "s.6 makes the consultation a statutory duty, which is why filing a response is worth an evening."
      ],
      open: "For a scheme where a private owner leases to a provider who collects the residents' payments and arranges support, who looks like the person 'having control of, or managing'? If you cannot say yet, write what you would need to know. That is a better answer than a guess."
    },

    {
      id: "sea-2",
      title: "What actually counts as supported housing",
      intro: "The single most useful definition in the subject. Every audit starts with it, whether anyone says so or not.",
      link: "https://www.legislation.gov.uk/ukpga/2023/26/contents",
      linkLabel: "Supported Housing (Regulatory Oversight) Act 2023",
      steps: [
        {
          title: "Why scope is the first question",
          teach: "<p>When you score a support file you are judging it against what supported housing is expected to do. That only makes sense if the scheme <b>is</b> supported housing in the legal sense.</p>" +
            "<p>If it is not, you are applying the wrong standard — and a provider who acts on a finding built on the wrong scope test has a genuine complaint against you.</p>" +
            "<p>So before any file is scored: does this scheme meet the definition?</p>",
          look: "Nothing to open. Hold the question in mind: how would I prove this scheme is in scope?",
          qs: [{
            q: "Why must scope be settled before a support file is scored?",
            opts: ["Because the council will ask for it",
                   "Because scoring against supported housing expectations only makes sense if the scheme meets the definition",
                   "Because the file cannot be opened otherwise",
                   "Because Housing Benefit is paid monthly"],
            correct: 1,
            why: "Get scope wrong and every finding below it is built on sand. It is also the fastest way to lose a client's confidence."
          }]
        },
        {
          title: "Three terms that sound the same",
          links: [{"label": "Section 12 — supported exempt accommodation", "url": "https://www.legislation.gov.uk/ukpga/2023/26/section/12"}, {"label": "HB Regulations 2006, reg 75H", "url": "https://www.legislation.gov.uk/uksi/2006/213/regulation/75H", "note": "specified accommodation"}, {"label": "HB & CTB (Consequential Provisions) Regs 2006, Sch 3", "url": "https://www.legislation.gov.uk/uksi/2006/217/schedule/3", "note": "exempt accommodation, para 4(10)"}],
          teach: "<p>This is where almost everyone slips, and getting it right marks you out immediately.</p>" +
            "<table><tr><th>Term</th><th>Defined in</th><th>What it does</th></tr>" +
            "<tr><td><b>Supported exempt accommodation</b></td><td>s.12 of the 2023 Act</td><td>The gateway for <b>licensing</b></td></tr>" +
            "<tr><td><b>Specified accommodation</b></td><td>reg 75H, Housing Benefit Regulations 2006</td><td>Four categories. Decides whether rent is met by <b>Housing Benefit</b> rather than the Universal Credit housing element</td></tr>" +
            "<tr><td><b>Exempt accommodation</b></td><td>Sch 3 para 4(10), HB &amp; CTB (Consequential Provisions) Regs 2006</td><td><b>One of those four</b>. Brings the older, more generous rent rules</td></tr></table>" +
            "<p>They are deliberately <b>aligned</b> but they are not synonyms. Exempt accommodation sits inside specified accommodation. Supported exempt accommodation is the Act's own term, written to line up with the Housing Benefit one.</p>",
          look: "Nothing to open. Say the three out loud with where each one lives.",
          qs: [
            {
              q: "Exempt accommodation and specified accommodation — what is the relationship?",
              opts: ["Two words for the same thing",
                     "Exempt accommodation is one of the four categories of specified accommodation",
                     "Specified accommodation is one category of exempt accommodation",
                     "They are unrelated regimes"],
              correct: 1,
              why: "Specified accommodation is the wider set of four categories; exempt accommodation is one of them. Saying they are the same in front of someone who knows is the slip that costs a room."
            },
            {
              q: "Which of the three is the gateway for the licensing regime?",
              opts: ["Exempt accommodation", "Specified accommodation", "Supported exempt accommodation", "All three equally"],
              correct: 2,
              why: "'Supported exempt accommodation' is the Act's own term, at s.12, drafted to align with the Housing Benefit concepts. That alignment is the architecture of the whole thing."
            }
          ]
        },
        {
          title: "How s.12 is built",
          links: [{"label": "Section 12 — supported exempt accommodation", "url": "https://www.legislation.gov.uk/ukpga/2023/26/section/12"}],
          teach: "<p>Read s.12. You are looking for its <b>structure</b>, not memorising words.</p>" +
            "<ul><li><b>Subsection (1)</b> states what the term means by pointing at categories.</li>" +
            "<li><b>Subsection (2)</b> carries the accommodation types.</li>" +
            "<li>A limb requires the person to <b>receive care, support or supervision</b>. Find where it sits and how it is framed around who provides it and on whose behalf.</li>" +
            "<li><b>Subsection (4)</b> defines a <b>refuge</b>.</li>" +
            "<li>There are cross-references out to the <b>Housing Benefit Regulations 2006</b> and the <b>Universal Credit Regulations 2013</b>.</li></ul>" +
            "<p>Notice what is <b>not</b> there: any statement of how much care, support or supervision is enough.</p>",
          look: "Read s.12 slowly, twice. Write out its structure as a short list in your own words.",
          qs: [{
            q: "Does s.12 tell you how much care, support or supervision is enough to qualify?",
            opts: ["Yes — a weekly minimum in hours",
                   "Yes — by reference to the resident's assessed needs",
                   "No — and in April 2026 government decided against writing such a definition, leaving the case law threshold in place",
                   "No — but the draft 2027 regulations supply one"],
            correct: 2,
            why: "There is no statutory threshold, and that was a <b>decision</b> rather than an oversight: in April 2026 government declined to define 'care, support or supervision', so the existing case law test continues to govern. Saying it was deliberate, and when, answers a question most people fumble."
          }]
        },
        {
          title: "Why it is wired to Housing Benefit",
          links: [{"label": "Section 12", "url": "https://www.legislation.gov.uk/ukpga/2023/26/section/12"}, {"label": "HB Regulations 2006, reg 75H", "url": "https://www.legislation.gov.uk/uksi/2006/213/regulation/75H"}],
          teach: "<p>The s.12 definition was written to line up with the Housing Benefit concept of specified accommodation. That alignment is the engine of the whole regime.</p>" +
            "<p>It means licensing bites on <b>exactly the stock whose income comes through enhanced Housing Benefit</b>. Follow the chain:</p>" +
            "<p><b>No licence and no valid exemption → not lawfully operating → residents not eligible for enhanced Housing Benefit → the income that pays for the scheme stops.</b></p>" +
            "<p>Which is why this is a finance conversation, not a compliance one. A compliance manager hears 'new licensing regime'. A finance director hears 'our Housing Benefit income has a condition attached that did not exist before'.</p>",
          look: "Note the two statutory instruments s.12 cross-refers to, and what each is doing there.",
          qs: [{
            q: "A finance director gives you ninety seconds. Which sentence earns the rest of the meeting?",
            opts: ["There is a new licensing regime coming in 2027 with six national standards",
                   "No licence and no valid exemption means your residents are not eligible for enhanced Housing Benefit",
                   "The 2023 Act created a Supported Housing Advisory Panel",
                   "Councils must publish supported housing strategies"],
            correct: 1,
            why: "All four are true. Only one is about <b>their income</b>. Lead with the revenue consequence and the detail becomes something they ask for rather than something you push."
          }]
        },
        {
          title: "Two sections about your own practice",
          links: [{"label": "Section 10 — sharing information", "url": "https://www.legislation.gov.uk/ukpga/2023/26/section/10"}, {"label": "Section 11 — use of information", "url": "https://www.legislation.gov.uk/ukpga/2023/26/section/11"}, {"label": "Section 13 — other interpretation", "url": "https://www.legislation.gov.uk/ukpga/2023/26/section/13"}, {"label": "Section 14 — commencement and extent", "url": "https://www.legislation.gov.uk/ukpga/2023/26/section/14"}, {"label": "Data Protection Act 2018, s.3", "url": "https://www.legislation.gov.uk/ukpga/2018/12/section/3"}],
          teach: "<p><b>s.10</b> covers sharing information about supported exempt accommodation. <b>s.11</b> covers using information obtained for certain statutory purposes. And <b>s.13</b> confirms that 'the data protection legislation' means what it means in s.3 of the Data Protection Act 2018 — so this sits <b>on top of</b> ordinary data protection law, not instead of it.</p>" +
            "<p>If you audit resident support files, these are the most sensitive documents a provider holds. When an information governance lead asks how you handle that data, placing your practice against ss.10 and 11 and the DPA 2018 is the difference between sounding careful and sounding professional.</p>" +
            "<p>While in s.13, note two entries from the last lesson: <b>person having control</b> and <b>person managing</b>, both borrowed from s.263 Housing Act 2004.</p>",
          look: "Read ss.10, 11 and 13. Then read s.14 and settle the extent question — s.3 carries an E+W marking, so do not assume the whole Act is England-only.",
          qs: [{
            q: "Do ss.10 and 11 replace ordinary data protection law for resident files?",
            opts: ["Yes — a separate regime for supported housing data",
                   "No — s.13 ties 'the data protection legislation' to the DPA 2018, so this sits on top of it",
                   "Yes, but only for councils",
                   "They say nothing about data protection"],
            correct: 1,
            why: "They let information move between bodies <i>within</i> the data protection framework, not around it. An auditor who has this the wrong way round is a liability to their client."
          }]
        }
      ],
      recap: [
        "Scope is the first question of every audit, asked or not.",
        "Supported exempt accommodation (s.12), specified accommodation (reg 75H) and exempt accommodation (Sch 3 para 4(10)) are three different things in three places.",
        "s.12 gives structure but no threshold for care, support or supervision — government decided against one in April 2026.",
        "The definition is wired to Housing Benefit on purpose: no licence, no enhanced HB, no income.",
        "ss.10, 11 and 13 sit on top of the DPA 2018; s.13 is where borrowed definitions live."
      ],
      open: "Write the scope test as a three or four line checklist you could apply to a file before scoring anything in it."
    }
  ]
}

];
