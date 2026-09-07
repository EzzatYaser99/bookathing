import { apiRequest } from '../../../services/api';

export const bookingService = {
  async getMyBookings() {
    try {
      return await apiRequest<any[]>('/bookings');
    } catch {
      return [];
    }
  },

  async createBooking(payload: Record<string, unknown>) {
    return apiRequest<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async cancelBooking(bookingId: string) {
    return apiRequest<any>(`/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
    });
  },
};
