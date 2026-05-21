import React from 'react';
import type { CampaignFormData } from '../types/campaign';
interface CampaignFormProps {
    onSubmit: (data: CampaignFormData) => Promise<boolean>;
    isLoading: boolean;
}
export declare const CampaignForm: React.FC<CampaignFormProps>;
export {};
//# sourceMappingURL=CampaignForm.d.ts.map