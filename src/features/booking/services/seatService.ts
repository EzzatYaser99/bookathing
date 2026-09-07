import { apiRequest } from '../../../services/api';

export const seatService = {
  async getSeatLayout(screenId: string, showtimeId: string) {
    try {
      return await apiRequest<any>(`/seats/screen/${screenId}/layout/${showtimeId}`);
    } catch {
      return {
        seats: [
          { id: 'A1', row: 'A', number: 1, status: 'available', type: 'standard' },
          { id: 'A2', row: 'A', number: 2, status: 'available', type: 'standard' },
          { id: 'A3', row: 'A', number: 3, status: 'available', type: 'vip' },
        ],
      };
    }
  },
};
