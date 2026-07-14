import { useState, type FormEvent } from 'react';
import { useAvailableSlots } from '../../hooks/useAvailableSlots';
import { useCreateBooking } from '../../hooks/useCreateBooking';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import type { AvailableSlot, Booking } from '../../types/booking';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

interface ConfirmBookingFormProps {
  slot: AvailableSlot;
  isSubmitting: boolean;
  error: string | null;
  onConfirm: (orderReference: string, notes: string) => void;
  onCancel: () => void;
}

function ConfirmBookingForm({ slot, isSubmitting, error, onConfirm, onCancel }: ConfirmBookingFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onConfirm(String(form.get('orderReference') ?? ''), String(form.get('notes') ?? ''));
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p>
        Turno seleccionado: {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
      </p>
      <label className="field">
        Referencia de pedido (opcional)
        <input name="orderReference" type="text" />
      </label>
      <label className="field">
        Notas (opcional)
        <input name="notes" type="text" />
      </label>
      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Confirmando...' : 'Confirmar reserva'}
      </button>
      <button type="button" className="link-button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
}

export function BookSlotPage() {
  useRequireAuth();

  const [date, setDate] = useState(today());
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const { slots, isLoading, error } = useAvailableSlots(date);
  const { createBooking, isLoading: isSubmitting, error: submitError } = useCreateBooking();

  async function handleConfirm(orderReference: string, notes: string) {
    if (!selectedSlot) return;

    const booking = await createBooking({
      slotDate: date,
      slotStartTime: selectedSlot.startTime,
      slotEndTime: selectedSlot.endTime,
      orderReference: orderReference || undefined,
      notes: notes || undefined,
    });

    if (booking) {
      setConfirmedBooking(booking);
      setSelectedSlot(null);
    }
  }

  if (confirmedBooking) {
    return (
      <section>
        <h1>¡Reserva confirmada!</h1>
        <p>
          Código: <strong>{confirmedBooking.bookingCode}</strong>
        </p>
        <p>
          {confirmedBooking.slotDate} de {formatTime(confirmedBooking.slotStartTime)} a{' '}
          {formatTime(confirmedBooking.slotEndTime)}
        </p>
        <button type="button" onClick={() => setConfirmedBooking(null)}>
          Reservar otro turno
        </button>
      </section>
    );
  }

  return (
    <section>
      <h1>Elegí un horario</h1>
      <label className="field">
        Fecha
        <input type="date" value={date} min={today()} onChange={(event) => setDate(event.target.value)} />
      </label>

      {isLoading && <p>Cargando horarios...</p>}
      {error && <p className="error-message">{error}</p>}
      {!isLoading && !error && slots.length === 0 && <p>No hay horarios para ese día.</p>}

      <ul className="slot-list">
        {slots.map((slot) => (
          <li key={slot.startTime}>
            <button type="button" disabled={slot.available === 0} onClick={() => setSelectedSlot(slot)}>
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)} ({slot.available} disponibles)
            </button>
          </li>
        ))}
      </ul>

      {selectedSlot && (
        <ConfirmBookingForm
          slot={selectedSlot}
          isSubmitting={isSubmitting}
          error={submitError}
          onConfirm={handleConfirm}
          onCancel={() => setSelectedSlot(null)}
        />
      )}
    </section>
  );
}
