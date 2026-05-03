import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

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

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
