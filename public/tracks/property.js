/* Subject: Property */
window.SLA_SEED.push({
  id: "hmo-licensing",
  subjects: ["property", "compliance"],
  title: "HMOs and licensing",
  subtitle: "When a licence is needed, room sizes, and who answers for it",
  tag: "Property",
  lessons: [
    {
      id: "hmo-1",
      title: "When an HMO needs a licence",
      intro: "The rules you already work to, set out with their sources, so you can cite them rather than recall them. The last step links straight to the supported housing regime.",
      links: [
        { label: "Prescribed Description Order 2018 (SI 2018/221)", url: "https://www.legislation.gov.uk/uksi/2018/221/made", note: "who needs a mandatory licence" },
        { label: "Mandatory Conditions Regulations 2018 (SI 2018/616)", url: "https://www.legislation.gov.uk/uksi/2018/616/made", note: "room sizes" },
        { label: "GOV.UK guidance for local housing authorities", url: "https://www.gov.uk/government/publications/houses-in-multiple-occupation-and-residential-property-licensing-reform-guidance-for-local-housing-authorities/houses-in-multiple-occupation-and-residential-property-licensing-reform-guidance-for-local-housing-authorities", note: "HMO licensing reform" }
      ],
      steps: [
        {
          title: "Three kinds of licensing",
          links: [{ label: "Housing Act 2004, Part 2 (HMO licensing)", url: "https://www.legislation.gov.uk/ukpga/2004/34/part/2" }],
          teach: "<p>The Housing Act 2004 gives councils three licensing tools:</p>" +
            "<ul><li><b>Mandatory HMO licensing</b> — Part 2. Set nationally; applies everywhere in England.</li>" +
            "<li><b>Additional HMO licensing</b> — also Part 2, but a council scheme covering HMOs that fall outside the mandatory test.</li>" +
            "<li><b>Selective licensing</b> — Part 3. A council scheme for privately rented homes generally, in a designated area.</li></ul>" +
            "<p>So 'does it need a licence?' always has two halves: the national test, then whatever schemes that particular council runs.</p>",
          look: "Open Part 2 of the Housing Act 2004 and find section 55, which sets out which HMOs it applies to.",
          qs: [{
            q: "Which of these is set nationally rather than by a council scheme?",
            opts: ["Selective licensing", "Additional HMO licensing", "Mandatory HMO licensing", "All three"],
            correct: 2,
            why: "Mandatory licensing is the national floor. Additional and selective schemes vary council by council, so always check the local position too."
          }]
        },
        {
          title: "The mandatory test since October 2018",
          links: [
            { label: "SI 2018/221, article 4", url: "https://www.legislation.gov.uk/uksi/2018/221/article/4/made" },
            { label: "Housing Act 2004, s.254 — meaning of HMO", url: "https://www.legislation.gov.uk/ukpga/2004/34/section/254" }
          ],
          teach: "<p>From <b>1 October 2018</b>, the Licensing of Houses in Multiple Occupation (Prescribed Description) (England) Order 2018 sets the mandatory test. An HMO needs a licence if it is:</p>" +
            "<ul><li>occupied by <b>five or more people</b>,</li>" +
            "<li>forming <b>two or more separate households</b>,</li>" +
            "<li>and meets one of the HMO tests in the Act — broadly, sharing basic amenities such as a kitchen, bathroom or toilet.</li></ul>" +
            "<p>The old <b>three-storey requirement was removed</b>. Children count towards the five.</p>",
          look: "Open article 4 of SI 2018/221 and read the conditions as written.",
          qs: [{
            q: "A two-storey house is let to five unrelated sharers who share the kitchen. Mandatory licence?",
            opts: ["No — it needs three storeys",
                   "Yes — five or more people, two or more households, sharing amenities",
                   "Only if the council has an additional scheme",
                   "Only if there are six"],
            correct: 1,
            why: "Storeys stopped mattering on 1 October 2018. Five people from more than one household sharing amenities is enough."
          }]
        },
        {
          title: "Minimum room sizes",
          links: [{ label: "SI 2018/616", url: "https://www.legislation.gov.uk/uksi/2018/616/made" }],
          teach: "<p>Licences granted from 1 October 2018 must carry minimum sizes for rooms used for sleeping, under the Mandatory Conditions Regulations 2018:</p>" +
            "<ul><li><b>6.51 m²</b> — one person aged over 10</li>" +
            "<li><b>10.22 m²</b> — two people aged over 10</li>" +
            "<li><b>4.64 m²</b> — one child under 10</li></ul>" +
            "<p>These are floors, not targets: a council can set higher standards in its own licence conditions. You will see 10.32 m² quoted for a double room in some guides. It is wrong — the figure is 10.22.</p>",
          look: "Open SI 2018/616 and find the paragraph with the floor areas.",
          qs: [{
            q: "A room of 9.8 m² is offered to a couple, both adults. Under the national minimum?",
            opts: ["Fine — above 6.51", "Too small — two adults need at least 10.22 m²", "Fine if it has a window", "Depends on the storey"],
            correct: 1,
            why: "6.51 m² is for one person. Two people over ten need 10.22 m² at minimum, and the council's own conditions may ask for more."
          }]
        },
        {
          title: "Who answers for it",
          links: [
            { label: "Housing Act 2004, s.263", url: "https://www.legislation.gov.uk/ukpga/2004/34/section/263", note: "person having control / managing" },
            { label: "SHROA 2023, s.4", url: "https://www.legislation.gov.uk/ukpga/2023/26/section/4", note: "supported housing licensing" }
          ],
          teach: "<p>Licensing duties fall on the <b>person having control</b> of the property or the <b>person managing</b> it, as defined in <b>section 263 of the Housing Act 2004</b>: broadly, whoever receives the rack-rent, or the owner or lessee who receives the rents from the occupiers.</p>" +
            "<p>Here is the link to your supported housing track: the <b>Supported Housing (Regulatory Oversight) Act 2023</b> uses that same s.263 test, at section 4(1), to decide who needs a supported housing licence. The skill you use for HMOs is the skill that answers the hardest question in the new regime.</p>",
          look: "Read s.263, then read s.4(1) of the 2023 Act. Note the shared phrase.",
          qs: [{
            q: "Why does s.263 of the Housing Act 2004 matter to supported housing licensing?",
            opts: ["It doesn't — different regimes",
                   "The 2023 Act borrows the same 'person having control or managing' test to decide who needs a licence",
                   "It sets supported housing room sizes",
                   "It abolished HMO licensing"],
            correct: 1,
            why: "Same test, two regimes. That overlap is a real advantage for anyone coming from HMO work into supported housing."
          }]
        }
      ],
      recap: [
        "Mandatory HMO licensing is national (Part 2); additional and selective schemes are local.",
        "Since 1 October 2018: five or more people, two or more households, sharing amenities — no storey test.",
        "Room minimums: 6.51 m², 10.22 m² for two adults, 4.64 m² for a child under ten.",
        "Duties fall on the person having control or managing (s.263) — the same test SHROA uses."
      ],
      open: "Take one property you know. Run the mandatory test on it and write the answer with the article it rests on."
    }
  ],
  syllabus: [
    { title: "The s.254 HMO tests in depth", covers: "Standard, self-contained flat and converted building tests, with worked examples.", kind: "lesson" },
    { title: "Section 257 HMOs", covers: "Converted blocks of flats, and why they catch people out.", kind: "lesson" },
    { title: "HMO management regulations", covers: "The ongoing duties on a manager, not just at licensing.", kind: "lesson" },
    { title: "Fire safety in HMOs", covers: "What councils expect, and how it is evidenced.", kind: "lesson" },
    { title: "Article 4 and planning", covers: "When a change to HMO use needs planning permission.", kind: "lesson" },
    { title: "Licence application, start to finish", covers: "Prepare a complete licence application pack for one property.", kind: "milestone" }
  ]
});
