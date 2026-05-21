import { useState, useCallback } from 'react';
import { api } from '../services/api';
export const useCampaign = () => {
    const [campaignData, setCampaignData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const runCampaign = useCallback(async (formData) => {
        setIsLoading(true);
        setError(null);
        setCampaignData(null);
        const response = await api.runCampaign(formData);
        if (response.error || !response.data) {
            setError(response.error || 'Gagal menjalankan campaign');
            setIsLoading(false);
            return false;
        }
        // Worker returns data directly (synchronous processing)
        if (response.data.status === 'completed' && response.data.data?.results) {
            setCampaignData(response.data.data.results);
            setIsLoading(false);
            return true;
        }
        // Fallback: poll by campaignId if async
        if (response.data.campaignId) {
            const campaignId = response.data.campaignId;
            let attempts = 0;
            const maxAttempts = 60; // 3 minutes max
            const pollInterval = setInterval(async () => {
                attempts++;
                const dataResponse = await api.getCampaignById(campaignId);
                if (dataResponse.data?.results) {
                    setCampaignData(dataResponse.data.results);
                    setIsLoading(false);
                    clearInterval(pollInterval);
                }
                else if (attempts >= maxAttempts) {
                    setError('Campaign timeout — coba lagi');
                    setIsLoading(false);
                    clearInterval(pollInterval);
                }
            }, 3000);
        }
        else {
            setIsLoading(false);
        }
        return true;
    }, []);
    return {
        campaignData,
        isLoading,
        error,
        runCampaign,
    };
};
//# sourceMappingURL=useCampaign.js.map