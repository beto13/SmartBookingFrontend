import { useState } from 'react';
import { bookingService, type CreateBookingInput } from '../services/bookingService';
import { ApiError } from '../services/httpClient';
import type { Booking } from '../types/booking';

export function useCreateBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createBooking(input: CreateBookingInput): Promise<Booking | null> {
    setIsLoading(true);
    setError(null);
    try {
      return await bookingService.createBooking(input);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear la reserva.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { createBooking, isLoading, error };
}
