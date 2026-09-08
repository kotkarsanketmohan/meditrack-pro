import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './views/HomePage';
import AuthPage from './views/AuthPage';
import ActivateAccount from './views/ActivateAccount';
import MainLayout from './components/layout/MainLayout';
import MainDashboard from './views/MainDashboard';
import LowStock from './views/LowStock';
import CheckoutPage from './views/CheckoutPage';
import AddMedicine from './views/AddMedicine';
import UpdateStock from './views/UpdateStock';
import PurchaseHistory from './views/PurchaseHistory';
import IncomeReports from './views/IncomeReports';
import Profile from './views/Profile';
import Help from './views/Help';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/activate" element={<ActivateAccount />} />
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<MainDashboard />} />
          <Route path="low-stock" element={<LowStock />} />
          <Route path="checkout" element={<CheckoutPage />} />

          <Route path="add-medicine" element={<AddMedicine />} />
          <Route path="update-stock" element={<UpdateStock />} />
          <Route path="history" element={<PurchaseHistory />} />
          <Route path="reports" element={<IncomeReports />} />
          <Route path="profile" element={<Profile />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
