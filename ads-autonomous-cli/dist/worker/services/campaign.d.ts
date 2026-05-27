export interface CampaignResult {
    campaignId: string;
    timestamp: string;
    productDescription: string;
    keyword: string;
    status: 'completed' | 'failed';
    results: {
        copywriter: string;
        analyst: string;
        strategist: string;
        auditor: string;
    };
    competitorData: any[];
    duration?: number;
    error?: string;
}
export declare function processCampaign(campaignId: string, productDescription: string, keyword: string, env: any): Promise<CampaignResult>;
//# sourceMappingURL=campaign.d.ts.map