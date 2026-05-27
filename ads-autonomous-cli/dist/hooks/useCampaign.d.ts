import type { CampaignData, CampaignFormData } from '../types/campaign';
interface ErrorDetails {
    message: string;
    details?: string;
}
export declare const useCampaign: () => {
    campaignData: CampaignData | null;
    isLoading: boolean;
    error: ErrorDetails | null;
    runCampaign: (formData: CampaignFormData) => Promise<boolean>;
    clearError: () => void;
};
export {};
//# sourceMappingURL=useCampaign.d.ts.map