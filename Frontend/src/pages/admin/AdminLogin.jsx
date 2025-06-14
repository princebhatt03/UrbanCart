import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [adminLoginData, setAdminLoginData] = useState({
    adminUsername: '',
    adminID: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setAdminLoginData({ ...adminLoginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async e => {
    e.preventDefault();

    const { adminUsername, adminID, password } = adminLoginData;

    if (!adminUsername.trim() || !adminID.trim() || !password.trim()) {
      setMessage('⚠️ All fields are required.');
      return;
    }

    try {
      setLoading(true);

      const backendURL =
        import.meta.env.VITE_BACKEND_URL ||
        import.meta.env.VITE_LOCAL_BACKEND_URL;

      const response = await axios.post(`${backendURL}/api/admin/login`, {
        adminUsername: adminUsername.trim(),
        adminID: adminID.trim(),
        password: password.trim(),
      });

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));

        setSuccessMessage('✅ Login successful!');
        setMessage('');
        setTimeout(() => navigate('/adminHome'), 1500);
      } else {
        setMessage(
          response.data.message || '❌ Login failed. Check credentials.'
        );
        setSuccessMessage('');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || '❌ Login failed.';
      setMessage(errorMsg);
      setSuccessMessage('');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage('');
        setSuccessMessage('');
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 to-yellow-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-orange-700">
          Admin Login
        </h2>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 mb-4 text-center font-medium">
            {message}
          </motion.p>
        )}
        {successMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 mb-4 text-center font-medium">
            {successMessage}
          </motion.p>
        )}

        <form
          onSubmit={handleLogin}
          className="space-y-5">
          <input
            type="text"
            name="adminUsername"
            placeholder="Admin Username"
            value={adminLoginData.adminUsername}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-orange-300 transition"
            required
          />
          <input
            type="text"
            name="adminID"
            placeholder="Admin ID"
            value={adminLoginData.adminID}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-orange-300 transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={adminLoginData.password}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-orange-300 transition"
            autoComplete="current-password"
            required
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-orange-800 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold shadow-lg transition duration-300">
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg transition duration-300">
            Back to Home
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/userLogin')}
            className="w-full bg-orange-200 hover:bg-orange-300 text-white py-3 rounded-xl font-semibold shadow-lg transition duration-300">
            Login as a User
          </motion.button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          New admin?{' '}
          <Link
            to="/adminRegister"
            className="text-orange-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
