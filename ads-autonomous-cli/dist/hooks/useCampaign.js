import { useState, useCallback } from 'react';
import { api } from '../services/api';
export const useCampaign = () => {
    const [campaignData, setCampaignData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const formatErrorMessage = (errorMsg) => {
        if (errorMsg.includes('timeout')) {
            return {
                message: 'Campaign memakan waktu terlalu lama. Coba lagi dengan kata kunci yang lebih spesifik.',
                details: 'Timeout: Proses processing melebihi batas waktu'
            };
        }
        if (errorMsg.includes('rate')) {
            return {
                message: 'Server terlalu sibuk. Tunggu sebentar dan coba lagi.',
                details: 'Rate limit: AI service sedang digunakan banyak orang'
            };
        }
        if (errorMsg.includes('scraping') || errorMsg.includes('Scraping')) {
            return {
                message: 'Gagal scraping data kompetitor. Coba kata kunci berbeda.',
                details: 'Scraping error: Mungkin Meta Ads Library sedang bermasalah atau kata kunci tidak valid'
            };
        }
        if (errorMsg.includes('Product description') || errorMsg.includes('Competitor keyword')) {
            return {
                message: errorMsg,
                details: 'Validation error: Periksa kembali input Anda'
            };
        }
        if (errorMsg.includes('Invalid request')) {
            return {
                message: 'Format request tidak valid. Pastikan input sudah benar.',
                details: 'Request parsing error'
            };
        }
        return {
            message: errorMsg || 'Terjadi kesalahan saat menjalankan campaign. Coba lagi.',
            details: 'Unknown error'
        };
    };
    const runCampaign = useCallback(async (formData) => {
        setIsLoading(true);
        setError(null);
        setCampaignData(null);
        try {
            const response = await api.runCampaign(formData);
            if (response.error) {
                const errorDetails = formatErrorMessage(response.error);
                setError(errorDetails);
                setIsLoading(false);
                return false;
            }
            if (!response.data) {
                setError(formatErrorMessage('Tidak ada data dari server'));
                setIsLoading(false);
                return false;
            }
            // Worker returns data directly (synchronous processing)
            if (response.data.status === 'completed' && response.data.data?.results) {
                setCampaignData(response.data.data.results);
                setIsLoading(false);
                return true;
            }
            // Handle failed campaign status
            if (response.data.status === 'failed') {
                const errorMsg = response.data.error || 'Campaign gagal diproses';
                const errorDetails = formatErrorMessage(errorMsg);
                setError(errorDetails);
                setIsLoading(false);
                return false;
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
                    else if (dataResponse.data?.status === 'failed') {
                        const pollError = dataResponse.data.error || 'Campaign gagal';
                        const errorDetails = formatErrorMessage(pollError);
                        setError(errorDetails);
                        setIsLoading(false);
                        clearInterval(pollInterval);
                    }
                    else if (attempts >= maxAttempts) {
                        const errorDetails = formatErrorMessage('Campaign timeout setelah 3 menit');
                        setError(errorDetails);
                        setIsLoading(false);
                        clearInterval(pollInterval);
                    }
                }, 3000);
            }
            else {
                setIsLoading(false);
            }
            return true;
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan network';
            const errorDetails = formatErrorMessage(errorMsg);
            setError(errorDetails);
            setIsLoading(false);
            return false;
        }
    }, []);
    const clearError = useCallback(() => {
        setError(null);
    }, []);
    return {
        campaignData,
        isLoading,
        error,
        runCampaign,
        clearError,
    };
};
//# sourceMappingURL=useCampaign.js.map