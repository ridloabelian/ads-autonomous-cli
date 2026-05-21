# Ads Autonomous CLI 🚀

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)](https://main.ads-dashboard-4ce.pages.dev)
[![API](https://img.shields.io/badge/API-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)](https://ads-autonomous-api.ridloabelian.workers.dev/api/health)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Stack: React + Vite](https://img.shields.io/badge/Stack-React%20%2B%20Vite-61DAFB?logo=react&logoColor=white)](https://vitejs.dev/)
[![AI: Cloudflare Workers AI](https://img.shields.io/badge/AI-Cloudflare%20Workers%20AI-F38020?logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/workers-ai/)
[![Runtime: Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

An autonomous, multi-agent AI marketing campaign assistant with competitor ad scraping — deployed on Cloudflare's global edge network.

> **🌐 Live:** [main.ads-dashboard-4ce.pages.dev](https://main.ads-dashboard-4ce.pages.dev)

---

## ✨ What It Does

Paste your product description and a competitor keyword. The system will:

1. **Scrape** competitor ads from Meta Ads Library
2. **Generate** 4 specialized AI agent reports in parallel:
   - ✍️ **Copywriter** — Ad copy variations using AIDA/PAS frameworks
   - 📊 **Analyst** — Budget scenarios with CPM, CPC, CTR estimates
   - 🎯 **Strategist** — Buyer personas and creative briefs
   - 🔍 **Auditor** — Competitor gap analysis and counter-offers
3. **Display** results in a clean, expandable dashboard

Total time: ~40 seconds per campaign.

---

## 🏗️ Architecture

```
Browser (Cloudflare Pages)
    │
    │ POST /api/run-campaign
    ▼
Cloudflare Workers (Hono)
    │
    ├── Apify API ──────────► Meta Ads Library scraping
    │
    ├── Cloudflare Workers AI (Llama 3.1 8B)
    │       ├── Copywriter agent
    │       ├── Analyst agent
    │       ├── Strategist agent
    │       └── Auditor agent
    │
    └── Cloudflare KV ──────► Campaign storage
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS v4 |
| Backend | Cloudflare Workers, Hono framework |
| AI | Cloudflare Workers AI (Llama 3.1 8B) |
| Storage | Cloudflare KV |
| Scraping | Apify (Meta Ads Library) |
| Hosting | Cloudflare Pages + Workers |

---

## 🚀 Quick Start

### Option A: Use the Live App

Open **[main.ads-dashboard-4ce.pages.dev](https://main.ads-dashboard-4ce.pages.dev)** — no setup needed.

### Option B: Run Locally

**Prerequisites:** Node.js v18+, Wrangler CLI

```bash
# Clone
git clone https://github.com/ridloabelian/ads-autonomous-cli.git
cd ads-autonomous-cli/ads-autonomous-cli

# Install dependencies
npm install

# Create local env file
echo "APIFY_API_KEY=mock" > .dev.vars

# Start local Worker (backend)
wrangler dev

# In another terminal — start frontend
npm run dev
```

Open `http://localhost:5173`

---

## 📡 API Reference

Base URL: `https://ads-autonomous-api.ridloabelian.workers.dev`

### Health Check
```
GET /api/health
```
```json
{ "status": "ok", "message": "Ads Autonomous API is running" }
```

### Run Campaign
```
POST /api/run-campaign
Content-Type: application/json

{
  "productDescription": "Your product or service description",
  "competitorKeyword": "competitor keyword for Meta Ads scraping"
}
```
```json
{
  "campaignId": "uuid",
  "status": "completed",
  "data": {
    "results": {
      "copywriter": "...",
      "analyst": "...",
      "strategist": "...",
      "auditor": "..."
    }
  }
}
```

### Get Campaign by ID
```
GET /api/campaign-data/:id
```

### List All Campaigns
```
GET /api/campaigns
```

---

## 📂 Project Structure

```
ads-autonomous-cli/
├── src/
│   ├── components/          # React UI components
│   │   ├── CampaignForm.tsx     # Input form
│   │   ├── CampaignCard.tsx     # Expandable result card
│   │   ├── EmptyState.tsx
│   │   ├── LoadingState.tsx
│   │   └── ErrorState.tsx
│   ├── pages/
│   │   └── Dashboard.tsx        # Main dashboard page
│   ├── hooks/
│   │   └── useCampaign.ts       # Campaign state management
│   ├── services/
│   │   └── api.ts               # API client
│   ├── types/
│   │   └── campaign.ts          # TypeScript interfaces
│   ├── utils/
│   │   └── markdown.ts          # Markdown parser
│   ├── worker/                  # Cloudflare Workers backend
│   │   ├── index.ts             # Worker entry point (Hono)
│   │   └── services/
│   │       ├── ai.ts            # Cloudflare Workers AI client
│   │       ├── scraper.ts       # Apify scraper client
│   │       └── campaign.ts      # Campaign orchestrator
│   └── styles/
│       └── globals.css          # Tailwind CSS v4
├── prompts/                 # AI agent system prompts
│   ├── copywriter.md
│   ├── analyst.md
│   ├── strategist.md
│   └── auditor.md
├── wrangler.toml            # Cloudflare Workers config
├── vite.config.ts           # Vite build config
└── package.json
```

---

## ⚙️ Deployment

### Deploy Backend (Cloudflare Workers)

```bash
# Set secrets
wrangler secret put APIFY_API_KEY

# Deploy
wrangler deploy
```

### Deploy Frontend (Cloudflare Pages)

```bash
# Build
npm run build

# Deploy
npx wrangler pages deploy public --project-name=ads-dashboard
```

---

## 💰 Cost

Running entirely on free tiers:

| Service | Usage | Cost |
|---------|-------|------|
| Cloudflare Pages | Unlimited bandwidth | Free |
| Cloudflare Workers | 100k req/day | Free |
| Cloudflare KV | 100k reads/day | Free |
| Cloudflare Workers AI | 10k neurons/day | Free |
| Apify | 5k results/month | Free |
| **Total** | | **$0/month** |

---

## 🗺️ Roadmap

- [x] CLI pipeline (Playwright + Gemini)
- [x] React web dashboard
- [x] Cloudflare Workers backend
- [x] Cloudflare Workers AI integration
- [x] Deploy to Cloudflare (Pages + Workers)
- [ ] Real-time progress tracking (WebSocket)
- [ ] Campaign history UI
- [ ] Authentication (Cloudflare Access)
- [ ] Custom domain
- [ ] Apify real scraping integration
- [ ] Export to PDF
- [ ] Public SaaS launch

---

## 📄 License

ISC License — see [package.json](ads-autonomous-cli/package.json) for details.
