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

export const Dashboard: React.FC = () => {
  const {
    campaignData,
    isLoading,
    error,
    runCampaign,
    clearError,
    progressSteps,
    currentProgress,
    estimatedTimeRemaining
  } = useCampaign();
  const [showHistory, setShowHistory] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonCampaigns, setComparisonCampaigns] = useState<[any, any] | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const hasCampaignData = campaignData && Object.keys(campaignData).length > 0;

  const handleRetry = () => {
    clearError();
  };

  const handleViewCampaign = async (campaignId: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 backdrop-blur-lg bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Ads Autonomous CLI</h1>
                <p className="text-sm text-gray-500">AI Marketing Campaign Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 font-medium">System Ready</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Campaign Form */}
        <div className="mb-12">
          <CampaignForm onSubmit={runCampaign} isLoading={isLoading} />
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setShowHistory(false)}
            className={`pb-3 px-4 font-medium transition-colors ${
              !showHistory
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              Campaign Terbaru
            </div>
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className={`pb-3 px-4 font-medium transition-colors ${
              showHistory
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <History size={18} />
              History
            </div>
          </button>
        </div>

        {/* Campaign Results / History */}
        {!showHistory ? (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Campaign Results</h2>
            {hasCampaignData && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                READY
              </span>
            )}
          </div>

          {error && (
            <ErrorState
              message={error.message}
              details={error.details}
              onRetry={handleRetry}
            />
          )}

          {!error && isLoading && progressSteps.length > 0 && (
            <ProgressState
              steps={progressSteps}
              currentStep={currentProgress}
              progress={currentProgress}
              estimatedTimeRemaining={estimatedTimeRemaining}
            />
          )}

          {!error && isLoading && progressSteps.length === 0 && !hasCampaignData && <LoadingState />}

          {!error && !isLoading && !hasCampaignData && <EmptyState />}

          {!error && hasCampaignData && (
            <div className="grid md:grid-cols-2 gap-6">
              {campaignData.copywriter && (
                <CampaignCard
                  title="✍️ Copywriter"
                  content={campaignData.copywriter}
                  icon={<PenTool size={24} />}
                  color="bg-gradient-to-br from-purple-500 to-pink-500"
                />
              )}

              {campaignData.analyst && (
                <CampaignCard
                  title="📊 Analyst"
                  content={campaignData.analyst}
                  icon={<BarChart3 size={24} />}
                  color="bg-gradient-to-br from-blue-500 to-cyan-500"
                />
              )}

              {campaignData.strategist && (
                <CampaignCard
                  title="🎯 Strategist"
                  content={campaignData.strategist}
                  icon={<Target size={24} />}
                  color="bg-gradient-to-br from-green-500 to-emerald-500"
                />
              )}

              {campaignData.auditor && (
                <CampaignCard
                  title="🔍 Auditor"
                  content={campaignData.auditor}
                  icon={<Search size={24} />}
                  color="bg-gradient-to-br from-orange-500 to-red-500"
                />
              )}
            </div>
          )}
        </div>
        ) : (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Campaign History</h2>
          </div>
          <CampaignHistory
            onViewCampaign={handleViewCampaign}
            onDeleteCampaign={handleDeleteCampaign}
            refreshTrigger={historyRefresh}
          />
        </div>
        )}
      </main>

      {/* Comparison Modal */}
      {showComparison && comparisonCampaigns && (
        <CampaignComparison
          campaign1={comparisonCampaigns[0]}
          campaign2={comparisonCampaigns[1]}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            Powered by <span className="font-bold text-gray-900">Playwright</span> + <span className="font-bold text-gray-900">Gemini AI</span>
          </p>
        </div>
      </footer>
    </div>
  );
};
