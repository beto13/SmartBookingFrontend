export interface AvailableSlot {
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  available: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  slotDate: string;
  slotStartTime: string;
  slotEndTime: string;
  status: string;
  orderReference: string | null;
  notes: string | null;
  parentBookingId: string | null;
  cancelledAt: string | null;
  createdAt: string;
}
