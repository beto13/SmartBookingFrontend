import { useState } from 'react';
import { authService } from '../services/authService';
import { ApiError } from '../services/httpClient';

export function useRegisterSystemUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function register(name: string, email: string, password: string, role: number): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    try {
      // Ignoramos el token devuelto: es del usuario recien creado, no del Admin que esta registrando.
      await authService.register(name, email, password, role);
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear el usuario.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { register, isLoading, error };
}
