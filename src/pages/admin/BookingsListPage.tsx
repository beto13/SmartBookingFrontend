import { useBookings } from '../../hooks/useBookings';
import { useCancelBooking } from '../../hooks/useCancelBooking';
import { useRequireAuth } from '../../hooks/useRequireAuth';

const STATUS_OPTIONS = ['Confirmed', 'Completed', 'Cancelled', 'Rescheduled'];

function formatTime(time: string): string {
  return time.slice(0, 5);
}

export function BookingsListPage() {
  useRequireAuth('Operator,Admin');

  const {
    bookings,
    isLoading,
    error,
    refetch,
    pageNumber,
    setPageNumber,
    totalPages,
    totalCount,
    status,
    from,
    to,
    updateFilters,
  } = useBookings({ pageSize: 20 });
  const { cancelBooking, isLoading: isCancelling, error: cancelError } = useCancelBooking();

  async function handleCancel(id: string) {
    const ok = await cancelBooking(id);
    if (ok) refetch();
  }

  return (
    <section>
      <h1>Reservas</h1>

      <div className="filters-row">
        <label className="field">
          Estado
          <select value={status} onChange={(event) => updateFilters({ status: event.target.value })}>
            <option value="">Todos</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Desde
          <input type="date" value={from} onChange={(event) => updateFilters({ from: event.target.value })} />
        </label>
        <label className="field">
          Hasta
          <input type="date" value={to} onChange={(event) => updateFilters({ to: event.target.value })} />
        </label>
      </div>

      {isLoading && <p>Cargando reservas...</p>}
      {error && <p className="error-message">{error}</p>}
      {cancelError && <p className="error-message">{cancelError}</p>}
      {!isLoading && !error && bookings.length === 0 && <p>No hay reservas para estos filtros.</p>}

      <ul className="booking-list">
        {bookings.map((booking) => (
          <li key={booking.id} className="booking-item">
            <div>
              <strong>{booking.bookingCode}</strong> — {booking.slotDate} {formatTime(booking.slotStartTime)}-
              {formatTime(booking.slotEndTime)} — {booking.status}
            </div>
            <div className="booking-meta">
              Cliente: {booking.customerName} ({booking.customerEmail})
            </div>

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

      {totalPages > 1 && (
        <div className="pagination">
          <button type="button" disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)}>
            Anterior
          </button>
          <span>
            Página {pageNumber} de {totalPages} ({totalCount} reservas)
          </span>
          <button type="button" disabled={pageNumber >= totalPages} onClick={() => setPageNumber(pageNumber + 1)}>
            Siguiente
          </button>
        </div>
      )}
    </section>
  );
}
