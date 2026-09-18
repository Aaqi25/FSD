import { EnergySummaryData, EnergyRecommendation } from '../types';
import { mockEnergySummary } from '../data/energy';
import { mockRecommendations } from '../data/recommendations';
import { api } from './api';

export const energyService = {
  async getSummary(): Promise<EnergySummaryData> {
    const hasBackend = !!import.meta.env.VITE_API_URL;
    if (hasBackend) {
      try {
        const res = await api.get<EnergySummaryData>('/energy/summary');
        if (res.data) return res.data;
      } catch (err) {
        console.warn('Backend /energy/summary failed, using mock data:', err);
      }
    }
    // Simulate slight calculation latency
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockEnergySummary;
  },

  async getRecommendations(): Promise<EnergyRecommendation[]> {
    const hasBackend = !!import.meta.env.VITE_API_URL;
    if (hasBackend) {
      try {
        const res = await api.get<EnergyRecommendation[]>('/energy/recommendations');
        if (res.data) return res.data;
      } catch (err) {
        console.warn('Backend /energy/recommendations failed, using mock data:', err);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockRecommendations;
  },
};
