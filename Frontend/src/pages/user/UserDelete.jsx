import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDelete = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    const storedToken = localStorage.getItem('userToken');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        console.error('Error parsing localStorage:', err);
        navigate('/userLogin');
      }
    } else {
      navigate('/userLogin');
    }
  }, [navigate]);

  const handleDelete = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL ||
          import.meta.env.VITE_LOCAL_BACKEND_URL
        }/api/user/delete/${user.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userToken');
        setSuccessMessage('User Deleted Successfully!');
        setShowModal(false);
        setPassword('');

        // Delay redirect by 2.5 seconds
        setTimeout(() => {
          navigate('/userRegister');
        }, 2500);
      } else {
        setErrorMessage(data.message || 'Failed to delete user.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMessage('Server error! Please try again later.');
    }
  };

  if (!user || !token) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-2 text-red-600">
          Delete Account
        </h2>
        <p className="text-gray-700 mb-2">
          Username: <strong>{user.username}</strong>
        </p>

        {successMessage && (
          <p className="text-green-600 text-sm font-semibold mb-4">
            {successMessage}
          </p>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition">
            Cancel
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
            Delete User
          </button>
        </div>

        {/* Password Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-transparent backdrop-blur flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4 text-center text-red-600">
                Confirm Deletion
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

export default UserDelete;
