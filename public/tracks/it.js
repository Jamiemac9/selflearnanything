/* Subject: IT */
window.SLA_SEED.push({
  id: "it-web",
  subjects: ["it"],
  title: "How the web reaches your site",
  subtitle: "DNS, records, caching and the orange cloud",
  tag: "IT",
  lessons: [
    {
      id: "it-1",
      title: "DNS in plain English",
      intro: "Every domain you own, every site you launch and every email that lands depends on DNS. Most launch-day panics are DNS. Four steps to stop them being yours.",
      links: [
        { label: "What is a DNS record?", url: "https://www.cloudflare.com/learning/dns/dns-records/", note: "Cloudflare Learning Center" },
        { label: "DNS concepts", url: "https://developers.cloudflare.com/dns/concepts/", note: "Cloudflare docs" },
        { label: "Time to Live (TTL)", url: "https://developers.cloudflare.com/dns/manage-dns-records/reference/ttl/", note: "Cloudflare docs" }
      ],
      steps: [
        {
          title: "Names to addresses",
          links: [{ label: "What is a DNS record?", url: "https://www.cloudflare.com/learning/dns/dns-records/" }],
          teach: "<p>Computers find each other by numbers. DNS is the lookup that turns a name you can remember into where to go.</p>" +
            "<ul><li><b>A</b> — points a name at an IPv4 address. <b>AAAA</b> does the same for IPv6.</li>" +
            "<li><b>CNAME</b> — points a name at <i>another name</i>, not an address. Useful when the target, like a <code>pages.dev</code> URL, manages its own addresses.</li>" +
            "<li><b>MX</b> — says which server receives email for the domain.</li>" +
            "<li><b>TXT</b> — free text, used to prove you own a domain and for email security records.</li></ul>",
          look: "Open the DNS page for one of your domains in Cloudflare. Name the type of each record you see.",
          qs: [{
            q: "You want <code>learn.yourdomain.com</code> to show a site hosted at <code>yourproject.pages.dev</code>. Which record?",
            opts: ["A record", "CNAME record", "MX record", "TXT record"],
            correct: 1,
            why: "You are pointing a name at another name, not at a fixed address. That is a CNAME. Pages sets this up for you when you add a custom domain."
          }]
        },
        {
          title: "Nameservers decide who answers",
          links: [{ label: "DNS concepts", url: "https://developers.cloudflare.com/dns/concepts/" }],
          teach: "<p>Your domain's <b>nameservers</b> say which service holds the definitive records for it — the <b>authoritative</b> answer. You set them at the registrar where you bought the domain.</p>" +
            "<p>If your nameservers point at Cloudflare, Cloudflare's records are the only ones that count. Records sitting at your old host are simply never consulted, however correct they look.</p>",
          look: "Check where one of your domains is registered and which nameservers it uses.",
          qs: [{
            q: "You edit a record at your old hosting company and nothing changes. Nameservers point at Cloudflare. Why?",
            opts: ["Changes take 48 hours",
                   "Only Cloudflare's records are used now, so edits at the old host are ignored",
                   "The old host is down",
                   "You need to clear your browser"],
            correct: 1,
            why: "Whoever the nameservers point at is the source of truth. Make the change in Cloudflare."
          }]
        },
        {
          title: "TTL: why changes take time",
          links: [{ label: "Time to Live (TTL)", url: "https://developers.cloudflare.com/dns/manage-dns-records/reference/ttl/" }],
          teach: "<p>Every record has a <b>TTL</b>, time to live, in seconds. It tells resolvers how long they may keep a cached copy before asking again.</p>" +
            "<p>When you change a record, anyone holding the old copy keeps using it until their cached TTL runs out. That, not some fixed 48-hour rule, is why changes appear gradually.</p>" +
            "<p>Planning a move? Lower the TTL a day ahead, so that when you switch, the old answer expires quickly.</p>",
          look: "Find the TTL on one record. Convert it from seconds into minutes or hours.",
          qs: [{
            q: "A record has a TTL of 3,600 and you change it. Worst case, how long might some visitors see the old answer?",
            opts: ["None — it is instant", "About an hour", "48 hours", "A week"],
            correct: 1,
            why: "3,600 seconds is an hour. A resolver that cached it just before your change can keep serving it for up to that long."
          }]
        },
        {
          title: "The orange cloud",
          teach: "<p>In Cloudflare, a record can be <b>proxied</b> (orange cloud) or <b>DNS only</b> (grey cloud).</p>" +
            "<p>Proxied means visitors connect to Cloudflare, which then fetches from your origin. That hides your server's real address and lets Cloudflare cache, secure and speed things up. DNS only means Cloudflare just answers the lookup and visitors go straight to the address.</p>" +
            "<p>Proxying is for web traffic. Email is not proxied, which is why a mail server's records stay grey.</p>",
          look: "On your DNS page, note which records are orange and which are grey, and say why for each.",
          qs: [{
            q: "What does turning the orange cloud on change?",
            opts: ["Nothing visible",
                   "Web traffic goes through Cloudflare, which can cache and protect it and hides your origin address",
                   "Email gets faster",
                   "The domain moves registrar"],
            correct: 1,
            why: "Proxying puts Cloudflare between visitors and your server. Most of what people mean by 'putting a site on Cloudflare' is this switch."
          }]
        }
      ],
      recap: [
        "A and AAAA point at addresses; CNAME points at another name; MX is for mail; TXT proves ownership.",
        "Nameservers decide whose records count. Edit where the nameservers point.",
        "TTL is how long old answers live in caches. Lower it before a move.",
        "Orange cloud: traffic goes through Cloudflare. Grey: DNS only. Mail stays grey."
      ],
      open: "Pick one domain you own and write down, record by record, what each one is for."
    }
  ],
  syllabus: [
    { title: "HTTPS and certificates", covers: "What the padlock actually proves, and how Cloudflare issues certificates for you.", kind: "lesson" },
    { title: "Email that lands: SPF, DKIM, DMARC", covers: "The three TXT records that decide whether your outreach reaches an inbox.", kind: "lesson" },
    { title: "Backups that would actually save you", covers: "The 3-2-1 rule and testing a restore.", kind: "lesson" },
    { title: "Passwords, managers and MFA", covers: "The setup that removes most account takeovers.", kind: "lesson" },
    { title: "A VPS in plain English", covers: "What you get, what you are now responsible for, and how to keep it patched.", kind: "lesson" },
    { title: "Map your own estate", covers: "Every domain, server and account you run, written down in one place.", kind: "milestone" }
  ]
});
