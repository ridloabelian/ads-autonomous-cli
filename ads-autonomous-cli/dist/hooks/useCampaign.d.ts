import type { CampaignData, CampaignFormData } from '../types/campaign';
export declare const useCampaign: () => {
    campaignData: CampaignData | null;
    isLoading: boolean;
    error: string | null;
    runCampaign: (formData: CampaignFormData) => Promise<boolean>;
};
//# sourceMappingURL=useCampaign.d.ts.map