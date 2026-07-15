import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../services/httpClient';
import { getRoleFromToken } from '../utils/jwt';

export function useRequireAuth(allowedRoles?: string) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();
    const role = token ? getRoleFromToken(token) : null;
    const isAuthorized = Boolean(token) && (!allowedRoles || (role !== null && allowedRoles.split(',').includes(role)));

    if (!isAuthorized) {
      navigate('/', { replace: true });
    }
  }, [navigate, allowedRoles]);
}
