# 📅 This Week Action Plan

## 🎯 Goal: Deploy to Cloudflare & Make it Work

**Timeline:** 5 hari kerja  
**Status:** 🟡 Ready to Start

---

## 📋 Daily Breakdown

### **DAY 1: Setup & Research** (3-4 jam)

#### Morning: Cloudflare Setup
```bash
# 1. Install Wrangler
npm install -g wrangler

# 2. Login
wrangler login

# 3. Create KV namespace
wrangler kv:namespace create "CAMPAIGNS"
```

#### Afternoon: Research & Decide

**Decision 1: Scraping Solution** ⭐ CRITICAL

| Option | Pros | Cons | Cost | Recommendation |
|--------|------|------|------|----------------|
| **Apify** | Meta Ads scraper ready, maintained | Learning curve | $49/month | ⭐⭐⭐⭐⭐ |
| Browserless.io | Simple API, good docs | Need custom scraper | $29/month | ⭐⭐⭐⭐ |
| Bright Data | Enterprise-grade | Expensive, complex | $500+/month | ⭐⭐ |

**My Recommendation: Apify**
- Has ready-made Meta Ads Library scraper
- Maintained by community
- Free tier: 5,000 results/month
- Paid: $49/month for 50k results

**Decision 2: AI Provider**

| Option | Pros | Cons | Cost | Recommendation |
|--------|------|------|------|----------------|
| **Gemini** | Cheap, fast | Sometimes inconsistent | $0.001/1k chars | ⭐⭐⭐⭐⭐ |
| OpenAI | Reliable, good quality | More expensive | $0.03/1k tokens | ⭐⭐⭐⭐ |
| Claude | Best quality | Most expensive | $0.08/1k tokens | ⭐⭐⭐ |

**My Recommendation: Start with Gemini, fallback to OpenAI**

#### Evening: Get API Keys
- [ ] Sign up for Apify: https://apify.com
- [ ] Get Gemini API key: https://makersuite.google.com/app/apikey
- [ ] (Optional) Get OpenAI API key as backup

**Deliverable:** All accounts & API keys ready

---

### **DAY 2: Backend Refactor** (6-8 jam)

#### Task 1: Create Worker Structure

```bash
cd ads-autonomous-cli
mkdir -p src/worker
```

Create `src/worker/index.ts`:

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  CAMPAIGNS: KVNamespace;
  GEMINI_API_KEY: string;
  APIFY_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors());

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', message: 'Worker is running' });
});

// Get campaign data
app.get('/api/campaign-data/:id', async (c) => {
  const id = c.req.param('id');
  const data = await c.env.CAMPAIGNS.get(id);
  
  if (!data) {
    return c.json({ error: 'Campaign not found' }, 404);
  }
  
  return c.json(JSON.parse(data));
});

// Run campaign
app.post('/api/run-campaign', async (c) => {
  const { productDescription, competitorKeyword } = await c.req.json();
  
  // Validate input
  if (!productDescription || !competitorKeyword) {
    return c.json({ error: 'Missing required fields' }, 400);
  }
  
  const campaignId = crypto.randomUUID();
  
  // Start async processing (we'll implement this)
  // For now, return immediately
  return c.json({ 
    campaignId, 
    status: 'processing',
    message: 'Campaign started'
  });
});

export default app;
```

#### Task 2: Implement Scraping Client

Create `src/worker/services/scraper.ts`:

```typescript
export async function scrapeMetaAds(keyword: string, apiKey: string) {
  // Using Apify's Meta Ads Library scraper
  const response = await fetch('https://api.apify.com/v2/acts/apify~meta-ads-library-scraper/run-sync-get-dataset-items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      searchTerm: keyword,
      country: 'ID',
      maxResults: 10
    })
  });
  
  if (!response.ok) {
    throw new Error('Scraping failed');
  }
  
  return await response.json();
}
```

#### Task 3: Implement AI Client

Create `src/worker/services/ai.ts`:

```typescript
export async function generateWithGemini(prompt: string, systemPrompt: string, apiKey: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ 
            text: `${systemPrompt}\n\n${prompt}` 
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      })
    }
  );
  
  if (!response.ok) {
    throw new Error('AI generation failed');
  }
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
```

#### Task 4: Implement Campaign Processor

Create `src/worker/services/campaign.ts`:

```typescript
import { scrapeMetaAds } from './scraper';
import { generateWithGemini } from './ai';

export async function processCampaign(
  productDescription: string,
  keyword: string,
  env: any
) {
  const campaignId = crypto.randomUUID();
  
  try {
    // 1. Scrape competitor ads
    const competitorData = await scrapeMetaAds(keyword, env.APIFY_API_KEY);
    
    // 2. Run AI agents sequentially
    const copywriter = await generateWithGemini(
      productDescription,
      await fetch('/prompts/copywriter.md').then(r => r.text()),
      env.GEMINI_API_KEY
    );
    
    const analyst = await generateWithGemini(
      productDescription,
      await fetch('/prompts/analyst.md').then(r => r.text()),
      env.GEMINI_API_KEY
    );
    
    const strategist = await generateWithGemini(
      productDescription,
      await fetch('/prompts/strategist.md').then(r => r.text()),
      env.GEMINI_API_KEY
    );
    
    const auditor = await generateWithGemini(
      `Product: ${productDescription}\nCompetitor Data: ${JSON.stringify(competitorData)}`,
      await fetch('/prompts/auditor.md').then(r => r.text()),
      env.GEMINI_API_KEY
    );
    
    // 3. Save to KV
    const result = {
      campaignId,
      timestamp: new Date().toISOString(),
      productDescription,
      keyword,
      results: {
        copywriter,
        analyst,
        strategist,
        auditor
      },
      competitorData
    };
    
    await env.CAMPAIGNS.put(campaignId, JSON.stringify(result));
    
    return result;
  } catch (error) {
    console.error('Campaign processing failed:', error);
    throw error;
  }
}
```

#### Task 5: Update wrangler.toml

```toml
name = "ads-autonomous-api"
main = "src/worker/index.ts"
compatibility_date = "2024-01-01"

