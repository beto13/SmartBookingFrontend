import { useAuthToken } from './useAuthToken';
import { getRoleFromToken } from '../utils/jwt';

export function useUserRole(): string | null {
  const token = useAuthToken();
  return token ? getRoleFromToken(token) : null;
}
