import { useState } from 'react';
import { bookingService, type RescheduleBookingInput } from '../services/bookingService';
import { ApiError } from '../services/httpClient';
import type { Booking } from '../types/booking';

export function useRescheduleBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function rescheduleBooking(id: string, input: RescheduleBookingInput): Promise<Booking | null> {
    setIsLoading(true);
    setError(null);
    try {
      return await bookingService.rescheduleBooking(id, input);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo reagendar la reserva.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { rescheduleBooking, isLoading, error };
}
