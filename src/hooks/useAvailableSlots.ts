import { useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { ApiError } from '../services/httpClient';
import type { AvailableSlot } from '../types/booking';

export function useAvailableSlots(date: string) {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await bookingService.getAvailableSlots(date);
        if (!cancelled) setSlots(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'No se pudieron cargar los horarios.');
          setSlots([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [date]);

  return { slots, isLoading, error };
}
