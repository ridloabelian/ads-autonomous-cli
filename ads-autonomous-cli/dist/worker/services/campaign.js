import { scrapeMetaAds } from './scraper';
import { generateWithRetry } from './ai';
import { ContextLogger, createKVError } from './errors';
import { ProgressTracker } from './progress';
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
    const logger = new ContextLogger(campaignId.substring(0, 8));
    const progress = new ProgressTracker(campaignId, logger);
    logger.info('Starting campaign processing', { keyword });
    const startTime = Date.now();
    try {
        // Step 1: Scrape competitor ads
        logger.step(1, 'Scraping competitor ads', { keyword });
        progress.startStep(1);
        const competitorData = await scrapeMetaAds(keyword, env.APIFY_API_KEY || 'mock', 10, logger);
        progress.completeStep(1);
        const step1Duration = ((Date.now() - startTime) / 1000).toFixed(2);
        logger.success(`Scraped ${competitorData.length} ads`, { duration: `${step1Duration}s` });
        // Step 2: Copywriter
        logger.step(2, 'Generating copy variations');
        progress.startStep(2);
        const copywriter = await generateWithRetry(productDescription, PROMPTS.copywriter, env, 3, logger);
        progress.completeStep(2);
        const step2Duration = ((Date.now() - startTime) / 1000).toFixed(2);
        logger.success('Copywriter complete', { duration: `${step2Duration}s` });
        // Step 3: Analyst
        logger.step(3, 'Generating budget analysis');
        progress.startStep(3);
        const analyst = await generateWithRetry(productDescription, PROMPTS.analyst, env, 3, logger);
        progress.completeStep(3);
        const step3Duration = ((Date.now() - startTime) / 1000).toFixed(2);
        logger.success('Analyst complete', { duration: `${step3Duration}s` });
        // Step 4: Strategist
        logger.step(4, 'Generating marketing strategy');
        progress.startStep(4);
        const strategist = await generateWithRetry(productDescription, PROMPTS.strategist, env, 3, logger);
        progress.completeStep(4);
        const step4Duration = ((Date.now() - startTime) / 1000).toFixed(2);
        logger.success('Strategist complete', { duration: `${step4Duration}s` });
        // Step 5: Auditor
        logger.step(5, 'Analyzing competitors');
        progress.startStep(5);
        const competitorSummary = competitorData
            .map(ad => `- ${ad.pageName}: "${ad.adText}"`)
            .join('\n');
        const auditorPrompt = `Produk saya: ${productDescription}\n\nData iklan kompetitor:\n${competitorSummary}\n\nAnalisis dan berikan rekomendasi strategis.`;
        const auditor = await generateWithRetry(auditorPrompt, PROMPTS.auditor, env, 3, logger);
        progress.completeStep(5);
        const step5Duration = ((Date.now() - startTime) / 1000).toFixed(2);
        logger.success('Auditor complete', { duration: `${step5Duration}s` });
        const totalDuration = (Date.now() - startTime) / 1000;
        const result = {
            campaignId,
            timestamp: new Date().toISOString(),
            productDescription,
            keyword,
            status: 'completed',
            results: { copywriter, analyst, strategist, auditor },
            competitorData,
            duration: totalDuration
        };
        // Save to KV
        try {
            await env.CAMPAIGNS.put(campaignId, JSON.stringify(result));
            logger.success('Campaign saved to database', { duration: `${totalDuration.toFixed(2)}s` });
        }
        catch (kvError) {
            logger.error('Failed to save campaign', kvError instanceof Error ? kvError : new Error(String(kvError)));
            throw createKVError('Failed to save campaign', kvError instanceof Error ? kvError : undefined);
        }
        return result;
    }
    catch (error) {
        const totalDuration = (Date.now() - startTime) / 1000;
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Campaign processing failed', error instanceof Error ? error : new Error(String(error)));
        // Save error state
        const failedResult = {
            campaignId,
            timestamp: new Date().toISOString(),
            productDescription,
            keyword,
            status: 'failed',
            results: {
                copywriter: '',
                analyst: '',
                strategist: '',
                auditor: ''
            },
            competitorData: [],
            duration: totalDuration,
            error: errorMessage
        };
        try {
            await env.CAMPAIGNS.put(campaignId, JSON.stringify(failedResult));
        }
        catch (kvError) {
            logger.error('Failed to save error state', kvError instanceof Error ? kvError : new Error(String(kvError)));
        }
        throw error;
    }
}
//# sourceMappingURL=campaign.js.map