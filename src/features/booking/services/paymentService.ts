import { apiRequest } from '../../../services/api';

export const paymentService = {
  async processPayment(payload: Record<string, unknown>) {
    return apiRequest<any>('/payments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getPaymentByBooking(bookingId: string) {
    return apiRequest<any>(`/payments/booking/${bookingId}`);
  },
};
