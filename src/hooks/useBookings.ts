import { useCallback, useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { ApiError } from '../services/httpClient';
import type { Booking } from '../types/booking';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await bookingService.getBookings(1, 50);
      setBookings(result.items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudieron cargar las reservas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { bookings, isLoading, error, refetch };
}
