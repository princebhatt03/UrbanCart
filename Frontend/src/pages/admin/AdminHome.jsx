// AdminHome.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import axios from 'axios';

const AdminHome = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [password, setPassword] = useState('');
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get('http://localhost:3000/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(res.data.products || []);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.delete(
        `http://localhost:3000/api/products/${selectedProduct}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { password },
        }
      );
      setProducts(products.filter(p => p._id !== selectedProduct));
      setShowModal(false);
      setPassword('');
    } catch (err) {
      setModalError('Incorrect password or deletion failed.');
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-orange-700 mb-6">
          Admin Dashboard
        </h1>
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Uploaded Products
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : products.length === 0 ? (
          <>
            <p className="text-center text-gray-600">No products found.</p>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => navigate('/addProducts')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                + Add Product
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => navigate('/addProducts')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                + Add Product
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map(product => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                  <img
                    src={`http://localhost:3000${
                      product.image.startsWith('/uploads/')
                        ? product.image
                        : `/uploads/${product.image}`
                    }`}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Category:{' '}
                    <span className="font-medium">
                      {product.category || 'N/A'}
                    </span>
                  </p>
                  <p className="text-gray-800 font-bold mt-2">
                    ₹{product.price}
                  </p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => navigate(`/admin/edit/${product._id}`)}
                      className="text-sm bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(product._id);
                        setShowModal(true);
                      }}
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-3">
              Enter your password to confirm deletion:
            </p>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="Admin Password"
            />
            {modalError && (
              <p className="text-red-600 text-sm mb-2">{modalError}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHome;
