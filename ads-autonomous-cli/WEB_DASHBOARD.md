# Web Dashboard Guide 🌐

This guide explains how to use the Web Dashboard interface for the Ads Autonomous CLI.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd ads-autonomous-cli
npm install
```

### 2. Start the Backend Server
```bash
npm run start
```
The Express API server will run on `http://localhost:3000`

### 3. Start the Frontend Development Server
Open a new terminal and run:
```bash
npm run dev
```
The Vite dev server will run on `http://localhost:5173` (or another port if 5173 is busy)

### 4. Open the Dashboard
Navigate to `http://localhost:5173` in your browser.

---

## 📋 Features

### 1. **Campaign Form**
- Input your product/service description
- Enter competitor keywords for Meta Ads Library scraping
- Click "Generate Campaign" to start the AI pipeline

### 2. **Real-time Campaign Results**
The dashboard displays results from 4 AI agents:
- **✍️ Copywriter**: Direct-response ad copies using AIDA/PAS frameworks
- **📊 Analyst**: Budget scenarios and KPI estimates (CPM, CPC, CTR)
- **🎯 Strategist**: Buyer personas and creative briefs
- **🔍 Auditor**: Competitor analysis and market gaps

### 3. **Expandable Cards**
Click on any card to expand and view the full AI-generated report.

### 4. **Markdown Rendering**
All AI outputs are rendered with proper markdown formatting for easy reading.

---

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `ads-autonomous-cli` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# Server Port
PORT=3000
```

---

## 🏗️ Architecture

```
Frontend (React + Vite)
    ↓ HTTP Request
Backend (Express API)
    ↓ Spawn Process
Bash Script (run-campaign-api.sh)
    ↓ Execute
1. Playwright Scraper → Meta Ads Library
2. Gemini AI Agents → Generate Reports
    ↓ Save to
output/*.md files
    ↓ Read by
Backend API → /api/campaign-data
    ↓ Display in
Frontend Dashboard
```

---

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── CampaignForm.tsx      # Form for campaign input
│   ├── CampaignCard.tsx      # Card for displaying results
│   ├── EmptyState.tsx        # Empty state UI
│   ├── LoadingState.tsx      # Loading indicator
│   └── ErrorState.tsx        # Error display
├── pages/              # Page components
│   └── Dashboard.tsx         # Main dashboard page
├── hooks/              # Custom React hooks
│   └── useCampaign.ts        # Campaign data management
├── services/           # API services
│   └── api.ts                # API client
├── types/              # TypeScript types
│   └── campaign.ts           # Campaign data types
├── utils/              # Utility functions
│   └── markdown.ts           # Markdown parser
├── styles/             # Global styles
│   └── globals.css           # Tailwind CSS config
├── App.tsx             # Main app component
├── main.tsx            # React entry point
└── index.ts            # Express server
```

---

## 🛠️ API Endpoints

### 1. Health Check
```
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "message": "AI Marketing Dashboard API is running"
}
```

### 2. Get Campaign Data
```
GET /api/campaign-data
```
**Response:**
```json
{
  "copywriter": "# Copywriter Report...",
  "analyst": "# Analyst Report...",
  "strategist": "# Strategist Report...",
  "auditor": "# Auditor Report..."
}
```

### 3. Run Campaign
```
POST /api/run-campaign
```
**Request Body:**
```json
{
  "productDescription": "Your product description",
  "competitorKeyword": "competitor keyword"
}
```
**Response:**
```json
{
  "message": "Campaign started successfully",
  "status": "running"
}
```

---

## 🐛 Troubleshooting

### Issue: "Campaign script not found"
**Solution:** Ensure `run-campaign-api.sh` exists and has execute permissions:
```bash
chmod +x run-campaign-api.sh
```

### Issue: "Gemini command not found"
**Solution:** Install the Gemini CLI tool. Refer to the main README for installation instructions.

### Issue: CORS errors
**Solution:** The backend already includes CORS headers. Ensure both frontend and backend are running.

### Issue: Port already in use
**Solution:** Change the port in `.env` file or kill the process using the port:
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 <PID>
```

---

## 🎨 Customization

### Changing Colors
Edit `src/styles/globals.css`:
```css
@theme {
  --color-brand-primary: #3b82f6;    /* Blue */
  --color-brand-secondary: #10b981;  /* Green */
  --color-brand-accent: #f59e0b;     /* Orange */
  --color-brand-dark: #1f2937;       /* Dark Gray */
}
```

### Adding New AI Agents
1. Create a new prompt file in `prompts/`
2. Update `run-campaign-api.sh` to include the new agent
3. Update `CampaignData` type in `src/types/campaign.ts`
4. Add a new `CampaignCard` in `src/pages/Dashboard.tsx`

---

## 📦 Production Build

### Build Frontend
```bash
npm run build
```
This creates optimized files in the `dist/` directory.

### Serve Production Build
```bash
npm run serve
```

### Deploy
The built files can be deployed to any static hosting service (Vercel, Netlify, etc.) while the Express backend can be deployed to services like Railway, Render, or Heroku.

---

## 🔐 Security Notes

- Never commit `.env` files to version control
- Use environment variables for sensitive data
- Implement authentication for production use
- Rate limit the `/api/run-campaign` endpoint
- Validate and sanitize all user inputs

---

## 📝 License

ISC License - See main README for details.
