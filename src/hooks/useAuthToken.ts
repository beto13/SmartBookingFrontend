import { useEffect, useState } from 'react';
import { AUTH_CHANGE_EVENT, getAuthToken } from '../services/httpClient';

export function useAuthToken() {
  const [token, setToken] = useState(getAuthToken());

  useEffect(() => {
    function handleChange() {
      setToken(getAuthToken());
    }
    window.addEventListener(AUTH_CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleChange);
  }, []);

  return token;
}
