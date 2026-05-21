# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Web Dashboard Implementation (2026-05-21)

#### Frontend Components
- **CampaignForm.tsx** - Interactive form component for campaign input
- **CampaignCard.tsx** - Expandable card component for displaying AI agent reports
- **EmptyState.tsx** - Empty state UI component
- **LoadingState.tsx** - Loading indicator component
- **ErrorState.tsx** - Error display component with retry functionality
- **Dashboard.tsx** - Main dashboard page component

#### React Hooks
- **useCampaign.ts** - Custom hook for campaign data management and API integration

#### Services & API
- **api.ts** - API client service with methods for health check, fetching campaign data, and running campaigns
- **POST /api/run-campaign** - New endpoint to trigger campaign generation from web UI
- **Enhanced CORS** - Added CORS headers for cross-origin requests

#### Types & Utils
- **campaign.ts** - TypeScript interfaces for campaign data structures
- **markdown.ts** - Markdown parsing utilities using marked library

#### Scripts & Configuration
- **run-campaign-api.sh** - API-compatible version of campaign runner script
- **.env.example** - Environment variable template

#### Documentation
- **WEB_DASHBOARD.md** - Comprehensive web dashboard usage guide
- **IMPLEMENTATION_SUMMARY.md** - Technical implementation details and architecture
- **QUICKSTART.md** - Quick start guide for developers
- **CHANGELOG.md** - This file

### Changed
- **App.tsx** - Replaced landing page with Dashboard component
- **index.ts** - Enhanced Express server with new API endpoint and CORS support
- **index.html** - Updated title and meta description for dashboard
- **README.md** - Added web dashboard section with usage instructions

### Technical Details
- React 19 with TypeScript 6
- Vite 8 for build tooling
- Express 5 for backend API
- Tailwind CSS 4 for styling
- Marked for markdown parsing
- Lucide React for icons

### Architecture
- Frontend-backend separation with REST API
- File-based storage for campaign results
- Async campaign generation with polling
- Component-based UI architecture

## [1.0.0] - 2026-05-03

### Added
- Initial project setup
- Playwright-based Meta Ads Library scraper
- Multi-agent AI pipeline (Copywriter, Analyst, Strategist, Auditor)
- CLI-based campaign generation
- HTML dashboard generator
- Express API server
- React landing page template
- Comprehensive documentation

### Features
- Autonomous competitor ad scraping
- AI-powered marketing copy generation
- Budget scenario modeling
- Buyer persona creation
- Competitor analysis and gap identification
- Static HTML report generation

---

## Version History

- **Unreleased** - Web Dashboard Implementation
- **1.0.0** (2026-05-03) - Initial Release

---

## Migration Guide

### From CLI-only to Web Dashboard

If you were using the CLI version (`run-assistant.sh`), you can now:

1. **Continue using CLI** - Nothing changes, CLI still works
2. **Switch to Web UI** - Follow the [QUICKSTART.md](ads-autonomous-cli/QUICKSTART.md) guide
3. **Use Both** - CLI for automation, Web UI for interactive use

No breaking changes. All existing functionality is preserved.

---

## Roadmap

See [IMPLEMENTATION_SUMMARY.md](ads-autonomous-cli/IMPLEMENTATION_SUMMARY.md) for detailed future enhancements.

### Planned Features
- Authentication and user accounts
- Real-time progress tracking with WebSockets
- Campaign history and comparison
- Database integration
- PDF export
- A/B testing recommendations
- Meta Ads API integration
