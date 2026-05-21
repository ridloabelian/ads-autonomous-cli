import type { CampaignData, CampaignFormData, ApiResponse } from '../types/campaign';
export declare const api: {
    checkHealth(): Promise<ApiResponse<{
        status: string;
        message: string;
    }>>;
    getCampaignData(): Promise<ApiResponse<CampaignData>>;
    runCampaign(formData: CampaignFormData): Promise<ApiResponse<{
        message: string;
    }>>;
};
//# sourceMappingURL=api.d.ts.map