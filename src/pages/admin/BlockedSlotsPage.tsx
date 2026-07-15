import type { FormEvent } from 'react';
import { useBlockedSlots } from '../../hooks/useBlockedSlots';
import { useCreateBlockedSlot } from '../../hooks/useCreateBlockedSlot';
import { useDeleteBlockedSlot } from '../../hooks/useDeleteBlockedSlot';
import { useRequireAuth } from '../../hooks/useRequireAuth';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

export function BlockedSlotsPage() {
  useRequireAuth('Operator,Admin');

  const { blockedSlots, isLoading, error, refetch } = useBlockedSlots();
  const { createBlockedSlot, isLoading: isCreating, error: createError } = useCreateBlockedSlot();
  const { deleteBlockedSlot, isLoading: isDeleting, error: deleteError } = useDeleteBlockedSlot();

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const reason = String(form.get('reason') ?? '');

    const result = await createBlockedSlot({
      date: String(form.get('date') ?? ''),
      startTime: `${String(form.get('startTime') ?? '')}:00`,
      endTime: `${String(form.get('endTime') ?? '')}:00`,
      reason: reason || undefined,
    });

    if (result) {
      event.currentTarget.reset();
      refetch();
    }
  }

  async function handleDelete(id: string) {
    const ok = await deleteBlockedSlot(id);
    if (ok) refetch();
  }

  return (
    <section>
      <h1>Bloqueo de franjas horarias</h1>

      <form className="form" onSubmit={handleCreate}>
        <label className="field">
          Fecha
          <input name="date" type="date" min={today()} defaultValue={today()} required />
        </label>
        <label className="field">
          Desde
          <input name="startTime" type="time" required />
        </label>
        <label className="field">
          Hasta
          <input name="endTime" type="time" required />
        </label>
        <label className="field">
          Motivo (opcional)
          <input name="reason" type="text" />
        </label>
        {createError && <p className="error-message">{createError}</p>}
        <button type="submit" disabled={isCreating}>
          {isCreating ? 'Creando...' : 'Bloquear franja'}
        </button>
      </form>

      {isLoading && <p>Cargando bloqueos...</p>}
      {error && <p className="error-message">{error}</p>}
      {deleteError && <p className="error-message">{deleteError}</p>}
      {!isLoading && !error && blockedSlots.length === 0 && <p>No hay franjas bloqueadas.</p>}

      <ul className="booking-list">
        {blockedSlots.map((slot) => (
          <li key={slot.id} className="booking-item">
            <div>
              {slot.date} {formatTime(slot.startTime)}-{formatTime(slot.endTime)}
              {slot.reason && ` — ${slot.reason}`}
            </div>
            <div className="booking-actions">
              <button type="button" disabled={isDeleting} onClick={() => handleDelete(slot.id)}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
