import { useState, type FormEvent } from 'react';
import { useRegisterSystemUser } from '../../hooks/useRegisterSystemUser';
import { useRequireAuth } from '../../hooks/useRequireAuth';

export function RegisterSystemUserPage() {
  useRequireAuth('Admin');

  const { register, isLoading, error } = useRegisterSystemUser();
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const ok = await register(
      String(form.get('name') ?? ''),
      String(form.get('email') ?? ''),
      String(form.get('password') ?? ''),
      Number(form.get('role')),
    );

    if (ok) {
      setSuccess(true);
      event.currentTarget.reset();
    }
  }

  return (
    <section>
      <h1>Crear usuario Operador/Admin</h1>
      <form className="form" onSubmit={handleSubmit}>
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
        {success && <p>Usuario creado correctamente.</p>}
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear usuario'}
        </button>
      </form>
    </section>
  );
}
