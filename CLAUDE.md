# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ads Autonomous CLI** is a multi-agent AI marketing campaign assistant that generates marketing strategies by:
1. Scraping competitor ads from Meta Ads Library (via Apify)
2. Running 4 AI agents in parallel (Copywriter, Analyst, Strategist, Auditor)
3. Displaying results in a React dashboard

**Live:** https://main.ads-dashboard-4ce.pages.dev  
**API:** https://ads-autonomous-api.ridloabelian.workers.dev

**Current Status:** Phase 1 ✅ COMPLETE (MVP deployed to Cloudflare)  
**Next:** Phase 2 - Real-time progress tracking, campaign history, error handling

## Quick Commands

### Development

```bash
# Frontend dev server (React + Vite)
cd ads-autonomous-cli
npm install
npm run dev          # Runs on http://localhost:5173

# Backend dev server (Cloudflare Workers)
wrangler dev         # Runs on http://localhost:8787

# Build for production
npm run build        # Output: dist/

# Type checking
tsc --noEmit
```

### Deployment

```bash
# Deploy backend (Cloudflare Workers)
wrangler secret put APIFY_API_KEY    # Set Apify API key
wrangler secret put GEMINI_API_KEY   # (if using Gemini)
wrangler deploy

# Deploy frontend (Cloudflare Pages)
npm run build
npx wrangler pages deploy dist --project-name=ads-dashboard
```

### Local Testing

```bash
# Test Worker locally
curl http://localhost:8787/api/health

# Test full campaign
curl -X POST http://localhost:8787/api/run-campaign \
  -H "Content-Type: application/json" \
  -d '{"productDescription":"Your product","competitorKeyword":"keyword"}'
```

## Architecture

### System Flow

```
User Browser
    ↓
React Dashboard (Cloudflare Pages)
    ├─ CampaignForm.tsx    (input form)
    ├─ CampaignCard.tsx    (expandable results)
    └─ useCampaign.ts      (polling hook)
    ↓
POST /api/run-campaign
    ↓
Cloudflare Workers (Hono backend)
    ├─ Apify API ────→ Meta Ads scraping
    ├─ Cloudflare Workers AI (Llama 3.1 8B)
    │   ├─ Copywriter Agent (AIDA/PAS framework)
    │   ├─ Analyst Agent (budget scenarios)
    │   ├─ Strategist Agent (personas & briefs)
    │   └─ Auditor Agent (gap analysis)
    └─ Cloudflare KV ────→ Campaign storage
```

### Directory Structure

```
ads-autonomous-cli/
├── src/
│   ├── components/           # React UI components
│   │   ├── CampaignForm.tsx
│   │   ├── CampaignCard.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingState.tsx
│   │   └── ErrorState.tsx
│   ├── pages/
│   │   └── Dashboard.tsx      # Main page
│   ├── hooks/
│   │   └── useCampaign.ts     # Campaign state + polling
│   ├── services/
│   │   └── api.ts             # API client (fetch wrapper)
│   ├── types/
│   │   └── campaign.ts        # TypeScript interfaces
│   ├── utils/
│   │   └── markdown.ts        # Markdown parsing
│   ├── worker/                # Cloudflare Workers backend
│   │   ├── index.ts           # Hono app + routes
│   │   └── services/
│   │       ├── ai.ts          # AI generation (Workers AI)
│   │       ├── scraper.ts     # Apify integration
│   │       └── campaign.ts    # Campaign orchestration
│   ├── App.tsx
│   └── index.tsx
├── prompts/                   # System prompts for AI agents
│   ├── copywriter.md
│   ├── analyst.md
│   ├── strategist.md
│   └── auditor.md
├── wrangler.toml              # Cloudflare Workers config
├── vite.config.ts             # Vite bundler config
├── tailwind.config.js         # Tailwind CSS v4
├── package.json
└── tsconfig.json
```

## Key Technologies & Important Notes

### Frontend (React 19 + Vite + Tailwind CSS v4)

- **useCampaign.ts:** Manages campaign state with polling logic. Polls `/api/campaign-data/:id` every 3 seconds until results arrive.
- **CampaignForm.tsx:** Form submission triggers `POST /api/run-campaign` and sets polling in motion.
- **API service (api.ts):** Uses `VITE_API_URL` env var. In dev: `http://localhost:8787`, in prod: Cloudflare Workers URL.

