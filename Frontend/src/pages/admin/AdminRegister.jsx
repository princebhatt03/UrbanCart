import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminRegister = () => {
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState({
    fullName: '',
    adminUsername: '',
    adminID: '',
    email: '',
    mobile: '',
    password: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const { fullName, adminUsername, adminID, email, mobile, password } =
      adminData;

    if (
      !fullName.trim() ||
      !adminUsername.trim() ||
      !adminID.trim() ||
      !email.trim() ||
      !mobile.trim() ||
      !password.trim()
    ) {
      setErrorMessage('❌ Please fill all fields');
      setSuccessMessage('');
      return;
    }

    try {
      setLoading(true);
      const finalURL =
        import.meta.env.VITE_BACKEND_URL ||
        import.meta.env.VITE_LOCAL_BACKEND_URL;

      const response = await axios.post(`${finalURL}/api/admin/register`, {
        fullName: fullName.trim(),
        adminUsername: adminUsername.trim(),
        adminID: adminID.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        password: password.trim(),
      });

      if (response.data.success) {
        setSuccessMessage('Admin registered successfully!');
        setErrorMessage('');

        setTimeout(() => {
          navigate('/adminLogin');
        }, 2000);
      } else {
        setErrorMessage(response.data.message || '❌ Registration failed.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          '⚠️ Server error! Please try again later.'
      );
      setSuccessMessage('');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 4000);
    }
  };

  const handleGoogleRegister = () => {
    alert('Google OAuth for Admin coming soon...');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700">
          Register as Admin
        </h2>

        {errorMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mb-4 text-center font-semibold">
            {errorMessage}
          </motion.p>
        )}
        {successMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 mb-4 text-center font-semibold">
            {successMessage}
          </motion.p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={adminData.fullName}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
            required
          />
          <input
            type="text"
            name="adminUsername"
            placeholder="Admin Username"
            value={adminData.adminUsername}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
            required
          />
          <input
            type="text"
            name="adminID"
            placeholder="Admin ID"
            value={adminData.adminID}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={adminData.email}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={adminData.mobile}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={adminData.password}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
            autoComplete="new-password"
            required
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-800 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg transition duration-300">
            {loading ? 'Registering...' : 'Register'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="w-full bg-indigo-400 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold shadow-lg transition duration-300">
            Go Back to Home
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/userRegister')}
            className="w-full bg-indigo-200 hover:bg-indigo-300 text-white py-3 rounded-xl font-semibold shadow-lg transition duration-300">
            Register as a User
          </motion.button>
        </form>

        <div className="mt-6 flex flex-col items-center">
          <p className="text-gray-500 mb-3">Or register with</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleRegister}
            className="flex items-center justify-center w-full max-w-xs bg-white border border-gray-300 rounded-xl py-3 text-gray-700 font-semibold shadow-md hover:shadow-lg transition">
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
            Register with Google
          </motion.button>
        </div>

        <p className="mt-6 text-center text-gray-600">
          Already an admin?{' '}
          <Link
            to="/adminLogin"
            className="text-indigo-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminRegister;
