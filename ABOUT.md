# Ads Autonomous CLI

**Ads Autonomous CLI** adalah tools AI marketing otomatis yang berjalan di edge network Cloudflare — gratis, cepat, dan siap pakai.

🌐 **Live:** [main.ads-dashboard-4ce.pages.dev](https://main.ads-dashboard-4ce.pages.dev)

---

## Masalah yang Diselesaikan

Membuat strategi iklan yang efektif butuh waktu berjam-jam:
- Riset kompetitor manual di Meta Ads Library
- Menulis berbagai variasi copy iklan
- Menghitung simulasi budget dan KPI
- Menyusun buyer persona dan creative brief
- Menganalisis gap pasar

Tools ini mengotomasi semua proses di atas dalam ~40 detik.

---

## Cara Kerja

1. **Input** — Masukkan deskripsi produk dan kata kunci kompetitor
2. **Scraping** — Sistem mengambil data iklan kompetitor dari Meta Ads Library via Apify
3. **AI Pipeline** — 4 AI agent berjalan secara berurutan menggunakan Cloudflare Workers AI (Llama 3.1 8B):
   - ✍️ **Copywriter** — 3 variasi hook, 1 body copy, 2 variasi CTA menggunakan framework AIDA/PAS
   - 📊 **Analyst** — Simulasi budget Testing/Scaling/Aggressive dengan estimasi CPM, CPC, CTR
   - 🎯 **Strategist** — Profil buyer persona, panduan video editor, rekomendasi landing page
   - 🔍 **Auditor** — Analisis USP kompetitor, identifikasi gap pasar, rekomendasi counter-offer
4. **Output** — Hasil ditampilkan di dashboard web yang bisa di-expand per agent

---

## Stack Teknologi

- **Frontend:** React 19 + TypeScript + Vite 8 + Tailwind CSS v4
- **Backend:** Cloudflare Workers + Hono framework
- **AI:** Cloudflare Workers AI (Llama 3.1 8B) — gratis 10k neurons/hari
- **Storage:** Cloudflare KV
- **Scraping:** Apify Meta Ads Library scraper
- **Hosting:** Cloudflare Pages + Workers (edge network global)

---

## Biaya Operasional

Seluruhnya berjalan di free tier — **$0/bulan** untuk personal use.

---

## Status Pengembangan

Project ini aktif dikembangkan dari personal tool menuju public SaaS.
Lihat [ROADMAP.md](ROADMAP.md) untuk rencana pengembangan lengkap.
