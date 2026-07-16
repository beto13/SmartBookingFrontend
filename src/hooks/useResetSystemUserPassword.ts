import { useState } from 'react';
import { systemUserService } from '../services/systemUserService';
import { ApiError } from '../services/httpClient';

export function useResetSystemUserPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function resetPassword(id: string, newPassword: string): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    try {
      await systemUserService.resetPassword(id, newPassword);
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo restablecer la contraseña.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { resetPassword, isLoading, error };
}
