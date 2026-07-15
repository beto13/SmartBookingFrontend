import { useBookings } from '../../hooks/useBookings';
import { useCancelBooking } from '../../hooks/useCancelBooking';
import { useRequireAuth } from '../../hooks/useRequireAuth';

function formatTime(time: string): string {
  return time.slice(0, 5);
}

export function BookingsListPage() {
  useRequireAuth('Operator,Admin');

  const { bookings, isLoading, error, refetch } = useBookings();
  const { cancelBooking, isLoading: isCancelling, error: cancelError } = useCancelBooking();

  async function handleCancel(id: string) {
    const ok = await cancelBooking(id);
    if (ok) refetch();
  }

  if (isLoading) return <p>Cargando reservas...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <section>
      <h1>Reservas</h1>
      {cancelError && <p className="error-message">{cancelError}</p>}
      {bookings.length === 0 && <p>No hay reservas todavía.</p>}

      <ul className="booking-list">
        {bookings.map((booking) => (
          <li key={booking.id} className="booking-item">
            <div>
              <strong>{booking.bookingCode}</strong> — {booking.slotDate} {formatTime(booking.slotStartTime)}-
              {formatTime(booking.slotEndTime)} — {booking.status}
            </div>
            <div className="booking-meta">Cliente: {booking.customerId}</div>

            {booking.status === 'Confirmed' && (
              <div className="booking-actions">
                <button type="button" disabled={isCancelling} onClick={() => handleCancel(booking.id)}>
                  Cancelar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
