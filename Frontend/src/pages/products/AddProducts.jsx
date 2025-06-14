import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('adminToken');
      const payload = new FormData();

      payload.append('name', formData.name);
      payload.append('price', formData.price);
      payload.append('description', formData.description);
      payload.append('category', formData.category);
      payload.append('image', imageFile);

      const res = await axios.post(
        'http://localhost:3000/api/products/add',
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({ type: 'success', text: res.data.message });
      setFormData({ name: '', price: '', description: '' });
      setImageFile(null);

      setTimeout(() => navigate('/adminHome'), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Something went wrong';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>

      {message.text && (
        <div
          className={`mb-4 p-3 text-sm rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data">
        <div>
          <label className="block text-gray-700 font-medium">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Price (₹)</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Category</label>
          <input
            type="text"
            name="category"
            placeholder="Enter product category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 border rounded"></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">
            Product Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded">
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
