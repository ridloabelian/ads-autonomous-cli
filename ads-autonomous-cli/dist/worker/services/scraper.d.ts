/**
 * Meta Ads Library Scraper using Apify API
 *
 * Apify provides a ready-made Meta Ads Library scraper that handles
 * all the complexity of scraping Facebook's Ad Library.
 *
 * Free tier: 5,000 results/month
 * Paid: $49/month for 50,000 results
 */
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
export declare function scrapeMetaAds(keyword: string, apiKey: string, maxResults?: number): Promise<MetaAd[]>;
export {};
//# sourceMappingURL=scraper.d.ts.map