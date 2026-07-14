import { Link, Outlet } from 'react-router-dom';
import { useAuthToken } from '../hooks/useAuthToken';

export function Layout() {
  const token = useAuthToken();

  return (
    <div className="app-layout">
      <header className="app-header">
        <Link to="/" className="app-brand">
          SmartBooking
        </Link>
        <nav>
          {token ? (
            <>
              <Link to="/reservar">Reservar turno</Link>
              <Link to="/mis-reservas">Mis reservas</Link>
            </>
          ) : (
            <Link to="/admin/login">Operador / Admin</Link>
          )}
        </nav>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
