// Access switch for the IYF Preacher Library (Cloudflare Pages Function, runs before every page).
//
// LOCKED = false (head, 29 Oct 2026): open to anyone with the link, kept out of search engines.
// To close it again: set LOCKED = true and redeploy. The shared password is already stored as the Pages
// secret LIBRARY_PASSWORD (set by the head); any user name is accepted. Locked mode fails closed.

const LOCKED = false;

const enc = new TextEncoder();

function same(a, b) {
  const x = enc.encode(a), y = enc.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

async function open(ctx) {
  const res = await ctx.next();
  const out = new Response(res.body, res);
  out.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return out;
}

export async function onRequest(ctx) {
  if (!LOCKED) return open(ctx);
  const pass = ctx.env.LIBRARY_PASSWORD;
  if (!pass) return new Response('The IYF Preacher Library is locked until its password is set.', { status: 503 });
  const header = ctx.request.headers.get('Authorization') || '';
  if (header.startsWith('Basic ')) {
    let decoded = '';
    try { decoded = atob(header.slice(6)); } catch { decoded = ''; }
    const given = decoded.slice(decoded.indexOf(':') + 1);
    if (same(given, pass)) return open(ctx);
  }
  return new Response('Password required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="IYF Preacher Library", charset="UTF-8"', 'Cache-Control': 'no-store' },
  });
}
