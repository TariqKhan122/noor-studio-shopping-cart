import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppProviders } from './context/AppProviders';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { OrdersPage } from './pages/OrdersPage';
import { ShopPage } from './pages/ShopPage';

export function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#141413]">
          <Navbar />
          <CartDrawer />

          <div className="flex-1">
            <Routes>
              <Route path="/" element={<ShopPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
