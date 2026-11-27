// The pages: the deal list and one deal's page. Every value is escaped
// before it goes into the page, and every number on screen comes from the
// deal's own data, so the screenshots always match the code behind them.

import { deals, categories, stores } from "./deals.js";
import { discountPercent, savedDollars, verdictOf, sameProduct, SORTS, summarize } from "./scoring.js";

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) =>
  `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
const checkedDay = (iso) =>
  new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC";

export function filterDeals({ query = "", category = "", store = "", minDiscount = 0 }) {
  const q = query.trim().toLowerCase();
  return deals.filter((d) => {
    if (category && d.category !== category) return false;
    if (store && d.store !== store) return false;
    if (discountPercent(d) < minDiscount) return false;
    if (q && !`${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

function dealCard(d) {
  const v = verdictOf(d);
  return `<article class="card">
  <div class="card-top">
    <span class="badge badge-${escape(d.verdict)}">${escape(v.label)}</span>
    <span class="off">${discountPercent(d)}% off</span>
  </div>
  <h2><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h2>
  <p class="meta">${escape(d.store)} &middot; ${escape(d.category)}</p>
  <p class="price">${usd(d.price)} <s>${usd(d.was)}</s> <span class="save">save ${usd(savedDollars(d))}</span></p>
  <p class="why">${escape(d.note)}</p>
  <p class="checked">Checked ${checkedDay(d.checked)} &middot; <a class="store-link" href="${escape(d.url)}" rel="noopener">View at ${escape(d.store)} &rarr;</a></p>
</article>`;
}

function filterBar(state) {
  const catOptions = [`<option value="">All categories</option>`, ...categories.map((c) => `<option value="${escape(c)}"${state.category === c ? " selected" : ""}>${escape(c)}</option>`)].join("");
  const storeOptions = [`<option value="">All stores</option>`, ...stores.map((s) => `<option value="${escape(s)}"${state.store === s ? " selected" : ""}>${escape(s)}</option>`)].join("");
  const discOptions = [0, 20, 30, 40, 50].map((n) => `<option value="${n}"${state.minDiscount === n ? " selected" : ""}>${n === 0 ? "Any discount" : n + "% off or more"}</option>`).join("");
  const sortOptions = Object.entries(SORTS).map(([k, s]) => `<option value="${k}"${state.sort === k ? " selected" : ""}>${escape(s.label)}</option>`).join("");
  return `<div class="filters" role="search">
  <label>Search <input id="q" type="search" value="${escape(state.query)}" placeholder="Try &ldquo;lego&rdquo; or &ldquo;TV&rdquo;" aria-label="Search deals"></label>
  <label>Category <select id="category">${catOptions}</select></label>
  <label>Store <select id="store">${storeOptions}</select></label>
  <label>Discount <select id="minDiscount">${discOptions}</select></label>
  <label>Sort <select id="sort">${sortOptions}</select></label>
</div>`;
}

export function listPage(state) {
  const shown = filterDeals(state).sort(SORTS[state.sort].key);
  const stats = summarize(deals);
  const chips = categories.map((c) => `<button class="chip${state.category === c ? " active" : ""}" data-category="${escape(c)}">${escape(c)}</button>`).join("");
  return `<section class="hero">
  <h1>Black Friday, checked deal by deal.</h1>
  <p class="lede">${stats.count} deals from ${stats.stores} stores, checked ${checkedDay(deals[0].checked)}. Median discount ${stats.medianDiscount}% — $${stats.totalSaved.toLocaleString("en-US")} saved in all, ${stats.newLows} at their best price ever. Every deal carries its verdict: a real bargain, or a sale badge hiding a routine price.</p>
  <p class="chips">${chips}</p>
</section>
${filterBar(state)}
<p class="count" aria-live="polite">Showing ${shown.length} of ${deals.length} deals</p>
${shown.length === 0 ? `<p class="empty">No deal matches. Clear a filter or try another search.</p>` : `<div class="grid">${shown.map(dealCard).join("")}</div>`}
<p class="method"><strong>How we check:</strong> each price was read in a deals roundup that names the store, on 27 Nov 2026. A deal is a NEW LOW only when the source says it is the best price seen; CHECK FIRST means the cut is thin or needs a code. Prices move all day — confirm the price at the store before you buy.</p>`;
}

export function detailPage(deal) {
  const v = verdictOf(deal);
  const others = sameProduct(deal, deals);
  const compare = others.length === 0 ? "" : `<section class="compare">
  <h2>Same product, another store</h2>
  <ul>${others.map((o) => `<li><a href="#/deal/${encodeURIComponent(o.id)}">${escape(o.store)}</a>: ${usd(o.price)} (${discountPercent(o)}% off) — ${o.price < deal.price ? `${usd(deal.price - o.price)} cheaper than here` : `${usd(o.price - deal.price)} more than here`}</li>`).join("")}</ul>
</section>`;
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <span class="badge badge-${escape(deal.verdict)}">${escape(v.label)}</span>
  <span class="hint">${escape(v.hint)}</span>
  <h1>${escape(deal.title)}</h1>
  <p class="price big">${usd(deal.price)} <s>${usd(deal.was)}</s></p>
  <p class="save-line">${discountPercent(deal)}% off — you save ${usd(savedDollars(deal))}</p>
  <dl>
    <dt>Store</dt><dd>${escape(deal.store)}</dd>
    <dt>Category</dt><dd>${escape(deal.category)}</dd>
    <dt>Checked</dt><dd>${checkedDay(deal.checked)}</dd>
    <dt>Read in</dt><dd>${escape(deal.source)}</dd>
    ${deal.code ? `<dt>Code</dt><dd>${escape(deal.code)}</dd>` : ""}
  </dl>
  <p class="why big">${escape(deal.note)}</p>
  <p><a class="buy" href="${escape(deal.url)}" rel="noopener">Find it at ${escape(deal.store)} &rarr;</a></p>
  <p class="fine">Link goes to the store's search for this product — check the price at checkout before you buy.</p>
</article>
${compare}`;
}

export function missingPage() {
  return `<h1>Not found</h1><p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
