import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../../assets/images/prof.webp';

const AdminDelete = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    const loadAdmin = () => {
      const storedAdmin = localStorage.getItem('adminInfo');
      const storedToken = localStorage.getItem('adminToken');

      if (storedAdmin && storedToken) {
        try {
          const parsedAdmin = JSON.parse(storedAdmin);

          // If _id is missing but id exists, fallback
          if (!parsedAdmin._id && parsedAdmin.id) {
            parsedAdmin._id = parsedAdmin.id;
          }

          if (!parsedAdmin._id) {
            setErrorMessage('Invalid admin data. Please log in again.');
            navigate('/adminLogin');
            return;
          }

          setAdmin(parsedAdmin);
          setToken(storedToken);

          const imageURL = parsedAdmin.profileImage?.startsWith('/uploads/')
            ? `${backendURL}${parsedAdmin.profileImage}`
            : defaultImage;

          setPreviewImage(imageURL);
        } catch (err) {
          console.error('Error parsing admin data from localStorage:', err);
          navigate('/adminLogin');
        }
      } else {
        navigate('/adminLogin');
      }
    };

    loadAdmin();

    // Listen to localStorage token changes
    window.addEventListener('storage', loadAdmin);
    return () => window.removeEventListener('storage', loadAdmin);
  }, [navigate]);

  const handleDelete = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!admin?._id) {
      setErrorMessage('Admin ID is missing.');
      return;
    }

    try {
      const response = await fetch(
        `${backendURL}/api/admin/delete/${admin._id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }), // Only if your backend accepts body in DELETE
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('adminToken');
        setSuccessMessage('Admin account deleted successfully!');
        setShowModal(false);
        setPassword('');

        setTimeout(() => {
          navigate('/adminRegister');
        }, 2500);
      } else {
        setErrorMessage(data.message || 'Failed to delete admin.');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      setErrorMessage('Server error. Please try again later.');
    }
  };

  if (!admin || !token) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading admin data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-2 text-red-600">
          Delete Admin Account
        </h2>

        <div className="flex justify-center mb-4">
          <img
            src={previewImage}
            alt="Admin"
            className="w-24 h-24 rounded-full border-2 border-red-400 object-cover"
          />
        </div>

        <p className="text-gray-700 mb-2">
          Username: <strong>{admin.adminUsername}</strong>
        </p>
        <p className="text-gray-700 mb-4">
          Full Name: <strong>{admin.fullName}</strong>
        </p>

        {successMessage && (
          <p className="text-green-600 text-sm font-semibold mb-4">
            {successMessage}
          </p>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/adminHome')}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition">
            Cancel
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
            Delete Admin
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4 text-center text-red-600">
                Confirm Admin Deletion
              </h3>
              {errorMessage && (
                <p className="text-red-500 text-sm mb-3 text-center">
                  {errorMessage}
                </p>
              )}
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
              />
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setPassword('');
                    setErrorMessage('');
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDelete;
