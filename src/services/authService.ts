import { httpClient } from './httpClient';
import type { AuthResult } from '../types/auth';

export const authService = {
  requestMagicLink: (email: string, name: string) =>
    httpClient.post<{ message: string }>('/auth/magic-link/request', { email, name }),

  validateMagicLink: (token: string) =>
    httpClient.post<AuthResult>('/auth/magic-link/validate', { token }),
};
