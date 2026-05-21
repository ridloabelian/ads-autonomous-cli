# 🔑 API Keys Setup Guide

## Required API Keys

You need 2 API keys to run this application:

### 1. Google Gemini API Key (Required)

**Cost:** Free tier available, then pay-as-you-go
- Free: 60 requests per minute
- Paid: $0.00025 per 1k characters input, $0.0005 per 1k characters output

**How to get:**
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

**Set in Cloudflare:**
```bash
wrangler secret put GEMINI_API_KEY
# Paste your key when prompted
```

---

### 2. Apify API Key (Optional but Recommended)

**Cost:** 
- Free tier: 5,000 results/month
- Paid: $49/month for 50,000 results

**How to get:**
1. Sign up at: https://apify.com
2. Go to Settings → Integrations
3. Copy your API token

**Set in Cloudflare:**
```bash
wrangler secret put APIFY_API_KEY
# Paste your key when prompted
```

**Note:** If you don't set this, the app will use mock data for competitor ads.

---

## Verify Setup

After setting both keys, verify they're set:

```bash
wrangler secret list
```

You should see:
```
GEMINI_API_KEY
APIFY_API_KEY
```

---

## Local Development

For local testing, create `.dev.vars` file:

```env
GEMINI_API_KEY=your_gemini_key_here
APIFY_API_KEY=your_apify_key_here
```

**⚠️ IMPORTANT:** Never commit `.dev.vars` to git!

---

## Cost Estimation

### Personal Use (10 campaigns/day)
- Gemini API: ~$5/month
- Apify (free tier): $0/month
- **Total: ~$5/month**

### Heavy Use (50 campaigns/day)
- Gemini API: ~$20/month
- Apify (paid): $49/month
- **Total: ~$69/month**

---

## Troubleshooting

### "API key not found" error
```bash
# Re-set the key
wrangler secret put GEMINI_API_KEY
```

### "Invalid API key" error
- Check if key is correct
- Check if API is enabled in Google Cloud Console
- For Gemini: Enable "Generative Language API"

### "Rate limit exceeded"
- Wait a few minutes
- Upgrade to paid tier
- Add delays between requests (already implemented)

---

## Security Best Practices

1. **Never commit API keys to git**
   - Add `.dev.vars` to `.gitignore`
   - Use `wrangler secret` for production

2. **Rotate keys regularly**
   - Change keys every 3-6 months
   - Immediately if compromised

3. **Monitor usage**
   - Check Google Cloud Console for Gemini usage
   - Check Apify dashboard for scraping usage

4. **Set up billing alerts**
   - Google Cloud: Set budget alerts
   - Apify: Monitor usage dashboard

---

## Next Steps

After setting up API keys:

1. Test locally:
   ```bash
   wrangler dev
   ```

2. Deploy to Cloudflare:
   ```bash
   wrangler deploy
   ```

3. Test the deployed API:
   ```bash
   curl https://your-worker.workers.dev/api/health
   ```

---

**Ready?** Run the commands above to set your API keys! 🚀
