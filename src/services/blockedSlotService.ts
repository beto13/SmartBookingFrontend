import { httpClient } from './httpClient';
import type { BlockedSlot, CreateBlockedSlotInput } from '../types/blockedSlot';

export const blockedSlotService = {
  getBlockedSlots: () => httpClient.get<BlockedSlot[]>('/blocked-slots'),
  createBlockedSlot: (input: CreateBlockedSlotInput) => httpClient.post<BlockedSlot>('/blocked-slots', input),
  deleteBlockedSlot: (id: string) => httpClient.delete<object>(`/blocked-slots/${id}`),
};
