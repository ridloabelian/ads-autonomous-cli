#!/bin/bash

# Pastikan folder output tersedia
mkdir -p output

echo "🤖 Ads Autonomous Assistant: Mode FULL AUTOPILOT (Safe Mode)"
echo "================================================="
read -p "📝 Deskripsi Produk/Jasa Anda: " USER_INPUT
read -p "🎯 Kata Kunci Iklan Kompetitor (cth: kursus automasi): " KEYWORD
echo "================================================="

# 1. Menjalankan Scraper Playwright
node scrape-ads.js "$KEYWORD"

# Membaca hasil scraping ke dalam variabel
SCRAPED_DATA=$(cat output/competitor_data.json)

echo "⏳ Memberi waktu jeda untuk menghindari Rate Limit..."
sleep 5

# 2. Menjalankan Agen AI dengan Jeda (Rate Limit Prevention)
echo "✍️  [1/5] Copywriter sedang meracik kata..."
gemini --policy prompts/copywriter.md -p "$USER_INPUT" > output/copywriter.md
sleep 5

echo "📊 [2/5] Analyst sedang menghitung budget..."
gemini --policy prompts/analyst.md -p "$USER_INPUT" > output/analyst.md
sleep 5

echo "🎯 [3/5] Strategist menyusun target & brief..."
gemini --policy prompts/strategist.md -p "$USER_INPUT" > output/strategist.md
sleep 5

echo "🔍 [4/5] Auditor menganalisis data Meta Ads kompetitor..."
gemini --policy prompts/auditor.md -p "Produk saya: $USER_INPUT. Berikut data mentah iklan kompetitor saat ini: $SCRAPED_DATA" > output/auditor.md
sleep 5

# 3. Men-generate Dashboard HTML
echo "🌐 [5/5] Merakit Dashboard Laporan Akhir..."
gemini -p "Buatkan file HTML statis (gunakan Tailwind CSS via CDN). Gabungkan data berikut menjadi Dashboard Laporan AI Marketing yang profesional, modern, dan rapi. Bagi menjadi 4 grid/kartu (Copywriter, Analyst, Strategist, Auditor).
[COPYWRITER]
$(cat output/copywriter.md)
[ANALYST]
$(cat output/analyst.md)
[STRATEGIST]
$(cat output/strategist.md)
[AUDITOR]
$(cat output/auditor.md)
Wajib: Output HANYA kode HTML saja, tanpa tag markdown \`\`\`html, tanpa penjelasan apapun." > output/dashboard.html

echo "--------------------------------------------"
echo "✅ BOOM! SEMUA TUGAS SELESAI!"
echo "🚀 Buka file dashboard Anda dengan perintah:"
echo "open output/dashboard.html"
