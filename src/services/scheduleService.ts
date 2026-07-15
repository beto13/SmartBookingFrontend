import { httpClient } from './httpClient';
import type { CreateScheduleConfigInput, ScheduleConfig } from '../types/schedule';

export const scheduleService = {
  getActiveConfig: () => httpClient.get<ScheduleConfig>('/schedule-config/active'),
  createConfig: (input: CreateScheduleConfigInput) => httpClient.post<ScheduleConfig>('/schedule-config', input),
};
