import { useState, type FormEvent } from 'react';
import { useActiveScheduleConfig } from '../../hooks/useActiveScheduleConfig';
import { useCreateScheduleConfig } from '../../hooks/useCreateScheduleConfig';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import type { WorkingDayInput } from '../../types/schedule';

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 0];

interface DayFormState {
  dayOfWeek: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

function initialDays(): DayFormState[] {
  return DAY_OPTIONS.map((dayOfWeek) => ({
    dayOfWeek,
    enabled: dayOfWeek >= 1 && dayOfWeek <= 5,
    startTime: '09:00',
    endTime: '18:00',
  }));
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

export function ScheduleConfigPage() {
  useRequireAuth('Admin');

  const { config, isLoading, error, refetch } = useActiveScheduleConfig();
  const { createConfig, isLoading: isSubmitting, error: submitError } = useCreateScheduleConfig();

  const [days, setDays] = useState<DayFormState[]>(initialDays());
  const [showForm, setShowForm] = useState(false);

  function updateDay(dayOfWeek: number, changes: Partial<DayFormState>) {
    setDays((prev) => prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, ...changes } : d)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const workingDays: WorkingDayInput[] = days
      .filter((d) => d.enabled)
      .map((d) => ({
        dayOfWeek: d.dayOfWeek,
        startTime: `${d.startTime}:00`,
        endTime: `${d.endTime}:00`,
      }));

    const result = await createConfig({
      slotDurationMin: Number(form.get('slotDurationMin')),
      maxCapacityPerSlot: Number(form.get('maxCapacityPerSlot')),
      effectiveFrom: String(form.get('effectiveFrom')),
      workingDays,
    });

    if (result) {
      setShowForm(false);
      refetch();
    }
  }

  if (isLoading) return <p>Cargando configuración de agenda...</p>;

  return (
    <section>
      <h1>Configuración de agenda</h1>

      {error && <p className="error-message">{error}</p>}

      {config ? (
        <div className="booking-item">
          <p>
            Duración de slot: <strong>{config.slotDurationMin} min</strong> — Capacidad:{' '}
            <strong>{config.maxCapacityPerSlot}</strong> — Vigente desde{' '}
            <strong>{config.effectiveFrom}</strong>
          </p>
          <ul>
            {config.workingDays.map((wd) => (
              <li key={wd.id}>
                {DAY_NAMES[wd.dayOfWeek]}: {formatTime(wd.startTime)} - {formatTime(wd.endTime)}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No hay configuración de agenda activa.</p>
      )}

      {!showForm && (
        <button type="button" onClick={() => setShowForm(true)}>
          Crear nueva configuración
        </button>
      )}

      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            Duración del slot
            <select name="slotDurationMin" defaultValue="30">
              <option value="30">30 minutos</option>
              <option value="60">60 minutos</option>
            </select>
          </label>

          <label className="field">
            Capacidad máxima por slot
            <input name="maxCapacityPerSlot" type="number" min={1} max={10} defaultValue={3} required />
          </label>

          <label className="field">
            Vigente desde
            <input name="effectiveFrom" type="date" min={today()} defaultValue={today()} required />
          </label>

          <fieldset>
            <legend>Días laborales</legend>
            {days.map((day) => (
              <div key={day.dayOfWeek} className="working-day-row">
                <label>
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={(event) => updateDay(day.dayOfWeek, { enabled: event.target.checked })}
                  />
                  {DAY_NAMES[day.dayOfWeek]}
                </label>
                {day.enabled && (
                  <>
                    <input
                      type="time"
                      value={day.startTime}
                      onChange={(event) => updateDay(day.dayOfWeek, { startTime: event.target.value })}
                    />
                    <input
                      type="time"
                      value={day.endTime}
                      onChange={(event) => updateDay(day.dayOfWeek, { endTime: event.target.value })}
                    />
                  </>
                )}
              </div>
            ))}
          </fieldset>

          {submitError && <p className="error-message">{submitError}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar configuración'}
          </button>
          <button type="button" className="link-button" onClick={() => setShowForm(false)}>
            Cancelar
          </button>
        </form>
      )}
    </section>
  );
}
