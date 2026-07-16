import { useCallback, useEffect, useState } from 'react';
import { systemUserService } from '../services/systemUserService';
import { ApiError } from '../services/httpClient';
import type { SystemUser } from '../types/systemUser';

export function useSystemUsers() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await systemUserService.getSystemUsers();
      setUsers(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudieron cargar los usuarios.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { users, isLoading, error, refetch };
}
