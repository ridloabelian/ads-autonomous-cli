#!/bin/bash

# Script untuk menjalankan campaign dari API
# Environment variables yang dibutuhkan:
# - PRODUCT_DESCRIPTION
# - COMPETITOR_KEYWORD

# Pastikan folder output tersedia
mkdir -p output

echo "🤖 Starting AI Marketing Campaign..."
echo "================================================="
echo "📝 Product: $PRODUCT_DESCRIPTION"
echo "🎯 Keyword: $COMPETITOR_KEYWORD"
echo "================================================="

# 1. Menjalankan Scraper Playwright
echo "🕵️‍♂️ [1/5] Scraping Meta Ads Library..."
node scrape-ads.js "$COMPETITOR_KEYWORD"

# Membaca hasil scraping
SCRAPED_DATA=$(cat output/competitor_data.json)

echo "⏳ Rate limit prevention delay..."
sleep 5

# 2. Menjalankan Agen AI dengan Jeda
echo "✍️  [2/5] Running Copywriter AI..."
gemini --policy prompts/copywriter.md -p "$PRODUCT_DESCRIPTION" > output/copywriter.md
sleep 5

echo "📊 [3/5] Running Analyst AI..."
gemini --policy prompts/analyst.md -p "$PRODUCT_DESCRIPTION" > output/analyst.md
sleep 5

echo "🎯 [4/5] Running Strategist AI..."
gemini --policy prompts/strategist.md -p "$PRODUCT_DESCRIPTION" > output/strategist.md
sleep 5

echo "🔍 [5/5] Running Auditor AI..."
gemini --policy prompts/auditor.md -p "Produk saya: $PRODUCT_DESCRIPTION. Berikut data mentah iklan kompetitor saat ini: $SCRAPED_DATA" > output/auditor.md

echo "--------------------------------------------"
echo "✅ Campaign completed successfully!"
echo "📂 Results saved to output/ directory"
