/* Subject: Compliance */
window.SLA_SEED.push({
  id: "ce-basics",
  subjects: ["compliance", "it"],
  title: "Cyber Essentials",
  subtitle: "The five controls, and what changed in April 2026",
  tag: "Compliance",
  lessons: [
    {
      id: "ce-1",
      title: "The five controls",
      intro: "Cyber Essentials is the UK's baseline cyber certification, and it is increasingly a condition of winning work. This lesson covers what it asks for and what changed when version 3.3 took over.",
      links: [
        { label: "NCSC — Requirements for IT Infrastructure v3.3", url: "https://www.ncsc.gov.uk/sites/default/files/2026-08/IT%20Requirements%20v3.3.pdf", note: "PDF · the standard itself" }
      ],
      steps: [
        {
          title: "What it is, and the two levels",
          links: [{ label: "Requirements v3.3 (PDF)", url: "https://www.ncsc.gov.uk/sites/default/files/2026-08/IT%20Requirements%20v3.3.pdf" }],
          teach: "<p><b>Cyber Essentials</b> is a UK government-backed scheme. The National Cyber Security Centre writes the requirements; assessment and certification run through IASME and its certification bodies.</p>" +
            "<p>There are two levels and they test <b>the same controls</b>:</p>" +
            "<ul><li><b>Cyber Essentials</b> — a self-assessment questionnaire, checked by an assessor.</li>" +
            "<li><b>Cyber Essentials Plus</b> — the same controls, <b>independently verified by hands-on technical testing</b>.</li></ul>",
          look: "Open the v3.3 requirements PDF and read the contents page. Note how short it is.",
          qs: [{
            q: "What is the difference between Cyber Essentials and Cyber Essentials Plus?",
            opts: ["Plus has twice as many controls",
                   "Same controls; Plus is verified by technical testing rather than self-assessed",
                   "Plus is for larger companies only",
                   "Plus does not need renewing"],
            correct: 1,
            why: "Same requirements, different level of proof. Plus means an assessor has tested it, not just read your answers."
          }]
        },
        {
          title: "The five controls",
          teach: "<p>Everything in scope has to meet five technical controls:</p>" +
            "<ol><li><b>Firewalls</b> — a correctly configured firewall protecting every device in scope.</li>" +
            "<li><b>Secure configuration</b> — remove defaults and anything you do not need.</li>" +
            "<li><b>Security update management</b> — software supported by its maker and kept patched.</li>" +
            "<li><b>User access control</b> — the right people, the right access, and strong authentication.</li>" +
            "<li><b>Malware protection</b> — a working defence against malicious software.</li></ol>" +
            "<p>That is the whole list. When someone tells you Cyber Essentials requires something that is not on it, ask which control they mean.</p>",
          look: "Write the five controls down from memory, then check them against the PDF.",
          qs: [{
            q: "Which of these is NOT one of the five Cyber Essentials controls?",
            opts: ["Firewalls", "Security update management", "Staff security awareness training", "Malware protection"],
            correct: 2,
            why: "Training is good practice, but it is not one of the five technical controls. Knowing the exact list stops scope creep in a quote."
          }]
        },
        {
          title: "What changed on 27 April 2026",
          teach: "<p>From <b>27 April 2026</b>, new certifications are assessed against <b>version 3.3</b> of the requirements, using the <b>Danzell</b> question set, which replaced Willow.</p>" +
            "<p>The five controls are the same. Three points v3.3 is explicit on, and where clients get caught:</p>" +
            "<ul><li><b>Cloud services cannot be excluded from scope.</b> Microsoft 365, Google Workspace and the like are in.</li>" +
            "<li><b>Multi-factor authentication</b> is required on cloud services.</li>" +
            "<li>Critical and high-risk updates within <b>14 days</b> \u2014 next step.</li></ul>",
          look: "Search the PDF for the word 'cloud' and read the scope wording.",
          qs: [{
            q: "A client wants to leave their Microsoft 365 tenancy out of scope to make certification easier. Under v3.3?",
            opts: ["Fine, if they declare it",
                   "Not allowed — cloud services cannot be excluded from scope",
                   "Allowed for Cyber Essentials, not Plus",
                   "Allowed if MFA is on"],
            correct: 1,
            why: "v3.3 is explicit that cloud services stay in scope. Better to tell a client this at the quote than at the assessment."
          }]
        },
        {
          title: "The 14-day rule in practice",
          teach: "<p>Critical and high-risk security updates must be installed <b>within 14 days</b> of release, across operating systems, applications and network kit such as routers and firewalls. Missing it is a fail.</p>" +
            "<p>Two practical consequences:</p>" +
            "<ul><li>You need <b>evidence of dates</b>: when an update was released and when it was applied.</li>" +
            "<li>Software that its maker no longer supports cannot receive updates, so it cannot meet the control. It has to be upgraded or taken out of scope properly.</li></ul>",
          look: "Pick one laptop you use. Find the date of its last operating system security update.",
          qs: [{
            q: "A high-risk update is released on 1 November and installed on 20 November. Outcome?",
            opts: ["Pass — it was installed", "Fail — it exceeded 14 days", "Pass if it was a weekend", "Only matters for Plus"],
            correct: 1,
            why: "Nineteen days is outside the window. Automatic updates plus a record of dates is how organisations stay inside it."
          }]
        }
      ],
      recap: [
        "NCSC writes the standard; IASME runs assessment. Plus tests the same controls by hand.",
        "Five controls: firewalls, secure configuration, security update management, user access control, malware protection.",
        "v3.3 and the Danzell question set apply from 27 April 2026; the five controls are unchanged.",
        "Cloud services cannot be excluded from scope, and MFA on them is required.",
        "Critical and high-risk updates within 14 days, with dates to prove it."
      ],
      open: "For one small business you know, list what would be in scope: devices, cloud services, and who has admin access."
    }
  ],
  syllabus: [
    { title: "Scoping an organisation properly", covers: "Boundaries, home workers, BYOD and cloud, under v3.3.", kind: "lesson" },
    { title: "MFA that actually holds", covers: "Which accounts need it, which methods count, and the common gaps.", kind: "lesson" },
    { title: "Evidencing the 14-day rule", covers: "What an assessor wants to see, and how to produce it without pain.", kind: "lesson" },
    { title: "Secure configuration checklist", covers: "Defaults, admin accounts, auto-run and unnecessary software.", kind: "lesson" },
    { title: "What Plus testing involves", covers: "The hands-on tests, and how to prepare a client for them.", kind: "lesson" },
    { title: "Build a tender security pack", covers: "The documents a buyer asks for, assembled for one real client.", kind: "milestone" }
  ]
});