### Backend (Cloudflare Workers + Hono)

- **worker/index.ts:** Defines routes (`/api/health`, `/api/run-campaign`, `/api/campaign-data/:id`). Entry point is `main` in wrangler.toml.
- **Environment:** Runs on Cloudflare's edge. No filesystem access — must use KV for storage. Max execution time: 30 seconds (CPU timeout).
- **AI Integration:** Uses `Cloudflare Workers AI` binding with Llama 3.1 8B model. Prompt templates loaded from `prompts/` directory.
- **Scraping:** Apify integration in `scraper.ts`. Uses their ready-made Meta Ads Library scraper (actor ID: `apify~meta-ads-library-scraper`).

### Important Constraints

1. **Workers CPU Timeout:** 30 seconds hard limit. Campaign processing (scraping + 4 AI agents) must complete within this window. Use Queues for longer tasks (Phase 2).
2. **KV Storage:** Only way to persist data. Each campaign stored as JSON: `CAMPAIGNS.put(campaignId, JSON.stringify(campaignData))`.
3. **CORS:** Worker includes CORS headers. Frontend can call from any origin.
4. **TypeScript Bindings:** `Bindings` type in worker/index.ts defines environment variables (CAMPAIGNS, APIFY_API_KEY, etc.).

## AI Agent System

Each agent reads its system prompt from `prompts/*.md` and receives:
- Product description
- (Optional) Competitor data from scraping

**Agents:**
- **Copywriter:** Generates ad hooks, body copy, CTAs using AIDA/PAS frameworks
- **Analyst:** Budget scenarios (Testing/Scaling/Aggressive) with CPM, CPC, CTR estimates
- **Strategist:** Buyer personas, video editor guide, landing page recommendations
- **Auditor:** USP analysis, market gap identification, counter-offer recommendations

Prompts can be updated without redeploying (they're bundled at build time). To change agent behavior, edit `prompts/*.md` files.

## Deployment Details

### Environment Variables (Secrets)

```
APIFY_API_KEY         # Apify account API key (required for scraping)
GEMINI_API_KEY        # (optional, currently using Workers AI instead)
```

Set via `wrangler secret put <NAME>` or `.wrangler.toml` `[vars]` section.

### Cloudflare Pages Deployment

- Frontend built to `dist/` via `npm run build`
- Built on every Git push to main (auto-connected to GitHub)
- Environment: `VITE_API_URL=https://ads-autonomous-api.ridloabelian.workers.dev`

### Cloudflare Workers Deployment

- Deployed via `wrangler deploy`
- KV namespace binding: `CAMPAIGNS` (created via `wrangler kv:namespace create "CAMPAIGNS"`)
- Worker runs at: `https://ads-autonomous-api.ridloabelian.workers.dev`

## Common Development Tasks

### Adding a New Route

1. Add route handler in `src/worker/index.ts`
2. Update type in `src/types/campaign.ts` if needed
3. Update `src/services/api.ts` client if frontend-facing
4. Test locally: `wrangler dev` + `curl` or browser

### Changing AI Behavior

Edit `prompts/*.md` files. Prompts are loaded at build time and injected into Worker code.

### Storing Campaign Data

Use `c.env.CAMPAIGNS.put(key, JSON.stringify(value))` in Worker routes. KV stores as strings, so JSON serialization required.

### Adding Frontend Components

New React components go in `src/components/`. Use TypeScript and match existing style (Tailwind CSS v4).

## Debugging

### Frontend Issues

- Dev server: `npm run dev` (http://localhost:5173)
- Check browser console for errors
- API URL is controlled by `VITE_API_URL` env var

### Worker Issues

- Dev server: `wrangler dev` (http://localhost:8787)
- Check console output
- Use `wrangler tail` in production to stream logs
- 30-second CPU timeout: if campaign times out, split into async tasks (Phase 2 goal)

### API Response Errors

Test health check first:
```bash
curl https://ads-autonomous-api.ridloabelian.workers.dev/api/health
```

Check Cloudflare Workers dashboard for runtime errors.

## Roadmap Context

- **Phase 1 (Complete):** MVP deployed to Cloudflare ✅
- **Phase 2:** WebSocket real-time progress, campaign history, better error handling
- **Phase 3:** Authentication (Cloudflare Access), database migration (D1)
- **Phase 4:** Premium features, monetization, team workspaces

See ROADMAP.md for detailed plan.
