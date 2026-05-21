import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { parseMarkdown } from '../utils/markdown';

interface CampaignCardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  color: string;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ title, content, icon, color }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl">
      <div className={`${color} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
              {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          <div 
            className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-ul:text-gray-600"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
          />
        </div>
      )}
    </div>
  );
};
