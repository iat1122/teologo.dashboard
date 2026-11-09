const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => '$' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const stockBadge = q => q === 0
  ? '<span class="badge out">Out of stock</span>'
  : q <= 5 ? '<span class="badge low">Low stock</span>' : '<span class="badge ok">In stock</span>';
async function api(url, options) {
  const res = await fetch(url, options && { headers: { 'Content-Type': 'application/json' }, ...options });
  let body;
  try {
    body = await res.json();
  } catch {
    const status = `${res.status} ${res.statusText}`.trim();
    throw new Error(` + ADD ITEM`);
  }
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status} ${res.statusText}).`);
  return body;
}
