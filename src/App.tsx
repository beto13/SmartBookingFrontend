import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { BlockedSlotsPage } from './pages/admin/BlockedSlotsPage';
import { BookingsListPage } from './pages/admin/BookingsListPage';
import { ScheduleConfigPage } from './pages/admin/ScheduleConfigPage';
import { BookSlotPage } from './pages/customer/BookSlotPage';
import { CustomerHomePage } from './pages/customer/CustomerHomePage';
import { MyBookingsPage } from './pages/customer/MyBookingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CustomerHomePage />} />
        <Route path="/reservar" element={<BookSlotPage />} />
        <Route path="/mis-reservas" element={<MyBookingsPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/bookings" element={<BookingsListPage />} />
        <Route path="/admin/schedule" element={<ScheduleConfigPage />} />
        <Route path="/admin/blocked-slots" element={<BlockedSlotsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
