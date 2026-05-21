# 🚀 Quick Start Guide

Get the Web Dashboard running in 3 minutes!

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Gemini CLI installed (for AI agents)

## Installation

```bash
# Navigate to project directory
cd ads-autonomous-cli

# Install dependencies
npm install
```

## Running the Application

### Terminal 1: Start Backend Server
```bash
npm run start
```

You should see:
```
✅ Server is running on http://localhost:3000
```

### Terminal 2: Start Frontend Dev Server
```bash
npm run dev
```

You should see:
```
VITE v8.0.10  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Using the Dashboard

1. **Open your browser** to `http://localhost:5173`

2. **Fill in the form**:
   - **Product Description**: 
     ```
     Kursus online n8n untuk automasi bisnis, dari nol sampai mahir 
     membangun agentic workflow yang bisa berpikir otomatis
     ```
   - **Competitor Keyword**: 
     ```
     kursus automasi
     ```

3. **Click "Generate Campaign"**

4. **Wait 2-3 minutes** for the AI agents to complete their work

5. **View Results** - Click on each card to expand and read the full report:
   - ✍️ **Copywriter** - Ad copy variations
   - 📊 **Analyst** - Budget scenarios and KPIs
   - 🎯 **Strategist** - Buyer personas and creative briefs
   - 🔍 **Auditor** - Competitor analysis

## Troubleshooting

### Port Already in Use
If port 3000 or 5173 is already in use:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Gemini CLI Not Found
Install Gemini CLI first. Check the main README for installation instructions.

### CORS Errors
Make sure both frontend and backend are running. The backend includes CORS headers.

### Campaign Not Starting
Check that `run-campaign-api.sh` has execute permissions:
```bash
chmod +x run-campaign-api.sh
```

## Next Steps

- Read [WEB_DASHBOARD.md](WEB_DASHBOARD.md) for detailed documentation
- Read [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details
- Customize the AI prompts in `prompts/` directory
- Modify the UI colors in `src/styles/globals.css`

## Production Build

```bash
# Build frontend
npm run build

# Serve production build
npm run serve
```

## Need Help?

- Check the logs in both terminal windows
- Review the [WEB_DASHBOARD.md](WEB_DASHBOARD.md) documentation
- Check the `output/` directory for generated files

---

**Happy Marketing! 🎉**
