interface CampaignResult {
    campaignId: string;
    timestamp: string;
    productDescription: string;
    keyword: string;
    status: string;
    results: {
        copywriter: string;
        analyst: string;
        strategist: string;
        auditor: string;
    };
    competitorData: any[];
}
export declare function processCampaign(campaignId: string, productDescription: string, keyword: string, env: any): Promise<CampaignResult>;
export {};
//# sourceMappingURL=campaign.d.ts.map