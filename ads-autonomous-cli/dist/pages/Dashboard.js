import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Sparkles, PenTool, BarChart3, Target, Search, History, GitCompare } from 'lucide-react';
import { CampaignForm } from '../components/CampaignForm';
import { CampaignCard } from '../components/CampaignCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { ProgressState } from '../components/ProgressState';
import { CampaignHistory } from '../components/CampaignHistory';
import { CampaignComparison } from '../components/CampaignComparison';
import { useCampaign } from '../hooks/useCampaign';
import { api } from '../services/api';
export const Dashboard = () => {
    const { campaignData, isLoading, error, runCampaign, clearError, progressSteps, currentProgress, estimatedTimeRemaining } = useCampaign();
    const [showHistory, setShowHistory] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const [comparisonCampaigns, setComparisonCampaigns] = useState(null);
    const [historyRefresh, setHistoryRefresh] = useState(0);
    const hasCampaignData = campaignData && Object.keys(campaignData).length > 0;
    const handleRetry = () => {
        clearError();
    };
    const handleViewCampaign = async (campaignId) => {
        const response = await api.getCampaignById(campaignId);
        if (response.data?.data?.results) {
            // If viewing a campaign, we could load it into the main view
            // For now, we'll just trigger a refresh of history
            setHistoryRefresh(prev => prev + 1);
        }
    };
    const handleDeleteCampaign = () => {
        setHistoryRefresh(prev => prev + 1);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-blue-50", children: [_jsx("header", { className: "bg-white border-b border-gray-100 sticky top-0 z-10 backdrop-blur-lg bg-white/80", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center", children: _jsx(Sparkles, { className: "text-white", size: 20 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-black text-gray-900", children: "Ads Autonomous CLI" }), _jsx("p", { className: "text-sm text-gray-500", children: "AI Marketing Campaign Assistant" })] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }), _jsx("span", { className: "text-gray-600 font-medium", children: "System Ready" })] })] }) }) }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [_jsx("div", { className: "mb-12", children: _jsx(CampaignForm, { onSubmit: runCampaign, isLoading: isLoading }) }), _jsxs("div", { className: "mb-8 flex gap-4 border-b border-gray-200", children: [_jsx("button", { onClick: () => setShowHistory(false), className: `pb-3 px-4 font-medium transition-colors ${!showHistory
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'}`, children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Sparkles, { size: 18 }), "Campaign Terbaru"] }) }), _jsx("button", { onClick: () => setShowHistory(true), className: `pb-3 px-4 font-medium transition-colors ${showHistory
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'}`, children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(History, { size: 18 }), "History"] }) })] }), !showHistory ? (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Campaign Results" }), hasCampaignData && (_jsx("span", { className: "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold", children: "READY" }))] }), error && (_jsx(ErrorState, { message: error.message, details: error.details, onRetry: handleRetry })), !error && isLoading && progressSteps.length > 0 && (_jsx(ProgressState, { steps: progressSteps, currentStep: currentProgress, progress: currentProgress, estimatedTimeRemaining: estimatedTimeRemaining })), !error && isLoading && progressSteps.length === 0 && !hasCampaignData && _jsx(LoadingState, {}), !error && !isLoading && !hasCampaignData && _jsx(EmptyState, {}), !error && hasCampaignData && (_jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [campaignData.copywriter && (_jsx(CampaignCard, { title: "\u270D\uFE0F Copywriter", content: campaignData.copywriter, icon: _jsx(PenTool, { size: 24 }), color: "bg-gradient-to-br from-purple-500 to-pink-500" })), campaignData.analyst && (_jsx(CampaignCard, { title: "\uD83D\uDCCA Analyst", content: campaignData.analyst, icon: _jsx(BarChart3, { size: 24 }), color: "bg-gradient-to-br from-blue-500 to-cyan-500" })), campaignData.strategist && (_jsx(CampaignCard, { title: "\uD83C\uDFAF Strategist", content: campaignData.strategist, icon: _jsx(Target, { size: 24 }), color: "bg-gradient-to-br from-green-500 to-emerald-500" })), campaignData.auditor && (_jsx(CampaignCard, { title: "\uD83D\uDD0D Auditor", content: campaignData.auditor, icon: _jsx(Search, { size: 24 }), color: "bg-gradient-to-br from-orange-500 to-red-500" }))] }))] })) : (_jsxs("div", { children: [_jsx("div", { className: "flex items-center gap-3 mb-6", children: _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Campaign History" }) }), _jsx(CampaignHistory, { onViewCampaign: handleViewCampaign, onDeleteCampaign: handleDeleteCampaign, refreshTrigger: historyRefresh })] }))] }), showComparison && comparisonCampaigns && (_jsx(CampaignComparison, { campaign1: comparisonCampaigns[0], campaign2: comparisonCampaigns[1], onClose: () => setShowComparison(false) })), _jsx("footer", { className: "border-t border-gray-100 mt-20 py-8", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: _jsxs("p", { className: "text-gray-500 text-sm", children: ["Powered by ", _jsx("span", { className: "font-bold text-gray-900", children: "Playwright" }), " + ", _jsx("span", { className: "font-bold text-gray-900", children: "Gemini AI" })] }) }) })] }));
};
//# sourceMappingURL=Dashboard.js.map