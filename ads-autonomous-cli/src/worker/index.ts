import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { scrapeMetaAds } from './services/scraper';
import { processCampaign } from './services/campaign';

type Bindings = {
  CAMPAIGNS: KVNamespace;
  GEMINI_API_KEY: string;
  APIFY_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    message: 'Ads Autonomous API is running',
    timestamp: new Date().toISOString()
  });
});

// Get campaign data by ID
app.get('/api/campaign-data/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.env.CAMPAIGNS.get(id);
    
    if (!data) {
      return c.json({ error: 'Campaign not found' }, 404);
    }
    
    return c.json(JSON.parse(data));
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return c.json({ error: 'Failed to fetch campaign data' }, 500);
  }
});

// List all campaigns (for history)
app.get('/api/campaigns', async (c) => {
  try {
    const list = await c.env.CAMPAIGNS.list();
    const campaigns = [];
    
    for (const key of list.keys) {
      const data = await c.env.CAMPAIGNS.get(key.name);
      if (data) {
        const campaign = JSON.parse(data);
        campaigns.push({
          id: key.name,
          timestamp: campaign.timestamp,
          productDescription: campaign.productDescription?.substring(0, 100) + '...',
          keyword: campaign.keyword
        });
      }
    }
    
    return c.json({ campaigns });
  } catch (error) {
    console.error('Error listing campaigns:', error);
    return c.json({ error: 'Failed to list campaigns' }, 500);
  }
});

// Run new campaign
app.post('/api/run-campaign', async (c) => {
  try {
    const { productDescription, competitorKeyword } = await c.req.json();
    
    // Validate input
    if (!productDescription || !competitorKeyword) {
      return c.json({ 
        error: 'Missing required fields: productDescription and competitorKeyword' 
      }, 400);
    }
    
    if (productDescription.length < 10) {
      return c.json({ 
        error: 'Product description must be at least 10 characters' 
      }, 400);
    }
    
    if (competitorKeyword.length < 2) {
      return c.json({ 
        error: 'Competitor keyword must be at least 2 characters' 
      }, 400);
    }
    
    const campaignId = crypto.randomUUID();
    
    console.log(`Starting campaign ${campaignId} for keyword: ${competitorKeyword}`);
    
    // Process campaign (this will take time)
    // For now, we'll do it synchronously. Later we can use Queues for async
    try {
      const result = await processCampaign(
        campaignId,
        productDescription,
        competitorKeyword,
        c.env
      );
      
      return c.json({ 
        campaignId,
        status: 'completed',
        message: 'Campaign completed successfully',
        data: result
      });
    } catch (error) {
      console.error('Campaign processing error:', error);
      
      // Save error state
      await c.env.CAMPAIGNS.put(campaignId, JSON.stringify({
        campaignId,
        timestamp: new Date().toISOString(),
        productDescription,
        keyword: competitorKeyword,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
      
      return c.json({ 
        campaignId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Campaign processing failed'
      }, 500);
    }
  } catch (error) {
    console.error('Request error:', error);
    return c.json({ 
      error: 'Invalid request format' 
    }, 400);
  }
});

// Delete campaign
app.delete('/api/campaign-data/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.CAMPAIGNS.delete(id);
    return c.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return c.json({ error: 'Failed to delete campaign' }, 500);
  }
});

export default app;
