import { useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMagicLinkAuth } from '../../hooks/useMagicLinkAuth';

export function CustomerHomePage() {
  const { step, email, isLoading, error, requestCode, verifyCode, reset } = useMagicLinkAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 'authenticated') {
      navigate('/reservar', { replace: true });
    }
  }, [step, navigate]);

  function handleRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    requestCode(String(form.get('name') ?? ''), String(form.get('email') ?? ''));
  }

  function handleVerifySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    verifyCode(String(form.get('code') ?? ''));
  }

  if (step === 'authenticated') {
    return <p>Redirigiendo...</p>;
  }

  if (step === 'verify') {
    return (
      <section>
        <h1>Ingresá tu código</h1>
        <p>Te enviamos un código de acceso a {email}.</p>
        <form className="form" onSubmit={handleVerifySubmit}>
          <label className="field">
            Código
            <input name="code" type="text" required autoFocus />
          </label>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Verificando...' : 'Ingresar'}
          </button>
          <button type="button" className="link-button" onClick={reset}>
            Usar otro email
          </button>
        </form>
      </section>
    );
  }

  return (
    <section>
      <h1>Reservá tu turno de retiro</h1>
      <p>Ingresá tu email para recibir un código de acceso.</p>
      <form className="form" onSubmit={handleRequestSubmit}>
        <label className="field">
          Nombre
          <input name="name" type="text" required />
        </label>
        <label className="field">
          Email
          <input name="email" type="email" required />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar código'}
        </button>
      </form>
    </section>
  );
}
