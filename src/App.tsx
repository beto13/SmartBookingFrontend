import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { BookSlotPage } from './pages/customer/BookSlotPage';
import { CustomerHomePage } from './pages/customer/CustomerHomePage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CustomerHomePage />} />
        <Route path="/reservar" element={<BookSlotPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