[[kv_namespaces]]
binding = "CAMPAIGNS"
id = "your-kv-namespace-id"

[vars]
ENVIRONMENT = "production"
```

**Deliverable:** Worker code ready for deployment

---

### **DAY 3: Frontend Adjustments** (4-5 jam)

#### Task 1: Update API Service

Update `src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export const api = {
  async runCampaign(formData: CampaignFormData): Promise<ApiResponse<{ campaignId: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/run-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to run campaign');
      
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to run campaign' };
    }
  },

  async getCampaignData(campaignId: string): Promise<ApiResponse<CampaignData>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/campaign-data/${campaignId}`);
      if (!response.ok) throw new Error('Failed to fetch campaign data');
      
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch campaign data' };
    }
  },
};
```

#### Task 2: Update Hook for Polling

Update `src/hooks/useCampaign.ts`:

```typescript
const runCampaign = useCallback(async (formData: CampaignFormData) => {
  setIsLoading(true);
  setError(null);
  
  // Start campaign
  const response = await api.runCampaign(formData);
  
  if (response.error || !response.data) {
    setError(response.error || 'Failed to start campaign');
    setIsLoading(false);
    return false;
  }
  
  const { campaignId } = response.data;
  
  // Poll for results
  const pollInterval = setInterval(async () => {
    const dataResponse = await api.getCampaignData(campaignId);
    
    if (dataResponse.data && dataResponse.data.results) {
      setCampaignData(dataResponse.data.results);
      setIsLoading(false);
      clearInterval(pollInterval);
    }
  }, 3000);
  
  // Stop polling after 5 minutes
  setTimeout(() => {
    clearInterval(pollInterval);
    setIsLoading(false);
    setError('Campaign timeout - please try again');
  }, 300000);
  
  return true;
}, []);
```

#### Task 3: Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://your-worker.workers.dev
```

**Deliverable:** Frontend ready for production

---

### **DAY 4: Deploy & Test** (6-8 jam)

#### Morning: Deploy Backend

```bash
# Set secrets
wrangler secret put GEMINI_API_KEY
wrangler secret put APIFY_API_KEY

# Deploy worker
wrangler deploy

# Test
curl https://your-worker.workers.dev/api/health
```

#### Afternoon: Deploy Frontend

```bash
# Build with production env
npm run build

# Deploy to Pages
npx wrangler pages deploy public --project-name=ads-dashboard

# Or connect GitHub repo in Cloudflare Dashboard
```

#### Evening: End-to-End Testing

Test checklist:
- [ ] Frontend loads correctly
- [ ] Form submission works
- [ ] Campaign starts processing
- [ ] Scraping returns data
- [ ] AI agents generate content
- [ ] Results display in UI
- [ ] Error handling works
- [ ] Mobile responsive

**Deliverable:** Working app on Cloudflare

---

### **DAY 5: Bug Fixes & Documentation** (4-6 jam)

#### Morning: Fix Issues
- [ ] Fix any bugs found during testing
- [ ] Improve error messages
- [ ] Add loading states
- [ ] Optimize performance

#### Afternoon: Documentation
- [ ] Update README with Cloudflare deployment
- [ ] Document API endpoints
- [ ] Add troubleshooting guide
- [ ] Create video demo (optional)

#### Evening: Celebrate! 🎉
- [ ] Generate your first campaign on production
- [ ] Share screenshot on Twitter/LinkedIn
- [ ] Plan next week's improvements

**Deliverable:** Production-ready personal tool

---

## 📊 Success Criteria

By end of week, you should have:

✅ App deployed to Cloudflare  
✅ Can generate campaigns from web UI  
✅ Scraping works reliably  
✅ AI agents produce good output  
✅ Results display correctly  
✅ No critical bugs  
✅ Documentation updated  

---

## 🚨 Potential Blockers

### Blocker 1: Apify API Complexity
**Solution:** Use their ready-made scraper, don't build custom

### Blocker 2: Gemini API Rate Limits
**Solution:** Add delays between requests, implement retry logic

### Blocker 3: Cloudflare Workers Timeout
**Solution:** For now, accept 30s limit. Later, use Queues

### Blocker 4: CORS Issues
**Solution:** Properly configure CORS headers in Worker

---

## 💡 Pro Tips

1. **Test locally first**
   ```bash
   wrangler dev
   ```

2. **Use Wrangler tail for debugging**
   ```bash
   wrangler tail
   ```

3. **Start simple, iterate fast**
   - Don't over-engineer
   - Get it working first
   - Optimize later

4. **Keep API keys secure**
   - Never commit to git
   - Use `wrangler secret`
   - Rotate regularly

---

## 📞 Need Help?

- Cloudflare Discord: https://discord.gg/cloudflaredev
- Apify Support: support@apify.com
- Gemini API Docs: https://ai.google.dev/docs

---

**Ready to start?** Let me know and I'll help you with Day 1! 🚀
