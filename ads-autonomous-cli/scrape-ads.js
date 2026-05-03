import { chromium } from 'playwright';
import fs from 'fs';

async function scrapeMetaAds(keyword) {
  console.log(`🕵️‍♂️ Memulai pencarian iklan untuk: "${keyword}"...`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // URL Meta Ads Library dengan filter Indonesia, All Ads, dan keyword
  const url = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ID&q=${encodeURIComponent(keyword)}`;

  try {
    console.log('Membuka Meta Ads Library...');
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Tunggu sedikit agar hasil pencarian termuat
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Mengambil data iklan...');
    // Mengekstrak teks dari beberapa kartu iklan pertama
    const adsData = await page.evaluate(() => {
      // Mengambil elemen div yang berisi teks iklan (class ini bisa berubah sewaktu-waktu di Meta)
      const adElements = Array.from(document.querySelectorAll('div[style*="white-space: pre-wrap;"]')).slice(0, 5);
      return adElements.map(el => el.innerText.trim()).filter(text => text.length > 0);
    });

    if (adsData.length > 0) {
      console.log(`✅ Berhasil menemukan ${adsData.length} sampel iklan kompetitor.`);
      fs.writeFileSync('output/competitor_data.json', JSON.stringify(adsData, null, 2));
    } else {
      console.log('⚠️ Tidak menemukan teks iklan. Mungkin struktur HTML Meta berubah atau tidak ada iklan.');
      fs.writeFileSync('output/competitor_data.json', JSON.stringify(["Tidak ada data ditemukan. Analisis secara umum saja."], null, 2));
    }

  } catch (error) {
    console.error('❌ Gagal melakukan scraping:', error.message);
    fs.writeFileSync('output/competitor_data.json', JSON.stringify(["Error saat scraping. Analisis secara umum saja."], null, 2));
  } finally {
    await browser.close();
    console.log('Browser ditutup.');
  }
}

// Mengambil argument dari terminal
const keyword = process.argv[2] || 'kursus n8n';
scrapeMetaAds(keyword);
