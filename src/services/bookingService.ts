import { httpClient } from './httpClient';
import type { PaginatedResult } from '../types/api';
import type { AvailableSlot, Booking } from '../types/booking';

export interface CreateBookingInput {
  slotDate: string;
  slotStartTime: string;
  slotEndTime: string;
  orderReference?: string;
  notes?: string;
}

export interface RescheduleBookingInput {
  newSlotDate: string;
  newSlotStartTime: string;
  newSlotEndTime: string;
}

export interface GetBookingsFilters {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  from?: string;
  to?: string;
}

export const bookingService = {
  getAvailableSlots: (date: string) => httpClient.get<AvailableSlot[]>(`/slots/available?date=${date}`),

  createBooking: (input: CreateBookingInput) => httpClient.post<Booking>('/bookings', input),

  getBookings: (filters: GetBookingsFilters = {}) => {
    const params = new URLSearchParams();
    params.set('pageNumber', String(filters.pageNumber ?? 1));
    params.set('pageSize', String(filters.pageSize ?? 10));
    if (filters.status) params.set('status', filters.status);
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);

    return httpClient.get<PaginatedResult<Booking>>(`/bookings?${params.toString()}`);
  },

  cancelBooking: (id: string) => httpClient.post<object>(`/bookings/${id}/cancel`),

  rescheduleBooking: (id: string, input: RescheduleBookingInput) =>
    httpClient.post<Booking>(`/bookings/${id}/reschedule`, input),
};
