import type { CampaignData, CampaignFormData, ApiResponse } from '../types/campaign';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export const api = {
  async checkHealth(): Promise<ApiResponse<{ status: string; message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to check health' };
    }
  },

  async getCampaignById(campaignId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/campaign-data/${campaignId}`);
      if (!response.ok) throw new Error('Campaign not found');
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch campaign' };
    }
  },

  async runCampaign(formData: CampaignFormData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/run-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productDescription: formData.productDescription,
          competitorKeyword: formData.competitorKeyword,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to run campaign');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to run campaign' };
    }
  },

  async listCampaigns(): Promise<ApiResponse<{ campaigns: any[] }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/campaigns`);
      if (!response.ok) throw new Error('Failed to list campaigns');
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to list campaigns' };
    }
  },

  async deleteCampaign(campaignId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/campaign-data/${campaignId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete campaign');
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to delete campaign' };
    }
  },

  async getCampaignProgress(campaignId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/campaign-progress/${campaignId}`);
      if (!response.ok) throw new Error('Failed to fetch campaign progress');
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch campaign progress' };
    }
  },
};
