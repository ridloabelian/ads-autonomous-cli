import type { CampaignData, CampaignFormData } from '../types/campaign';
interface ErrorDetails {
    message: string;
    details?: string;
}
interface ProgressStep {
    step: number;
    totalSteps: number;
    title: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    error?: string;
}
export declare const useCampaign: () => {
    campaignData: CampaignData | null;
    isLoading: boolean;
    error: ErrorDetails | null;
    runCampaign: (formData: CampaignFormData) => Promise<boolean>;
    clearError: () => void;
    progressSteps: ProgressStep[];
    currentProgress: number;
    estimatedTimeRemaining: number | undefined;
};
export {};
//# sourceMappingURL=useCampaign.d.ts.map