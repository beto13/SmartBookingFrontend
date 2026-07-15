import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ApiError, setAuthToken } from '../../services/httpClient';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');

    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.login(email, password);
      setAuthToken(result.token);
      navigate('/admin/bookings', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
      <h1>Ingreso Operador / Admin</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          Email
          <input name="email" type="email" required />
        </label>
        <label className="field">
          Contraseña
          <input name="password" type="password" required />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </section>
  );
}
