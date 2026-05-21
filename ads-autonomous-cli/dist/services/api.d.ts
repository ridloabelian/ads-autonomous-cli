import type { CampaignFormData, ApiResponse } from '../types/campaign';
export declare const api: {
    checkHealth(): Promise<ApiResponse<{
        status: string;
        message: string;
    }>>;
    getCampaignById(campaignId: string): Promise<ApiResponse<any>>;
    runCampaign(formData: CampaignFormData): Promise<ApiResponse<any>>;
};
//# sourceMappingURL=api.d.ts.map