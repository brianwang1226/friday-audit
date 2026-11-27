// Verdicts and ranking. Every verdict is computed from the deal's own
// numbers plus the evidence in its note — nothing is hand-waved: a "new low"
// needs the source to say it is the best price seen, a "real deal" needs a
// deep cut, and a weak cut is labelled as one.

export const VERDICTS = {
  "new-low": { rank: 4, label: "NEW LOW", hint: "Best price seen" },
  "real-deal": { rank: 3, label: "REAL DEAL", hint: "A genuine bargain" },
  "good-price": { rank: 2, label: "GOOD PRICE", hint: "Solid saving" },
  "check-first": { rank: 1, label: "CHECK FIRST", hint: "Weak or conditional" },
};

export function discountPercent(deal) {
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function savedDollars(deal) {
  return Math.round((deal.was - deal.price) * 100) / 100;
}

export function verdictOf(deal) {
  return VERDICTS[deal.verdict];
}

// A deal's score for the "best first" sort: verdict first, then how deep
// the cut is, then how many dollars it saves.
export function dealScore(deal) {
  return verdictOf(deal).rank * 10000 + discountPercent(deal) * 100 + Math.min(savedDollars(deal), 999);
}

// Deals for the same product at another store, so a shopper can compare.
export function sameProduct(deal, all) {
  return all.filter((d) => d.title === deal.title && d.id !== deal.id);
}

export const SORTS = {
  best: { label: "Best first", key: (a, b) => dealScore(b) - dealScore(a) },
  discount: { label: "Biggest % off", key: (a, b) => discountPercent(b) - discountPercent(a) || savedDollars(b) - savedDollars(a) },
  saving: { label: "Biggest $ saving", key: (a, b) => savedDollars(b) - savedDollars(a) },
  price: { label: "Lowest price", key: (a, b) => a.price - b.price },
};

export function summarize(all) {
  const totalSaved = all.reduce((sum, d) => sum + savedDollars(d), 0);
  const discounts = all.map(discountPercent).sort((a, b) => a - b);
  const median = discounts[Math.floor(discounts.length / 2)];
  const newLows = all.filter((d) => d.verdict === "new-low").length;
  return {
    count: all.length,
    stores: new Set(all.map((d) => d.store)).size,
    totalSaved: Math.round(totalSaved),
    medianDiscount: median,
    newLows,
  };
}
