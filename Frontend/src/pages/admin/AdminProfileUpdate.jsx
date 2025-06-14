import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminProfileUpdate = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ✅ Load admin data from localStorage
  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminInfo');
    if (storedAdmin) {
      try {
        const parsed = JSON.parse(storedAdmin);
        setAdmin(parsed);
        setFormData({
          fullName: parsed.fullName || '',
          username: parsed.adminUsername || '',
          email: parsed.email || '',
          newPassword: '',
          confirmNewPassword: '',
        });
      } catch (err) {
        console.error('Invalid admin data in localStorage');
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('adminToken');
        navigate('/adminLogin');
      }
    } else {
      navigate('/adminLogin');
    }
  }, [navigate]);

  // ✅ Handle input changes
  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Show password modal
  const openPasswordModal = e => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmNewPassword
    ) {
      setErrorMsg('New passwords do not match!');
      return;
    }

    setShowPasswordModal(true);
  };

  // ✅ Confirm update
  const handleUpdate = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!admin) {
      setErrorMsg('Admin data not loaded.');
      return;
    }

    if (!currentPassword) {
      setErrorMsg('Please enter your current password to confirm.');
      return;
    }

    const payload = {
      currentPassword,
      updates: {},
    };

    if (formData.fullName !== admin.fullName)
      payload.updates.fullName = formData.fullName;

    if (formData.username !== admin.adminUsername)
      payload.updates.adminUsername = formData.username;

    if (formData.email !== admin.email) payload.updates.email = formData.email;

    if (formData.newPassword) payload.updates.password = formData.newPassword;

    if (Object.keys(payload.updates).length === 0) {
      setErrorMsg('No changes to update.');
      return;
    }

    try {
      const backendURL =
        import.meta.env.VITE_BACKEND_URL ||
        import.meta.env.VITE_LOCAL_BACKEND_URL;

      const response = await fetch(`${backendURL}/api/admin/updateProfile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.admin) {
        localStorage.setItem('adminInfo', JSON.stringify(data.admin));
        if (data.token) {
          localStorage.setItem('adminToken', data.token);
        }
        setAdmin(data.admin);
        setSuccessMsg('Admin profile updated successfully!');
        setShowPasswordModal(false);
        setCurrentPassword('');
      } else {
        if (data.message === 'Invalid or expired token') {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminInfo');
          navigate('/adminLogin');
          return;
        }
        setErrorMsg(data.message || 'Failed to update admin profile.');
      }
    } catch (error) {
      console.error('Admin Update Error:', error);
      setErrorMsg('Server error! Please try again later.');
    }
  };

  if (!formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading admin data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-red-100 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-red-600">
          Update Admin Profile
        </h2>

        {(errorMsg || successMsg) && (
          <p
            className={`mb-4 text-center font-semibold ${
              errorMsg ? 'text-red-600' : 'text-green-600'
            }`}>
            {errorMsg || successMsg}
          </p>
        )}

        <form
          className="space-y-5"
          onSubmit={openPasswordModal}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password (leave blank if no change)"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <input
            type="password"
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-red-600 text-red-600 font-semibold hover:bg-red-100 transition">
              Go Home
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition">
              Update Profile
            </button>

            <button
              type="button"
              onClick={() => navigate('/adminDelete')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-800 text-white hover:bg-black transition">
              Delete Admin
            </button>
          </div>
        </form>

        {showPasswordModal && (
          <div className="fixed inset-0 bg-transparent backdrop-blur flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center text-red-600">
                Confirm Current Password
              </h3>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                autoFocus
              />

              {errorMsg && (
                <p className="text-red-600 text-center mb-2">{errorMsg}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setCurrentPassword('');
                    setErrorMsg('');
                  }}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl border border-gray-400 hover:bg-gray-100 transition">
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition">
                  Confirm & Update
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminProfileUpdate;
