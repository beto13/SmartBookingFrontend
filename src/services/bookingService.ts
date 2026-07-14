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

export const bookingService = {
  getAvailableSlots: (date: string) => httpClient.get<AvailableSlot[]>(`/slots/available?date=${date}`),

  createBooking: (input: CreateBookingInput) => httpClient.post<Booking>('/bookings', input),

  getMyBookings: (pageNumber = 1, pageSize = 10) =>
    httpClient.get<PaginatedResult<Booking>>(`/bookings?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  cancelBooking: (id: string) => httpClient.post<object>(`/bookings/${id}/cancel`),

  rescheduleBooking: (id: string, input: RescheduleBookingInput) =>
    httpClient.post<Booking>(`/bookings/${id}/reschedule`, input),
};
