export interface BlockedSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string | null;
  createdByUserId: string;
}

export interface CreateBlockedSlotInput {
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}
