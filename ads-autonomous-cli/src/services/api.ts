import type { CampaignData, CampaignFormData, ApiResponse } from '../types/campaign';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

  async getCampaignData(): Promise<ApiResponse<CampaignData>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/campaign-data`);
      if (!response.ok) {
        throw new Error('Failed to fetch campaign data');
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch campaign data' };
    }
  },

  async runCampaign(formData: CampaignFormData): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/run-campaign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to run campaign');
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to run campaign' };
    }
  },
};
