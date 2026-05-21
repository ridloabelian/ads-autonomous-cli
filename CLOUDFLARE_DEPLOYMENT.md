# Cloudflare Deployment Guide 🚀

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE EDGE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐      ┌──────────────────────┐   │
│  │  Cloudflare Pages    │      │  Cloudflare Workers  │   │
│  │  (React Frontend)    │◄────►│  (API Backend)       │   │
│  │  ads-dashboard.pages │      │  /api/*              │   │
│  └──────────────────────┘      └──────────────────────┘   │
│                                          │                  │
│                                          ▼                  │
│                                 ┌──────────────────────┐   │
│                                 │  Cloudflare KV       │   │
│                                 │  (Campaign Storage)  │   │
│                                 └──────────────────────┘   │
│                                          │                  │
│                                          ▼                  │
│                                 ┌──────────────────────┐   │
│                                 │  Cloudflare Queues   │   │
│                                 │  (Campaign Jobs)     │   │
│                                 └──────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                          ┌──────────────────────┐
                          │  External Service    │
                          │  (Gemini API)        │
                          └──────────────────────┘
```

## Deployment Strategy

### Phase 1: Personal Use (Current)
- Frontend: Cloudflare Pages
- Backend: Cloudflare Workers
- Storage: Cloudflare KV (simple key-value)
- AI: Direct Gemini API calls
- Scraping: Browserless.io or Bright Data API

### Phase 2: Public Ready (Future)
- Add Authentication (Cloudflare Access or Auth0)
- Database: Cloudflare D1 (SQLite)
- Queue: Cloudflare Queues for async jobs
- Rate Limiting: Cloudflare Workers built-in
- Analytics: Cloudflare Analytics

---

## Prerequisites

1. **Cloudflare Account** (free tier is enough)
2. **Wrangler CLI** (Cloudflare's CLI tool)
3. **Domain** (optional, can use *.pages.dev subdomain)

---

## Step-by-Step Deployment

### 1. Install Wrangler CLI

```bash
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### 2. Setup Frontend (Cloudflare Pages)

```bash
cd ads-autonomous-cli

# Build frontend
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy public --project-name=ads-dashboard
```

**Alternative: Connect GitHub Repo**
1. Go to Cloudflare Dashboard → Pages
2. Connect GitHub repository
3. Set build settings:
   - Build command: `npm run build`
   - Build output: `public`
   - Root directory: `ads-autonomous-cli`

### 3. Setup Backend (Cloudflare Workers)

Create `wrangler.toml`:

```toml
name = "ads-autonomous-api"
main = "src/worker.ts"
compatibility_date = "2024-01-01"

[env.production]
name = "ads-autonomous-api"
route = "api.yourdomain.com/*"

[[kv_namespaces]]
binding = "CAMPAIGNS"
id = "your-kv-namespace-id"

[vars]
ENVIRONMENT = "production"
```

### 4. Create Cloudflare KV Namespace

```bash
# Create KV namespace for campaign storage
wrangler kv:namespace create "CAMPAIGNS"

# Note the ID and add to wrangler.toml
```

### 5. Deploy Worker

```bash
wrangler deploy
```

---

## Environment Variables

### Frontend (.env.production)
```env
VITE_API_URL=https://api.yourdomain.com
```

### Backend (Cloudflare Workers Secrets)
```bash
# Set secrets (not in wrangler.toml for security)
wrangler secret put GEMINI_API_KEY
wrangler secret put BROWSERLESS_API_KEY  # For scraping
```

---

## Limitations & Workarounds

### 1. **No File System Access**
**Problem:** Workers can't write to disk  
**Solution:** Use Cloudflare KV for storage

```typescript
// Instead of fs.writeFile
await env.CAMPAIGNS.put(campaignId, JSON.stringify(data));

// Instead of fs.readFile
const data = await env.CAMPAIGNS.get(campaignId);
```

### 2. **No Child Process (spawn)**
**Problem:** Can't run bash scripts or Playwright  
**Solution:** Use external APIs

```typescript
// Instead of spawn('bash', ['scrape-ads.js'])
// Use Browserless.io API or Bright Data
const response = await fetch('https://chrome.browserless.io/scrape', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${env.BROWSERLESS_API_KEY}` },
  body: JSON.stringify({
    url: metaAdsUrl,
    // scraping logic
  })
});
```

### 3. **No Gemini CLI**
**Problem:** Can't run `gemini` command  
**Solution:** Use Gemini REST API directly

```typescript
// Instead of: gemini --policy prompts/copywriter.md
const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${env.GEMINI_API_KEY}`
  },
  body: JSON.stringify({
    contents: [{
      parts: [{ text: prompt }]
    }]
  })
});
```

### 4. **Request Timeout (30s for free, 15min for paid)**
**Problem:** Campaign generation takes 2-3 minutes  
**Solution:** Use Cloudflare Queues for async processing

```typescript
// Endpoint returns immediately
app.post('/api/run-campaign', async (req, res) => {
  const jobId = crypto.randomUUID();
  
  // Queue the job
  await env.CAMPAIGN_QUEUE.send({
    jobId,
    productDescription: req.body.productDescription,
    keyword: req.body.keyword
  });
  
  res.json({ jobId, status: 'queued' });
});

// Separate queue consumer processes the job
export default {
  async queue(batch, env) {
    for (const message of batch.messages) {
      await processCampaign(message.body, env);
    }
  }
};
```

---

## Cost Estimation

### Free Tier (Personal Use)
- **Cloudflare Pages**: Unlimited bandwidth, 500 builds/month
- **Cloudflare Workers**: 100,000 requests/day
- **Cloudflare KV**: 100,000 reads/day, 1,000 writes/day
- **Total**: $0/month ✅

### Paid Tier (Public Use)
- **Workers Paid**: $5/month (10M requests)
- **KV**: $0.50/month per GB
- **D1 Database**: $5/month (5GB)
- **Queues**: $2/month (1M operations)
- **Total**: ~$12-15/month for moderate traffic

### External Services
- **Browserless.io**: $29/month (for scraping)
- **Gemini API**: Pay-as-you-go (cheap for moderate use)
- **Alternative**: Use Cloudflare Browser Rendering (beta)

---

## Testing Locally

```bash
# Test Workers locally
wrangler dev

# Test with KV
wrangler dev --local

# Test frontend with local worker
npm run dev
```

---

## Monitoring & Debugging

### Cloudflare Dashboard
- Real-time analytics
- Error logs
- Performance metrics

### Wrangler Tail (Live Logs)
```bash
wrangler tail
```

### Custom Logging
```typescript
console.log('Campaign started:', campaignId);
// Logs appear in Cloudflare Dashboard
```

---

## Security Best Practices

1. **Use Secrets for API Keys**
   ```bash
   wrangler secret put GEMINI_API_KEY
   ```

2. **Enable Rate Limiting**
   ```typescript
   // Built-in rate limiting
   if (await isRateLimited(request, env)) {
     return new Response('Too many requests', { status: 429 });
   }
   ```

3. **CORS Configuration**
   ```typescript
   const corsHeaders = {
     'Access-Control-Allow-Origin': 'https://yourdomain.pages.dev',
     'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
   };
   ```

4. **Input Validation**
   ```typescript
   import { z } from 'zod';
   
   const schema = z.object({
     productDescription: z.string().min(10).max(1000),
     keyword: z.string().min(2).max(100)
   });
   ```

---

## Rollback Strategy

```bash
# List deployments
wrangler deployments list

# Rollback to previous version
wrangler rollback [deployment-id]
```

---

## Custom Domain Setup

1. Add domain to Cloudflare
2. Go to Pages → Custom Domains
3. Add: `dashboard.yourdomain.com`
4. DNS automatically configured

---

## Next Steps After Deployment

1. **Test thoroughly** on production
2. **Monitor logs** for errors
3. **Set up alerts** for failures
4. **Optimize performance** (caching, etc.)
5. **Add authentication** when ready for public

---

## Troubleshooting

### Issue: "Module not found"
**Solution:** Check wrangler.toml `main` path

### Issue: "KV namespace not found"
**Solution:** Run `wrangler kv:namespace create` and update ID

### Issue: "Request timeout"
**Solution:** Use Cloudflare Queues for long-running tasks

### Issue: "CORS errors"
**Solution:** Add proper CORS headers in Worker response

---

## Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare KV Docs](https://developers.cloudflare.com/kv/)
- [Cloudflare Queues Docs](https://developers.cloudflare.com/queues/)

---

**Status:** Ready for implementation
**Estimated Setup Time:** 2-3 hours
**Estimated Refactor Time:** 1-2 days
