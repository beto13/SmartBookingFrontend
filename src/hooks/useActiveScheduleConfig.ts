import { useCallback, useEffect, useState } from 'react';
import { scheduleService } from '../services/scheduleService';
import { ApiError } from '../services/httpClient';
import type { ScheduleConfig } from '../types/schedule';

export function useActiveScheduleConfig() {
  const [config, setConfig] = useState<ScheduleConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await scheduleService.getActiveConfig();
      setConfig(result);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setConfig(null);
      } else {
        setError(err instanceof ApiError ? err.message : 'No se pudo cargar la configuración de agenda.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { config, isLoading, error, refetch };
}
