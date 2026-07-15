import { Link, Outlet } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';

export function Layout() {
  const role = useUserRole();

  return (
    <div className="app-layout">
      <header className="app-header">
        <Link to="/" className="app-brand">
          SmartBooking
        </Link>
        <nav>
          {role === 'Customer' && (
            <>
              <Link to="/reservar">Reservar turno</Link>
              <Link to="/mis-reservas">Mis reservas</Link>
            </>
          )}
          {(role === 'Operator' || role === 'Admin') && (
            <>
              <Link to="/admin/bookings">Reservas</Link>
              <Link to="/admin/blocked-slots">Bloqueos</Link>
              {role === 'Admin' && <Link to="/admin/schedule">Agenda</Link>}
              {role === 'Admin' && <Link to="/admin/register">Usuarios</Link>}
            </>
          )}
          {role === null && <Link to="/admin/login">Operador / Admin</Link>}
        </nav>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
