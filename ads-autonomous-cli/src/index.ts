import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Marketing Dashboard API is running' });
});

app.get('/api/campaign-data', async (req, res) => {
  try {
    const outputDir = path.join(__dirname, '../output');
    const files = await fs.readdir(outputDir);
    const data: Record<string, string> = {};

    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(outputDir, file), 'utf-8');
        const key = path.basename(file, '.md');
        data[key] = content;
      }
    }

    res.json(data);
  } catch (error) {
    console.error('Error reading campaign data:', error);
    res.status(500).json({ error: 'Failed to read campaign data' });
  }
});

app.post('/api/run-campaign', async (req, res) => {
  try {
    const { productDescription, competitorKeyword } = req.body;

    if (!productDescription || !competitorKeyword) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Run the campaign script in the background
    const scriptPath = path.join(__dirname, '../run-campaign-api.sh');
    
    // Check if script exists
    try {
      await fs.access(scriptPath);
    } catch {
      return res.status(500).json({ 
        error: 'Campaign script not found. Please ensure run-campaign-api.sh exists.' 
      });
    }

    // Start the campaign process
    const campaignProcess = spawn('bash', [scriptPath], {
      cwd: path.join(__dirname, '..'),
      env: {
        ...process.env,
        PRODUCT_DESCRIPTION: productDescription,
        COMPETITOR_KEYWORD: competitorKeyword,
      },
    });

    // Send immediate response
    res.json({ 
      message: 'Campaign started successfully',
      status: 'running' 
    });

    // Log output for debugging
    campaignProcess.stdout.on('data', (data) => {
      console.log(`Campaign: ${data}`);
    });

    campaignProcess.stderr.on('data', (data) => {
      console.error(`Campaign Error: ${data}`);
    });

    campaignProcess.on('close', (code) => {
      console.log(`Campaign process exited with code ${code}`);
    });

  } catch (error) {
    console.error('Error running campaign:', error);
    res.status(500).json({ error: 'Failed to run campaign' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
