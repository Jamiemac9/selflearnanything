/* Self Learn Anything — sync endpoint (Cloudflare Pages Function).
   GET  /api/sync  -> the stored state for this sync code, or 404
   PUT  /api/sync  -> store { state } for this sync code

   There are no accounts. The sync code IS the credential: 16 Crockford base32
   characters (80 bits), sent in the X-Sync-Code header so it never appears in
   URLs or access logs. KV keys are a SHA-256 of the code, so the namespace
   never holds a usable code. Requires a KV binding named SLA_KV. */

const MAX_BYTES = 1_000_000;
const CODE_RE = /^[0-9A-HJKMNP-TV-Z]{16}$/;

const json = (obj, status = 200, extra = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra },
  });

const normalise = (raw) => String(raw || "").toUpperCase().replace(/[^0-9A-Z]/g, "");

async function storageKey(code) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("sla-sync:" + code));
  return "s:" + [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function onRequest({ request, env }) {
  if (!env.SLA_KV) return json({ error: "Sync storage is not connected to this deployment." }, 503);

  const code = normalise(request.headers.get("x-sync-code"));
  if (!CODE_RE.test(code)) return json({ error: "That sync code is not valid." }, 400);
  const key = await storageKey(code);

  if (request.method === "GET") {
    const stored = await env.SLA_KV.get(key);
    if (!stored) return json({ error: "Nothing saved under this code yet." }, 404);
    return new Response(stored, {
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    });
  }

  if (request.method === "PUT") {
    if (Number(request.headers.get("content-length") || 0) > MAX_BYTES) {
      return json({ error: "Too large to sync (1 MB limit)." }, 413);
    }
    const text = await request.text();
    if (text.length > MAX_BYTES) return json({ error: "Too large to sync (1 MB limit)." }, 413);

    let body;
    try { body = JSON.parse(text); } catch { return json({ error: "Body is not valid JSON." }, 400); }
    if (!body || typeof body.state !== "object" || body.state === null || Array.isArray(body.state)) {
      return json({ error: "Body must be { state: {...} }." }, 400);
    }

    const at = Date.now();
    await env.SLA_KV.put(key, JSON.stringify({ state: body.state, at }), { metadata: { at } });
    return json({ ok: true, at });
  }

  return json({ error: "Method not allowed." }, 405, { allow: "GET, PUT" });
}
