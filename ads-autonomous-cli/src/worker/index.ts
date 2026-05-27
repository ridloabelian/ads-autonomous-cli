import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { scrapeMetaAds } from './services/scraper';
import { processCampaign } from './services/campaign';

declare global {
  interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options?: any): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: any): Promise<any>;
  }
  interface Ai {
    run(model: string, options?: Record<string, any>): Promise<any>;
  }
}

type Bindings = {
  CAMPAIGNS: KVNamespace;
  AI: Ai;
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
    if (!productDescription?.trim()) {
      return c.json({
        error: 'Product description is required'
      }, 400);
    }

    if (!competitorKeyword?.trim()) {
      return c.json({
        error: 'Competitor keyword is required'
      }, 400);
    }

    if (productDescription.length < 10) {
      return c.json({
        error: 'Product description must be at least 10 characters (currently: ' + productDescription.length + ')'
      }, 400);
    }

    if (competitorKeyword.length < 2) {
      return c.json({
        error: 'Competitor keyword must be at least 2 characters (currently: ' + competitorKeyword.length + ')'
      }, 400);
    }

    if (productDescription.length > 5000) {
      return c.json({
        error: 'Product description is too long (max: 5000 characters)'
      }, 400);
    }

    const campaignId = crypto.randomUUID();

    console.log(`[${campaignId.substring(0, 8)}] Starting campaign for keyword: ${competitorKeyword}`);

    // Process campaign
    try {
      const result = await processCampaign(
        campaignId,
        productDescription,
        competitorKeyword,
        c.env
      );

      return c.json({
        campaignId: result.campaignId,
        status: result.status,
        message: 'Campaign completed successfully',
        data: result,
        timestamp: result.timestamp,
        duration: result.duration
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Campaign processing failed';
      console.error(`[${campaignId.substring(0, 8)}] Campaign error:`, errorMsg);

      return c.json({
        campaignId,
        status: 'failed',
        error: errorMsg,
        timestamp: new Date().toISOString()
      }, 500);
    }
  } catch (error) {
    console.error('Request parsing error:', error);
    return c.json({
      error: 'Invalid request format. Expected JSON with productDescription and competitorKeyword.'
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

// Get campaign progress (placeholder for future WebSocket implementation)
app.get('/api/campaign-progress/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.env.CAMPAIGNS.get(id);

    if (!data) {
      return c.json({
        campaignId: id,
        status: 'not_found',
        message: 'Campaign not found or still processing'
      }, 404);
    }

    const campaign = JSON.parse(data);
    return c.json({
      campaignId: id,
      status: campaign.status,
      progress: campaign.status === 'completed' ? 100 : 0,
      duration: campaign.duration
    });
  } catch (error) {
    console.error('Error fetching campaign progress:', error);
    return c.json({ error: 'Failed to fetch campaign progress' }, 500);
  }
});

export default app;
