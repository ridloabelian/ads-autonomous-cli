# Ads Autonomous CLI 🚀

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Framework: TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Runtime: Node.js](https://img.shields.io/badge/Node.js-v18+-339933.svg)](https://nodejs.org/)
[![Tool: Playwright](https://img.shields.io/badge/Playwright-Browser%20Scrape-2e8b57.svg)](https://playwright.dev/)

An autonomous, multi-agent AI marketing campaign assistant and competitor ad scraping command-line suite. 

This repository provides an automated pipeline that searches the **Meta Ads Library** using **Playwright**, processes competitor marketing approaches, and runs an intelligent multi-agent sequential pipeline (Copywriter, Analyst, Strategist, and Auditor) using state-of-the-art Generative AI models. The entire run compiles into a professional, ready-to-use HTML marketing dashboard.

---

## 🌟 Key Features

1. **🕵️‍♂️ Headless Competitor Ads Scraper**
   - Leverages Playwright to automate search queries on the Meta Ads Library.
   - Extracts active competitor marketing headlines, body text, and active assets.
   - Outputs robust structured JSON data for deep downstream auditing.

2. **🤖 Multi-Agent Sequential AI Pipeline**
   - ✍️ **Expert Direct-Response Copywriter**: Drafts conversion-focused ad copies utilizing PAS (Problem-Agitate-Solve) and AIDA frameworks.
   - 📊 **Performance Marketing Analyst**: Models structured budget tiers (Testing, Scaling, Aggressive) and simulates standard KPI metrics (CPM, CPC, CTR).
   - 🎯 **Marketing Strategist & Creative Briefer**: Profiles ideal buyer personas, details visual and video editor guidelines, and crafts landing page recommendations.
   - 🔍 **Competitor & Market Auditor**: Evaluates scraped competitor offerings to outline clear market gaps and recommend high-converting counter-offers.

3. **🌐 Interactive Campaign Reporting Dashboard**
   - Automatically assembles and merges AI agent analytical reports.
   - Spits out a fully responsive, modern single-page HTML report styled with Tailwind CSS via CDN.

4. **⚡ Modern Web Stack Integration**
   - Features a custom full-stack companion application powered by **Vite**, **React**, **TypeScript**, and **Express** inside the application subdirectory.
   - Express backend endpoints read real-time campaign folders to serve and display details dynamically.

---

## 📂 Project Structure

```bash
.
├── ABOUT.md                      # High-impact English product overview
├── README.md                     # Root comprehensive project manual
├── package.json                  # Root configurations & scripts
├── setup.sh                      # Automation script to bootstrap development environment
└── ads-autonomous-cli/           # Main Application Workspace
    ├── package.json              # App dependencies & run scripts
    ├── run-assistant.sh          # safe Autopilot multi-agent CLI runner
    ├── scrape-ads.js             # Playwright Meta Ads Library scraper
    ├── src/                      # Vite + React & Express source files
    │   ├── index.ts              # Express API Server
    │   ├── main.tsx              # React Entry Point
    │   └── App.tsx               # Beautiful React Landing page template
    ├── prompts/                  # AI System Roles and Prompts (Copywriter, Analyst, etc.)
    └── tailwind.config.js        # Tailwind CSS styling configuration
```

---

## 🚀 Quick Start

### 1. Bootstrap the Project
Run the bundled setup shell script to initialize directories, configure configurations (Tailwind & TypeScript), and pull down initial dependencies:
```bash
chmod +x setup.sh
./setup.sh
```

### 2. Configure the CLI Application
Navigate to the application subdirectory:
```bash
cd ads-autonomous-cli
npm install
```

### 3. Run the Autonomous Marketing Assistant
Start the safe autopilot CLI run:
```bash
chmod +x run-assistant.sh
./run-assistant.sh
```
Follow the terminal prompt inputs:
- 📝 **Product/Service Description**: Describe what your company or service offers.
- 🎯 **Competitor Keyword**: Define the target keywords to scrape from the Meta Ads Library (e.g., `online course`, `shoes`).

The script will safely scrape competitor ads, trigger the sequential Gemini AI pipeline, and output the compiled HTML report to:
`output/dashboard.html`

### 4. View Your Report
You can open the static compiled dashboard directly in your browser:
```bash
open output/dashboard.html
```

---

## 🛠️ Companion Web Application

This project includes a **full-featured React dashboard** and an **Express API server** to serve campaign results dynamically.

### Two Ways to Use

#### Option 1: CLI Mode (Original)
Run the autonomous marketing assistant via command line:
```bash
chmod +x run-assistant.sh
./run-assistant.sh
```
View results: `open output/dashboard.html`

#### Option 2: Web Dashboard (New! 🎉)
Use the modern web interface with real-time campaign generation:

**Start Backend Server:**
```bash
npm run start
```

**Start Frontend (in a new terminal):**
```bash
npm run dev
```

**Access Dashboard:**
Open `http://localhost:5173` in your browser.

### Web Dashboard Features
- 📝 **Interactive Form** - Input product details and competitor keywords via UI
- 🤖 **Real-time Generation** - Watch as AI agents process your campaign
- 📊 **Beautiful Results Display** - View all 4 agent reports in expandable cards
- 🎨 **Markdown Rendering** - Properly formatted reports with syntax highlighting
- 🔄 **Campaign History** - Access previously generated campaigns

For detailed web dashboard documentation, see [WEB_DASHBOARD.md](ads-autonomous-cli/WEB_DASHBOARD.md)

### API Endpoints

The Express backend exposes:
- `GET /api/health` - Simple status verification
- `GET /api/campaign-data` - Reads compiled marketing reports (`.md`) from the output folder and returns them as structured JSON
- `POST /api/run-campaign` - Triggers the AI campaign pipeline with provided product description and competitor keyword

---

## 📄 License

This project is licensed under the **ISC License**. See the `package.json` for details.
