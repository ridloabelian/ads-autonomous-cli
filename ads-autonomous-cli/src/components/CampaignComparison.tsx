import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import type { CampaignData } from '../types/campaign';

interface CampaignComparisonProps {
  campaign1: CampaignData | null;
  campaign2: CampaignData | null;
  onClose: () => void;
}

export const CampaignComparison: React.FC<CampaignComparisonProps> = ({
  campaign1,
  campaign2,
  onClose
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopied(section);
    setTimeout(() => setCopied(null), 2000);
  };

  const sections = ['copywriter', 'analyst', 'strategist', 'auditor'] as const;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Perbandingan Campaign</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {sections.map(section => (
            <div key={section} className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 capitalize">
                {section === 'copywriter' && '✍️ Copywriter'}
                {section === 'analyst' && '📊 Analyst'}
                {section === 'strategist' && '🎯 Strategist'}
                {section === 'auditor' && '🔍 Auditor'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Campaign 1 */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-blue-900">Campaign 1</p>
                    {campaign1?.[section] && (
                      <button
                        onClick={() => handleCopy(campaign1[section]!, section + '1')}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {copied === section + '1' ? (
                          <Check size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-blue-800 whitespace-pre-wrap">
                    {campaign1?.[section] || '—'}
                  </p>
                </div>

                {/* Campaign 2 */}
                <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-purple-900">Campaign 2</p>
                    {campaign2?.[section] && (
                      <button
                        onClick={() => handleCopy(campaign2[section]!, section + '2')}
                        className="text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        {copied === section + '2' ? (
                          <Check size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-purple-800 whitespace-pre-wrap">
                    {campaign2?.[section] || '—'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
