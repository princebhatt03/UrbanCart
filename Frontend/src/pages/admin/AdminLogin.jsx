import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import adminBg from '../../assets/images/login.jpg';
import Header from '../../components/AdminHeader';
import Footer from '../../components/Footer';

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

  const handleGoogleLogin = () => {
    alert('Google Login clicked! Add your OAuth flow here.');
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
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-50 to-yellow-100 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column - Form */}
          <div>
            <h2 className="text-3xl font-extrabold mb-6 text-center md:text-left text-orange-700">
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
                className="w-full bg-orange-700 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold shadow-lg transition duration-300">
                {loading ? 'Logging in...' : 'Login'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                type="button"
                className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg transition duration-300">
                Back to Home
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/userLogin')}
                type="button"
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
          </div>

          {/* Right Column - Background Image */}
          <div
            className="bg-cover bg-center bg-no-repeat rounded-2xl md:flex items-center justify-center"
            style={{ backgroundImage: `url(${adminBg})` }}>
            <div className="p-6 w-full rounded-xl text-white text-center">
              <p className="text-gray-600 font-semibold mb-4">Or login with</p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoogleLogin}
                className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-xl py-3 text-gray-700 font-semibold shadow-md hover:shadow-lg transition mb-6">
                <svg
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 533.5 544.3"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M533.5 278.4c0-17.7-1.6-35-4.7-51.7H272v97.9h146.8c-6.4 34.6-25.8 63.9-55.3 83.4v69.4h89.4c52.2-48 82.6-119 82.6-198.9z"
                    fill="#4285F4"
                  />
                  <path
                    d="M272 544.3c74.3 0 136.7-24.6 182.2-66.8l-89.4-69.4c-24.8 16.7-56.6 26.6-92.8 26.6-71.3 0-131.8-48-153.6-112.9H26.7v70.7c45.4 89.3 138.9 151.8 245.3 151.8z"
                    fill="#34A853"
                  />
                  <path
                    d="M118.4 323.8c-10.3-30.7-10.3-63.9 0-94.6V158.5H26.7c-37.3 74.3-37.3 162.9 0 237.2l91.7-71.9z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M272 107.7c39.7 0 75.4 13.7 103.5 40.7l77.6-77.6C408.2 24.6 345.9 0 272 0 165.5 0 72 62.5 26.7 152.7l91.7 70.8c21.7-64.8 82.2-112.9 153.6-112.9z"
                    fill="#EA4335"
                  />
                </svg>
                Login with Google
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;
