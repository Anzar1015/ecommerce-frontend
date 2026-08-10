import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';

// Route-level code splitting keeps the initial bundle small.
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));

const Shop = lazy(() => import('@/pages/Shop'));
const Categories = lazy(() => import('@/pages/Categories'));
const ProductDetails = lazy(() => import('@/pages/ProductDetails'));
const Search = lazy(() => import('@/pages/Search'));
const Cart = lazy(() => import('@/pages/Cart'));
const Wishlist = lazy(() => import('@/pages/Wishlist'));
const Addresses = lazy(() => import('@/pages/Addresses'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const Orders = lazy(() => import('@/pages/Orders'));
const OrderDetails = lazy(() => import('@/pages/OrderDetails'));

const AdminProducts = lazy(() => import('@/pages/admin/Products'));
const AdminProductForm = lazy(() => import('@/pages/admin/ProductForm'));
const AdminCategories = lazy(() => import('@/pages/admin/Categories'));
const AdminCoupons = lazy(() => import('@/pages/admin/Coupons'));
const AdminOrders = lazy(() => import('@/pages/admin/Orders'));
const AdminOrderDetails = lazy(() => import('@/pages/admin/OrderDetails'));
const AdminInventory = lazy(() => import('@/pages/admin/Inventory'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));

export function AppRoutes() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        {/* Public, with site chrome (navbar/footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/search" element={<Search />} />
          {/* Cart works for guests too — persisted to localStorage until login */}
          <Route path="/cart" element={<Cart />} />

          {/* Customer (protected) — checkout requires an account since orders are user-owned */}
          <Route element={<ProtectedRoute />}>
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/addresses" element={<Addresses />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            {/* <Route path="/account" element={<Profile />} /> */}
          </Route>
        </Route>

        {/* Auth pages use their own centered layout, no navbar/footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Admin (protected + role-gated) */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id/edit" element={<AdminProductForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderDetails />} />
            <Route path="inventory" element={<AdminInventory />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
