import { useState } from 'react';
import { scheduleService } from '../services/scheduleService';
import { ApiError } from '../services/httpClient';
import type { CreateScheduleConfigInput, ScheduleConfig } from '../types/schedule';

export function useCreateScheduleConfig() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createConfig(input: CreateScheduleConfigInput): Promise<ScheduleConfig | null> {
    setIsLoading(true);
    setError(null);
    try {
      return await scheduleService.createConfig(input);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar la configuración.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { createConfig, isLoading, error };
}
