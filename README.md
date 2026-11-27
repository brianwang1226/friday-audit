# FridayAudit — Black Friday Deal Finder

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/brianwang1226/friday-audit/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/brianwang1226/friday-audit/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

A Black Friday deal finder that checks each deal instead of trusting the
sale badge: 40 deals from 6 stores (Amazon, Best Buy, Walmart, Target,
Samsung, Kohl's), every price read in a deals roundup that names the store
on 27 November 2026, each with an honest verdict — NEW LOW, REAL DEAL,
GOOD PRICE, or CHECK FIRST for a thin cut or a code-only price.

## What it does

- Search, and filter by category, store and discount — including shareable
  filtered views such as `#/?category=TVs` or `#/?q=lego&sort=discount`
- Sort by best verdict, biggest % off, biggest $ saving, or lowest price
- Every deal shows the product, store, sale price, usual price, % off,
  dollars saved, when its price was checked, where it was read, and the
  evidence behind its verdict
- The same product at another store is compared on its page (AirPods Pro 3:
  $149 at Amazon vs $170 at Target; Beats Studio Pro: $99 at Walmart vs
  $140 at Target)
- Works on a desktop and on a phone; static files, no network request, no
  build step

## Run it

```sh
node serve.ts   # serves app/ on http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored make.fun library.

## Entry

Built for the make.fun bounty [Build the best real Black Friday deal
finder](https://make.fun/competitions/black-friday-deal-finder-01) ($250,
top 20 share it). MIT licensed.
