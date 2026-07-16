import { useState, type FormEvent } from 'react';
import { useRegisterSystemUser } from '../../hooks/useRegisterSystemUser';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useResetSystemUserPassword } from '../../hooks/useResetSystemUserPassword';
import { useSystemUsers } from '../../hooks/useSystemUsers';
import type { SystemUser } from '../../types/systemUser';

interface ResetPasswordRowProps {
  user: SystemUser;
  onDone: () => void;
}

function ResetPasswordRow({ user, onDone }: ResetPasswordRowProps) {
  const [showForm, setShowForm] = useState(false);
  const { resetPassword, isLoading, error } = useResetSystemUserPassword();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const ok = await resetPassword(user.id, String(form.get('newPassword') ?? ''));
    if (ok) {
      setShowForm(false);
      onDone();
    }
  }

  if (!showForm) {
    return (
      <button type="button" onClick={() => setShowForm(true)}>
        Restablecer contraseña
      </button>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="field">
        Nueva contraseña
        <input name="newPassword" type="password" minLength={8} required autoFocus />
      </label>
      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Guardando...' : 'Confirmar'}
      </button>
      <button type="button" className="link-button" onClick={() => setShowForm(false)}>
        Cancelar
      </button>
    </form>
  );
}

export function UsersPage() {
  useRequireAuth('Admin');

  const { users, isLoading, error, refetch } = useSystemUsers();
  const { register, isLoading: isCreating, error: createError } = useRegisterSystemUser();
  const [createSuccess, setCreateSuccess] = useState(false);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const ok = await register(
      String(form.get('name') ?? ''),
      String(form.get('email') ?? ''),
      String(form.get('password') ?? ''),
      Number(form.get('role')),
    );

    if (ok) {
      setCreateSuccess(true);
      event.currentTarget.reset();
      refetch();
    }
  }

  return (
    <section>
      <h1>Usuarios (Operador/Admin)</h1>

      {isLoading && <p>Cargando usuarios...</p>}
      {error && <p className="error-message">{error}</p>}

      <ul className="booking-list">
        {users.map((user) => (
          <li key={user.id} className="booking-item">
            <div>
              <strong>{user.name}</strong> — {user.email} — {user.role}
            </div>
            <div className="booking-actions">
              <ResetPasswordRow user={user} onDone={refetch} />
            </div>
          </li>
        ))}
      </ul>

      <h2>Crear nuevo usuario</h2>
      <form className="form" onSubmit={handleCreate}>
        <label className="field">
          Nombre
          <input name="name" type="text" required />
        </label>
        <label className="field">
          Email
          <input name="email" type="email" required />
        </label>
        <label className="field">
          Contraseña
          <input name="password" type="password" minLength={8} required />
        </label>
        <label className="field">
          Rol
          <select name="role" defaultValue="0">
            <option value="0">Operador</option>
            <option value="1">Admin</option>
          </select>
        </label>
        {createSuccess && <p>Usuario creado correctamente.</p>}
        {createError && <p className="error-message">{createError}</p>}
        <button type="submit" disabled={isCreating}>
          {isCreating ? 'Creando...' : 'Crear usuario'}
        </button>
      </form>
    </section>
  );
}
