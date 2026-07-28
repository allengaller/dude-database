# DUDE Database

> **Global lifestyle database** — real-venue guides across 11 cities × 33 lifestyle categories, plus a curated archive of 400+ classic video games.

A static, single-page web frontend backed by a Node.js data pipeline. All content is Markdown; the frontend renders it with [marked.js](https://marked.js.org/).

[中文版说明](项目说明.md) · [Data pipeline docs](数据管道说明.md) · [Project evaluation](项目评估.md) · [Integrity report](整改报告.md)

---

## At a glance

| | |
|---|---|
| Cities | Shanghai · Hangzhou · Shenzhen · Hong Kong · Tokyo · Seoul · Singapore · Bangkok · New York · Moscow · Saint Petersburg |
| Lifestyle themes | 7 (`游戏` 娱乐 / `娱乐` 夜生活 / `景点` 观光 / `购物` 周边 / `健康` 医疗 / `生活` 日常 / `身后` 殡葬) |
| Lifestyle categories | 33 |
| Markdown files | 930+ |
| Games archived | 400+ across 5 decades (1980s–2020s) |
| Frontend | Vanilla HTML/JS/CSS — no build step |
| Pipeline | Node.js 18+ + Amap API (China cities) |
| License | [MIT](LICENSE) |

---

## Quick start

### Browse the database

```bash
# from repo root
python3 -m http.server 8000
# open http://localhost:8000
```

No build, no install. The frontend is fully static.

### Run the test suite

```bash
npm install   # installs Jest + dev deps only
npm test
```

### Run the data pipeline (optional)

```bash
# Add your Amap API key — see https://lbs.amap.com/
echo "AMAP_KEY=your_key_here" > .env
npm run fetch          # fetch all 4 China cities
npm run fetch -- --city=shanghai --category=spa   # one city × category
npm run generate       # turn data/venues/*.json into themed/*.md
```

International cities (Tokyo, New York, Moscow, …) and the Dianping crawler are **disabled by default** — see [`数据管道说明.md`](数据管道说明.md).

---

## Repository layout

```
dude-database/
├── 游戏 娱乐 景点 购物 健康 生活 身后/   ← 7 themed directories, primary content
├── gaming/                              ← classic games archive (decade × series)
├── adult-industry/                      ← global adult industry overview (18+)
├── assets/
│   ├── app.js                           ← frontend logic (vanilla JS)
│   └── style.css                        ← design tokens + components
├── scripts/
│   ├── data-pipeline/                   ← Amap fetch + EJS generator
│   └── tests/                           ← Jest suite (structure + content quality)
├── _meta/                               ← restructuring & audit history
├── index.html                           ← single-page frontend entry
├── README.md  ← you are here
├── LICENSE                              ← MIT
├── CONTRIBUTING.md                      ← how to add cities / categories
├── 模板.md                              ← content template (中文)
└── 项目说明.md  项目评估.md  整改报告.md  数据管道说明.md  (中文项目文档)
```

---

## Project goals

1. **Coverage** — every (city × category) combination has at least one curated guide.
2. **Trust** — every guide carries a credibility badge (L1 真实场所 / L2 知名品牌 / L3 通用介绍) and a `最后核实` date.
3. **Freshness** — the data pipeline is wired to refresh China-city data weekly; non-China cities are maintained manually.
4. **Open contribution** — see [CONTRIBUTING.md](CONTRIBUTING.md). Dianping scraping is **not** accepted.

---

## Roadmap

See [`项目评估.md`](项目评估.md) for the current state and the v1.0 MVP plan (`/Users/allengaller/.claude/plans/zesty-spinning-map.md`):

- **Phase 1 — Hygiene (this PR)** — README/LICENSE, frontend bug fixes, CI guards
- **Phase 2 — MVP lock-in** — 3 cities × 10 categories with credibility badges
- **Phase 3 — Search/UX** — Fuse.js + static `assets/index.json`
- **Phase 4 — Pipeline** — fix known bugs so the pipeline can supplement L1 data
- **Phase 5 — Validation** — Jest assertions on content (not just file existence)

---

## Disclaimer

The database includes content on **medical, end-of-life, and adult-industry** topics. By browsing, you confirm that you are 18+ and will rely on official channels for any consequential decisions (medical referrals, funeral arrangements, etc.).

The project is under active integrity review. See [`整改报告.md`](整改报告.md) for the audit log.

---

© 2026 DUDE Database Contributors · MIT License