import { apiRequest } from '../../../services/api';

export const offerService = {
  async getActiveOffers() {
    try {
      return await apiRequest<any[]>('/offers/active');
    } catch {
      return [];
    }
  },
};
