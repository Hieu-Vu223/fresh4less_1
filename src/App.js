import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import HomePage from './components/common/HomePage';
import Login from './components/common/Login';
import Signup from './components/common/Signup';
import PasswordReset from './components/common/PasswordReset';
import UserLayout from './components/customer/UserLayout';
import MerchantLayout from './components/merchant/MerchantLayout';
import BrowseFoodOffers from './components/customer/BrowseFoodOffers';
import Cart from './components/customer/Cart';
import OrderHistory from './components/customer/OrderHistory';
import MerchantDashboard from './components/merchant/MerchantDashboard';
import ManageOffers from './components/merchant/ManageOffers';
import ManageOrders from './components/merchant/ManageOrders';
import ProtectedRoute from './components/common/ProtectedRoute'; // Role-based route protection
import AdminLayout from './components/admin/AdminLayout'; // Admin layout
import AdminDashboard from './components/admin/AdminDashboard'; // Admin dashboard
import UserTable from './components/admin/UserTable'; // Manage users
import MerchantVerificationForm from './components/admin/MerchantVerificationForm'; // Verify merchants
import ListingsTable from './components/admin/ListingsTable'; // Manage listings

function App() {
  useEffect(() => {
    // Service Worker registration logic here
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/password-reset" element={<PasswordReset />} />

            {/* Customer routes */}
            <Route element={<ProtectedRoute allowedRole="customer" />}>
              <Route element={<UserLayout />}>
                <Route path="/browse-food-offers" element={<BrowseFoodOffers />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order-history" element={<OrderHistory />} />
              </Route>
            </Route>

            {/* Merchant routes */}
            <Route element={<ProtectedRoute allowedRole="merchant" />}>
              <Route element={<MerchantLayout />}>
                <Route path="/merchant-dashboard" element={<MerchantDashboard />} />
                <Route path="/manage-offers" element={<ManageOffers />} />
                <Route path="/manage-orders" element={<ManageOrders />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute allowedRole="admin" />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserTable />} />
                <Route path="merchants" element={<MerchantVerificationForm />} />
                <Route path="listings" element={<ListingsTable />} />
              </Route>
            </Route>
          </Routes>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;
