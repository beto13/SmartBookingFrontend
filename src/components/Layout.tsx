import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <Link to="/" className="app-brand">
          SmartBooking
        </Link>
        <nav>
          <Link to="/admin/login">Operador / Admin</Link>
        </nav>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
