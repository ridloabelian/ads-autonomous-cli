import React, { useState, useEffect } from 'react';
import { Trash2, Eye, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../services/api';
import type { CampaignMetadata } from '../types/campaign';

interface CampaignHistoryProps {
  onViewCampaign: (id: string) => void;
  onDeleteCampaign: (id: string) => void;
  refreshTrigger?: number;
}

export const CampaignHistory: React.FC<CampaignHistoryProps> = ({
  onViewCampaign,
  onDeleteCampaign,
  refreshTrigger
}) => {
  const [campaigns, setCampaigns] = useState<CampaignMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadCampaigns = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.listCampaigns();
      if (response.data?.campaigns) {
        setCampaigns(response.data.campaigns);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus campaign ini?')) {
      try {
        await api.deleteCampaign(id);
        setCampaigns(campaigns.filter(c => c.id !== id));
        onDeleteCampaign(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete campaign');
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Belum ada campaign history</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {campaigns.map(campaign => (
        <div
          key={campaign.id}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{campaign.keyword}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    campaign.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {campaign.status === 'completed' ? '✓ Berhasil' : '✗ Gagal'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {campaign.productDescription}
                </p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>{new Date(campaign.timestamp).toLocaleDateString('id-ID')}</span>
                  {campaign.duration && <span>{Math.round(campaign.duration / 1000)}s</span>}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onViewCampaign(campaign.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Eye size={16} />
                Lihat Detail
              </button>
              <button
                onClick={() => setExpandedId(expandedId === campaign.id ? null : campaign.id)}
                className="flex items-center justify-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors"
              >
                {expandedId === campaign.id ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              <button
                onClick={() => handleDelete(campaign.id)}
                className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {expandedId === campaign.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900">ID Campaign</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 font-mono">
                        {campaign.id}
                      </code>
                      <button
                        onClick={() => handleCopy(campaign.id)}
                        className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded text-gray-700 transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  {campaign.error && (
                    <div>
                      <p className="font-semibold text-gray-900">Error</p>
                      <p className="text-red-600 mt-1 bg-red-50 p-2 rounded">
                        {campaign.error}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
