import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import UserRegister from './pages/user/UserRegister';
import UserLogin from './pages/user/UserLogin';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './UserProtectedRoute';
import UserProfileUpdate from './pages/user/UserProfileUpdate';
import UserDelete from './pages/user/UserDelete';
import AdminDelete from './pages/admin/AdminDelete';
import AdminProfileUpdate from './pages/admin/AdminProfileUpdate';
import AdminRegister from './pages/admin/AdminRegister';
import AdminLogin from './pages/admin/AdminLogin';
import AdminHome from './pages/admin/AdminHome';
import AdminProtectedRoute from './AdminProtectedRoutes';
import AddProduct from './pages/products/AddProducts';
import EditProduct from './pages/products/EditProduct';
import Cart from './pages/products/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import Shop from './pages/products/Shop';
import Category from './pages/products/Category';
import FAQPage from './components/FAGPage';

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const info = localStorage.getItem('userInfo');
    if (info) setUser(JSON.parse(info));
  }, []);

  return (
    <Routes>
      {/* Protected Home Page */}
      <Route
        path="/"
        element={<FrontPage />}
      />

      {/* Public Routes */}
      <Route
        path="/userRegister"
        element={<UserRegister />}
      />
      <Route
        path="/userLogin"
        element={<UserLogin onLogin={setUser} />}
      />

      {/* Protected User Profile Update */}
      <Route
        path="/userProfile"
        element={
          <ProtectedRoute>
            <UserProfileUpdate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/contact"
        element={<Contact />}
      />

      <Route
        path="/faqs"
        element={<FAQPage />}
      />

      <Route
        path="/shop"
        element={
          <ProtectedRoute>
            <Shop />
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        }
      />

      {/* Protected User Deletion */}
      <Route
        path="/userDelete"
        element={
          <ProtectedRoute>
            <UserDelete />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminHome"
        element={
          <AdminProtectedRoute>
            <AdminHome />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/adminLogin"
        element={<AdminLogin />}
      />

      <Route
        path="/adminRegister"
        element={<AdminRegister />}
      />

      <Route
        path="/adminProfile"
        element={
          <AdminProtectedRoute>
            <AdminProfileUpdate />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/adminDelete"
        element={
          <AdminProtectedRoute>
            <AdminDelete />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/addProducts"
        element={
          <AdminProtectedRoute>
            <AddProduct />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/edit/:id"
        element={<EditProduct />}
      />

      {/* Catch-All for Unknown Routes */}
      <Route
        path="*"
        element={<ErrorPage />}
      />
    </Routes>
  );
}

export default App;
