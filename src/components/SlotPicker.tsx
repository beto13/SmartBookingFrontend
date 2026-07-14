import { useAvailableSlots } from '../hooks/useAvailableSlots';
import type { AvailableSlot } from '../types/booking';

interface SlotPickerProps {
  date: string;
  onSelect: (slot: AvailableSlot) => void;
}

export function SlotPicker({ date, onSelect }: SlotPickerProps) {
  const { slots, isLoading, error } = useAvailableSlots(date);

  if (isLoading) return <p>Cargando horarios...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (slots.length === 0) return <p>No hay horarios para ese día.</p>;

  return (
    <ul className="slot-list">
      {slots.map((slot) => (
        <li key={slot.startTime}>
          <button type="button" disabled={slot.available === 0} onClick={() => onSelect(slot)}>
            {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)} ({slot.available} disponibles)
          </button>
        </li>
      ))}
    </ul>
  );
}
