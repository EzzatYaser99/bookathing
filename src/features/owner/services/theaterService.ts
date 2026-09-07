import { apiRequest } from '../../../services/api';

export const theaterService = {
  async getMyTheaters() {
    try {
      return await apiRequest<any[]>('/theaters/mine');
    } catch {
      return [];
    }
  },

  async createTheater(payload: Record<string, unknown>) {
    return apiRequest<any>('/theaters', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
