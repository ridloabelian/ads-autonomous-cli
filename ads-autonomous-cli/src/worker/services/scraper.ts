/**
 * Meta Ads Library Scraper using Apify API
 *
 * Apify provides a ready-made Meta Ads Library scraper that handles
 * all the complexity of scraping Facebook's Ad Library.
 *
 * Free tier: 5,000 results/month
 * Paid: $49/month for 50,000 results
 */

import { ContextLogger, createScrapingError, createScrapingTimeoutError } from './errors';

interface ApifyScraperInput {
  searchTerm: string;
  country: string;
  maxResults?: number;
  adType?: string;
}

interface MetaAd {
  adId: string;
  pageId: string;
  pageName: string;
  adText?: string;
  adCreative?: string;
  startDate: string;
  isActive: boolean;
  impressions?: string;
  spend?: string;
}

export async function scrapeMetaAds(
  keyword: string,
  apiKey: string,
  maxResults: number = 10,
  logger?: ContextLogger
): Promise<MetaAd[]> {
  const log = logger || new ContextLogger();
  log.step(1, 'Scraping Meta Ads', { keyword, maxResults });

  try {
    // Check if API key exists
    if (!apiKey || apiKey === 'mock') {
      log.warn('Apify API key not configured, using mock data');
      return getMockMetaAds(keyword);
    }

    const actorId = 'apify/meta-ads-library-scraper';

    const input: ApifyScraperInput = {
      searchTerm: keyword,
      country: 'ID',
      maxResults: Math.min(maxResults, 50),
      adType: 'all'
    };

    // Start the actor run with timeout
    const runResponse = await fetchWithTimeout(
      `https://api.apify.com/v2/acts/${actorId}/runs?token=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      },
      10000 // 10 second timeout
    );

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      if (runResponse.status === 401 || runResponse.status === 403) {
        log.error('Apify API authentication failed', undefined, { apiKey: '***' });
        return getMockMetaAds(keyword);
      }
      throw createScrapingError(`HTTP ${runResponse.status}: ${errorText}`);
    }

    const runData = await runResponse.json();
    const runId = runData.data?.id;

    if (!runId) {
      throw createScrapingError('No run ID returned from Apify');
    }

    log.info('Apify run started', { runId });

    // Poll for completion with timeout
    let status = 'RUNNING';
    let attempts = 0;
    const maxAttempts = 20; // 20 seconds max

    while (status === 'RUNNING' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        const statusResponse = await fetchWithTimeout(
          `https://api.apify.com/v2/acts/${actorId}/runs/${runId}?token=${apiKey}`,
          {},
          5000
        );

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          status = statusData.data?.status || 'UNKNOWN';
          log.info(`Scraper running (${attempts + 1}/${maxAttempts})`, { status });
        }
      } catch (pollError) {
        log.warn('Failed to poll scraper status, retrying...', {
          attempt: attempts + 1,
          error: pollError instanceof Error ? pollError.message : String(pollError)
        });
      }

      attempts++;
    }

    if (status !== 'SUCCEEDED') {
      if (attempts >= maxAttempts) {
        log.warn('Scraper polling timed out, using fallback data');
        throw createScrapingTimeoutError();
      }
      throw createScrapingError(`Scraper status: ${status}`);
    }

    // Fetch results
    const resultsResponse = await fetchWithTimeout(
      `https://api.apify.com/v2/acts/${actorId}/runs/${runId}/dataset/items?token=${apiKey}`,
      {},
      10000
    );

    if (!resultsResponse.ok) {
      throw createScrapingError(`Failed to fetch results: HTTP ${resultsResponse.status}`);
    }

    const results = await resultsResponse.json();
    const adCount = Array.isArray(results) ? results.length : 0;

    log.success(`Scraped ${adCount} competitor ads`);

    return Array.isArray(results) ? results : [];
  } catch (error) {
    log.error('Scraping error', error instanceof Error ? error : new Error(String(error)));

    // Fallback: return mock data
    log.warn('Using mock data as fallback');
    return getMockMetaAds(keyword);
  }
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url: string, init?: RequestInit, timeoutMs: number = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Mock data for testing without Apify API
 */
function getMockMetaAds(keyword: string): MetaAd[] {
  return [
    {
      adId: 'mock-1',
      pageId: '123456',
      pageName: 'Competitor A',
      adText: `Belajar ${keyword} dari nol sampai mahir! Dapatkan akses selamanya dengan harga spesial.`,
      adCreative: 'Image ad with call-to-action button',
      startDate: new Date().toISOString(),
      isActive: true,
      impressions: '10,000 - 50,000',
      spend: 'Rp 1,000,000 - Rp 5,000,000'
    },
    {
      adId: 'mock-2',
      pageId: '789012',
      pageName: 'Competitor B',
      adText: `${keyword} terbaik di Indonesia! Sudah dipercaya 10,000+ siswa. Daftar sekarang!`,
      adCreative: 'Video ad with testimonials',
      startDate: new Date().toISOString(),
      isActive: true,
      impressions: '50,000 - 100,000',
      spend: 'Rp 5,000,000 - Rp 10,000,000'
    },
    {
      adId: 'mock-3',
      pageId: '345678',
      pageName: 'Competitor C',
      adText: `Promo spesial ${keyword}! Diskon 50% untuk 100 pendaftar pertama. Buruan daftar!`,
      adCreative: 'Carousel ad with multiple images',
      startDate: new Date().toISOString(),
      isActive: true,
      impressions: '5,000 - 10,000',
      spend: 'Rp 500,000 - Rp 1,000,000'
    }
  ];
}
