import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Customer Pages
import { Cart } from './pages/Cart';
import { MyOrders } from './pages/MyOrders';
import { Profile } from './pages/Profile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { FoodManagement } from './pages/admin/FoodManagement';
import { OrderManagement } from './pages/admin/OrderManagement';

// Scroll to top helper on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// 404 Fallback component
const NotFound = () => (
  <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
    <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '50px 30px' }}>
      <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>🍽️</span>
      <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Page Not Found (404)</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        The page you are looking for does not exist or may have been moved.
      </p>
      <a href="/" className="btn btn-primary">Return to FoodieExpress Home</a>
    </div>
  </div>
);

export function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Navbar />
          <CartDrawer />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Protected Routes */}
              <Route
                path="/cart"
                element={<Cart />}
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/food"
                element={
                  <AdminRoute>
                    <FoodManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderManagement />
                  </AdminRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
