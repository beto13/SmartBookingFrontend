import { useCallback, useEffect, useState } from 'react';
import { blockedSlotService } from '../services/blockedSlotService';
import { ApiError } from '../services/httpClient';
import type { BlockedSlot } from '../types/blockedSlot';

export function useBlockedSlots() {
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await blockedSlotService.getBlockedSlots();
      setBlockedSlots(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudieron cargar los bloqueos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { blockedSlots, isLoading, error, refetch };
}
