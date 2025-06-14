import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import axios from 'axios';

const AdminHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          <p className="text-center text-gray-600">No products found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map(product => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                <img
                  src={`http://localhost:3000${product.image}`}
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
                <p className="text-gray-800 font-bold mt-2">₹{product.price}</p>
                <div className="flex justify-between mt-4">
                  <button className="text-sm bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">
                    Edit
                  </button>
                  <button className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminHome;
