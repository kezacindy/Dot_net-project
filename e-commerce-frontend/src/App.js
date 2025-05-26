// src/App.js
import React from "react";
import { Route, Routes, Link } from "react-router-dom";

// Layout
import Header from "./components/layout/Header";

// Public Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; // <<<< IMPORT
import ResetPasswordPage from "./pages/ResetPasswordPage";   // <<<< IMPORT

// Protected User Pages
import CheckoutPage from "./pages/CheckoutPage";
import OrderReceiptPage from "./pages/OrderReceiptPage"; // <<<< IMPORT
import OrderHistoryPage from "./pages/OrderHistoryPage"; // <<<< IMPORT

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCategoryListPage from './pages/admin/AdminCategoryListPage';
import AdminCategoryFormPage from './pages/admin/AdminCategoryFormPage';
import AdminProductListPage from './pages/admin/AdminProductListPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminUserListPage from './pages/admin/AdminUserListPage';


const NotFound = () => (
  <div className="container text-center mt-5 page-container">
    <h2>404 - Page Not Found</h2>
    <p>Sorry, the page you are looking for does not exist.</p>
    <Link to="/" className="btn btn-primary">Go to Homepage</Link>
  </div>
);

function App() {
  return (
    <>
      <Header />
      <main className="container mt-4 mb-5"> {/* Main container for page content */}
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/category/:categoryId" element={<ShopPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} /> {/* Token & email via query params */}


          {/* --- Protected User Routes (Wrap with ProtectedRoute HOC/component later) --- */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-receipt" element={<OrderReceiptPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />


          {/* --- Admin Routes (Wrap with AdminRoute HOC/component later) --- */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/categories" element={<AdminCategoryListPage />} />
          <Route path="/admin/categories/add" element={<AdminCategoryFormPage />} />
          <Route path="/admin/categories/edit/:categoryId" element={<AdminCategoryFormPage />} />
          <Route path="/admin/products" element={<AdminProductListPage />} />
          <Route path="/admin/products/add" element={<AdminProductFormPage />} />
          <Route path="/admin/products/edit/:productId" element={<AdminProductFormPage />} />
          <Route path="/admin/users" element={<AdminUserListPage />} />


          {/* Fallback Route - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default App;