import { useState } from 'react';
import { blockedSlotService } from '../services/blockedSlotService';
import { ApiError } from '../services/httpClient';

export function useDeleteBlockedSlot() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteBlockedSlot(id: string): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    try {
      await blockedSlotService.deleteBlockedSlot(id);
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo eliminar el bloqueo.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { deleteBlockedSlot, isLoading, error };
}
