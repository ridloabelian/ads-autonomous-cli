import { useState, useCallback } from 'react';
import { api } from '../services/api';
export const useCampaign = () => {
    const [campaignData, setCampaignData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchCampaignData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const response = await api.getCampaignData();
        if (response.error) {
            setError(response.error);
        }
        else if (response.data) {
            setCampaignData(response.data);
        }
        setIsLoading(false);
    }, []);
    const runCampaign = useCallback(async (formData) => {
        setIsLoading(true);
        setError(null);
        const response = await api.runCampaign(formData);
        if (response.error) {
            setError(response.error);
            setIsLoading(false);
            return false;
        }
        // Poll for results after campaign starts
        const pollInterval = setInterval(async () => {
            const dataResponse = await api.getCampaignData();
            if (dataResponse.data && Object.keys(dataResponse.data).length > 0) {
                setCampaignData(dataResponse.data);
                setIsLoading(false);
                clearInterval(pollInterval);
            }
        }, 3000);
        // Stop polling after 5 minutes
        setTimeout(() => {
            clearInterval(pollInterval);
            setIsLoading(false);
        }, 300000);
        return true;
    }, []);
    return {
        campaignData,
        isLoading,
        error,
        fetchCampaignData,
        runCampaign,
    };
};
//# sourceMappingURL=useCampaign.js.map