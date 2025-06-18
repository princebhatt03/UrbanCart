import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../components/UserHeader';
import Footer from '../components/Footer';
import Slider from '../components/Slider';
import CollectionGrid from '../components/CollectionGrid';
import StoreFeatures from '../components/BlogAndStoreFeatures';
import FeaturedBeautyPicks from '../components/BeautySection';

const FrontPage = () => {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/products`);
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <Slider />
      <main
        className={`pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-gray-50 ${
          !loading && products.length > 0 ? 'min-h-screen' : ''
        }`}>
        <h1 className="text-4xl font-bold text-center text-[#FF708E] mb-10">
          Latest Products
        </h1>

        {loading ? (
          <p className="text-center text-gray-500 text-lg">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No products available
          </p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}>
            {products.map(product => (
              <motion.div
                key={product._id}
                className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col transition hover:shadow-xl duration-300"
                whileHover={{ scale: 1.03 }}>
                <img
                  src={`${BACKEND_URL}${
                    product.image.startsWith('/uploads/')
                      ? product.image
                      : `/uploads/${product.image}`
                  }`}
                  alt={product.name}
                  className="h-48 w-full object-cover"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">₹{product.price}</p>
                  <div className="mt-auto flex gap-2">
                    <button className="w-full bg-[#FF708E] hover:bg-[#FF708E] text-white py-2 px-3 rounded-md text-sm transition">
                      Add to Cart
                    </button>
                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md text-sm transition">
                      Show Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <CollectionGrid />
      <StoreFeatures />
      <FeaturedBeautyPicks />
      <Footer />
    </>
  );
};

export default FrontPage;
