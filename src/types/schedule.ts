export interface WorkingDay {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface ScheduleConfig {
  id: string;
  slotDurationMin: number;
  maxCapacityPerSlot: number;
  effectiveFrom: string;
  workingDays: WorkingDay[];
}

export interface WorkingDayInput {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface CreateScheduleConfigInput {
  slotDurationMin: number;
  maxCapacityPerSlot: number;
  effectiveFrom: string;
  workingDays: WorkingDayInput[];
}
