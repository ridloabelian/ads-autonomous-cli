export interface CampaignData {
    copywriter?: string;
    analyst?: string;
    strategist?: string;
    auditor?: string;
}
export interface CampaignFormData {
    productDescription: string;
    competitorKeyword: string;
}
export interface CampaignStatus {
    isRunning: boolean;
    currentStep?: string;
    progress?: number;
    error?: string;
}
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}
//# sourceMappingURL=campaign.d.ts.map