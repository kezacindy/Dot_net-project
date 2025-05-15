import React from "react";
// No need for BrowserRouter here as it's in index.js
import { Route, Routes } from "react-router-dom";

// Layout
import Header from "./components/layout/Header";
// import Footer from './components/layout/Footer';

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCategoryListPage from './pages/admin/AdminCategoryListPage';
import AdminCategoryFormPage from './pages/admin/AdminCategoryFormPage';
import AdminProductListPage from './pages/admin/AdminProductListPage'; // Import AdminProductListPage
// Placeholder imports for other admin pages - create these files as needed
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
// import AdminUserListPage from './pages/admin/AdminUserListPage';


// Public Pages (Uncomment as you implement them)
// import ShopPage from "./pages/ShopPage";
// import ProductDetailPage from "./pages/ProductDetailPage";
// import CartPage from "./pages/CartPage";
// import CheckoutPage from "./pages/CheckoutPage";
// import OrderReceiptPage from "./pages/OrderReceiptPage";
// import OrderHistoryPage from "./pages/OrderHistoryPage";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// import ResetPasswordPage from "./pages/ResetPasswordPage";


// Simple Not Found component
const NotFound = () => (
  <div>
    <h2>404 Not Found</h2>
    <p>The page you requested does not exist.</p>
  </div>
);

function App() {
  return (
    <> {/* Fragment because Router is in index.js */}
      <Header />
      <main className="container mt-3 mb-5">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/shop" element={<ShopPage />} /> */}
          {/* <Route path="/shop/category/:categoryId" element={<ShopPage />} /> */}
          {/* <Route path="/product/:productId" element={<ProductDetailPage />} /> */}
          {/* <Route path="/cart" element={<CartPage />} /> */}
          {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
          {/* <Route path="/reset-password" element={<ResetPasswordPage />} /> */}

          {/* Protected Routes (Example - wrap with a ProtectedRoute component later) */}
          {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
          {/* <Route path="/order-receipt" element={<OrderReceiptPage />} /> */}
          {/* <Route path="/order-history" element={<OrderHistoryPage />} /> */}


          {/* Admin Routes (Example - wrap with an AdminRoute component later) */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/categories" element={<AdminCategoryListPage />} />
          <Route path="/admin/categories/add" element={<AdminCategoryFormPage />} />
          <Route path="/admin/categories/edit/:categoryId" element={<AdminCategoryFormPage />} />

          <Route path="/admin/products" element={<AdminProductListPage />} />
          {/* Placeholders for Add/Edit Product forms */}
          <Route path="/admin/products/add" element={<AdminProductFormPage />} /> 
          <Route path="/admin/products/edit/:productId" element={<AdminProductFormPage />} /> 

          {/* <Route path="/admin/users" element={<AdminUserListPage />} /> */}


          {/* Fallback Route - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default App;