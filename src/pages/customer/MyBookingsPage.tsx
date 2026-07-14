import { useState } from 'react';
import { SlotPicker } from '../../components/SlotPicker';
import { useCancelBooking } from '../../hooks/useCancelBooking';
import { useMyBookings } from '../../hooks/useMyBookings';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useRescheduleBooking } from '../../hooks/useRescheduleBooking';
import type { AvailableSlot, Booking } from '../../types/booking';

function formatTime(time: string): string {
  return time.slice(0, 5);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

interface RescheduleSectionProps {
  booking: Booking;
  onDone: () => void;
  onCancel: () => void;
}

function RescheduleSection({ booking, onDone, onCancel }: RescheduleSectionProps) {
  const [date, setDate] = useState(today());
  const { rescheduleBooking, isLoading, error } = useRescheduleBooking();

  async function handleSelect(slot: AvailableSlot) {
    const result = await rescheduleBooking(booking.id, {
      newSlotDate: date,
      newSlotStartTime: slot.startTime,
      newSlotEndTime: slot.endTime,
    });
    if (result) onDone();
  }

  return (
    <div className="reschedule-box">
      <label className="field">
        Nueva fecha
        <input type="date" value={date} min={today()} onChange={(event) => setDate(event.target.value)} />
      </label>
      {isLoading && <p>Reagendando...</p>}
      {error && <p className="error-message">{error}</p>}
      <SlotPicker date={date} onSelect={handleSelect} />
      <button type="button" className="link-button" onClick={onCancel}>
        Cancelar reagendo
      </button>
    </div>
  );
}

export function MyBookingsPage() {
  useRequireAuth();

  const { bookings, isLoading, error, refetch } = useMyBookings();
  const { cancelBooking, isLoading: isCancelling, error: cancelError } = useCancelBooking();
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);

  async function handleCancel(id: string) {
    const ok = await cancelBooking(id);
    if (ok) refetch();
  }

  if (isLoading) return <p>Cargando tus reservas...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <section>
      <h1>Mis reservas</h1>
      {cancelError && <p className="error-message">{cancelError}</p>}
      {bookings.length === 0 && <p>Todavía no tenés reservas.</p>}

      <ul className="booking-list">
        {bookings.map((booking) => (
          <li key={booking.id} className="booking-item">
            <div>
              <strong>{booking.bookingCode}</strong> — {booking.slotDate} {formatTime(booking.slotStartTime)}-
              {formatTime(booking.slotEndTime)} — {booking.status}
            </div>

            {booking.status === 'Confirmed' && (
              <div className="booking-actions">
                <button type="button" disabled={isCancelling} onClick={() => handleCancel(booking.id)}>
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => setReschedulingId(reschedulingId === booking.id ? null : booking.id)}
                >
                  Reagendar
                </button>
              </div>
            )}

            {reschedulingId === booking.id && (
              <RescheduleSection
                booking={booking}
                onDone={() => {
                  setReschedulingId(null);
                  refetch();
                }}
                onCancel={() => setReschedulingId(null)}
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
