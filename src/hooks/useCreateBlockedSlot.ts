import { useState } from 'react';
import { blockedSlotService } from '../services/blockedSlotService';
import { ApiError } from '../services/httpClient';
import type { BlockedSlot, CreateBlockedSlotInput } from '../types/blockedSlot';

export function useCreateBlockedSlot() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createBlockedSlot(input: CreateBlockedSlotInput): Promise<BlockedSlot | null> {
    setIsLoading(true);
    setError(null);
    try {
      return await blockedSlotService.createBlockedSlot(input);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear el bloqueo.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { createBlockedSlot, isLoading, error };
}
