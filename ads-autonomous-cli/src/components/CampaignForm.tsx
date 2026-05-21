import React, { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';
import type { CampaignFormData } from '../types/campaign';

interface CampaignFormProps {
  onSubmit: (data: CampaignFormData) => Promise<boolean>;
  isLoading: boolean;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    productDescription: '',
    competitorKeyword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <Zap className="text-white" size={20} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Generate Campaign Baru</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="productDescription" className="block text-sm font-semibold text-gray-700 mb-2">
            📝 Deskripsi Produk/Jasa Anda
          </label>
          <textarea
            id="productDescription"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Contoh: Kursus online n8n untuk automasi bisnis, dari nol sampai mahir membangun agentic workflow..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="competitorKeyword" className="block text-sm font-semibold text-gray-700 mb-2">
            🎯 Kata Kunci Iklan Kompetitor
          </label>
          <input
            id="competitorKeyword"
            name="competitorKeyword"
            type="text"
            value={formData.competitorKeyword}
            onChange={handleChange}
            required
            placeholder="Contoh: kursus automasi, kursus n8n"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <p className="mt-2 text-xs text-gray-500">
            Kata kunci ini akan digunakan untuk scraping Meta Ads Library
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.productDescription || !formData.competitorKeyword}
          className="w-full bg-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Generating Campaign...</span>
            </>
          ) : (
            <>
              <Zap size={20} />
              <span>Generate Campaign</span>
            </>
          )}
        </button>

        {isLoading && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-800 font-medium mb-2">⏳ Proses sedang berjalan...</p>
            <ul className="text-xs text-blue-600 space-y-1 ml-4">
              <li>• Scraping Meta Ads Library</li>
              <li>• Menjalankan AI Copywriter</li>
              <li>• Menjalankan AI Analyst</li>
              <li>• Menjalankan AI Strategist</li>
              <li>• Menjalankan AI Auditor</li>
            </ul>
            <p className="text-xs text-blue-600 mt-3">Estimasi waktu: 2-3 menit</p>
          </div>
        )}
      </div>
    </form>
  );
};
