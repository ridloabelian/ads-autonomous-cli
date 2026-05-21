import { scrapeMetaAds } from './scraper';
import { generateWithRetry } from './ai';
// Prompt templates
const PROMPTS = {
    copywriter: `# Role: Expert Direct-Response Copywriter
Bertugas membuat Ads Copy menggunakan framework AIDA/PAS.
- Fokus pada Hook yang menghentikan scroll.
- Gunakan bahasa Indonesia yang persuasif tapi tetap natural (tidak kaku).
- Output wajib menyertakan: 3 variasi Hook, 1 Body Copy utama, dan 2 variasi CTA.`,
    analyst: `# Role: Performance Marketing Analyst
Bertugas menghitung simulasi budget dan KPI iklan.
- Berikan estimasi CPM, CPC, dan CTR berdasarkan rata-rata industri produk digital di Indonesia.
- Buat skenario budget: Testing (Small), Scaling (Medium), dan Aggressive (High).
- Output wajib berbentuk tabel markdown yang rapi.`,
    strategist: `# Role: Marketing Strategist & Creative Briefer
Bertugas menyusun strategi targeting dan creative brief.
- Buat profil buyer persona yang detail (demografi, psikografi, pain points).
- Berikan panduan untuk video editor dan designer.
- Rekomendasikan angle landing page yang sesuai.`,
    auditor: `# Role: Competitor & Market Auditor
Bertugas menganalisis data kompetitor dan menemukan celah pasar.
- Evaluasi USP (Unique Selling Proposition) kompetitor.
- Identifikasi gap yang bisa dimanfaatkan.
- Berikan rekomendasi counter-offer yang kuat.`
};
export async function processCampaign(campaignId, productDescription, keyword, env) {
    console.log(`Processing campaign ${campaignId}`);
    const startTime = Date.now();
    // Step 1: Scrape competitor ads
    console.log('Step 1/5: Scraping Meta Ads...');
    const competitorData = await scrapeMetaAds(keyword, env.APIFY_API_KEY || 'mock', 10);
    console.log(`Scraped ${competitorData.length} competitor ads`);
    await delay(1000);
    // Step 2: Copywriter
    console.log('Step 2/5: Running Copywriter AI...');
    const copywriter = await generateWithRetry(productDescription, PROMPTS.copywriter, env);
    await delay(1000);
    // Step 3: Analyst
    console.log('Step 3/5: Running Analyst AI...');
    const analyst = await generateWithRetry(productDescription, PROMPTS.analyst, env);
    await delay(1000);
    // Step 4: Strategist
    console.log('Step 4/5: Running Strategist AI...');
    const strategist = await generateWithRetry(productDescription, PROMPTS.strategist, env);
    await delay(1000);
    // Step 5: Auditor (dengan data kompetitor)
    console.log('Step 5/5: Running Auditor AI...');
    const competitorSummary = competitorData
        .map(ad => `- ${ad.pageName}: "${ad.adText}"`)
        .join('\n');
    const auditorPrompt = `Produk saya: ${productDescription}\n\nData iklan kompetitor:\n${competitorSummary}\n\nAnalisis dan berikan rekomendasi strategis.`;
    const auditor = await generateWithRetry(auditorPrompt, PROMPTS.auditor, env);
    const result = {
        campaignId,
        timestamp: new Date().toISOString(),
        productDescription,
        keyword,
        status: 'completed',
        results: { copywriter, analyst, strategist, auditor },
        competitorData,
    };
    await env.CAMPAIGNS.put(campaignId, JSON.stringify(result));
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`Campaign ${campaignId} completed in ${duration}s`);
    return result;
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=campaign.js.map