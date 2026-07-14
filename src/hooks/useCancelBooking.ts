import { useState } from 'react';
import { bookingService } from '../services/bookingService';
import { ApiError } from '../services/httpClient';

export function useCancelBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cancelBooking(id: string): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    try {
      await bookingService.cancelBooking(id);
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo cancelar la reserva.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { cancelBooking, isLoading, error };
}
