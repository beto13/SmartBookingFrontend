import { httpClient } from './httpClient';
import type { SystemUser } from '../types/systemUser';

export const systemUserService = {
  getSystemUsers: () => httpClient.get<SystemUser[]>('/system-users'),

  resetPassword: (id: string, newPassword: string) =>
    httpClient.post<object>(`/system-users/${id}/reset-password`, { newPassword }),
};
