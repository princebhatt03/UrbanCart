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

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
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

      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('adminUsername', adminUsername.trim());
      formData.append('adminID', adminID.trim());
      formData.append('email', email.trim());
      formData.append('mobile', mobile.trim());
      formData.append('password', password.trim());
      if (profileImage) formData.append('profileImage', profileImage);

      const response = await axios.post(
        `${finalURL}/api/admin/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

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
          className="space-y-5"
          encType="multipart/form-data">
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
            className="w-full px-5 py-3 rounded-xl border border-gray-300"
            required
          />
          <input
            type="text"
            name="adminID"
            placeholder="Admin ID"
            value={adminData.adminID}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-gray-300"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={adminData.email}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-gray-300"
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={adminData.mobile}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-gray-300"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={adminData.password}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-gray-300"
            autoComplete="new-password"
            required
          />
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Add profile photo{' '}
            <span className="text-gray-500 text-xs">
              (you can also leave it blank)
            </span>
          </label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-xl p-3"
          />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Profile Preview"
              className="w-24 h-24 object-cover rounded-full mx-auto border border-gray-300"
            />
          )}

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
            {/* Google SVG here */}
            <svg
              className="w-6 h-6 mr-2"
              viewBox="0 0 533.5 544.3"
              xmlns="http://www.w3.org/2000/svg">
              {/* SVG paths unchanged */}
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
