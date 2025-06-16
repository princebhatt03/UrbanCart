import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import image1 from '../assets/images/SliderComponent/Slider1.jpg';
import image2 from '../assets/images/SliderComponent/Slider2.jpg';
import image3 from '../assets/images/SliderComponent/Slider3.jpg';

const slides = [
  {
    id: 1,
    title: 'New Season Arrivals',
    description:
      'Discover the latest trends in fashion and elevate your style.',
    image: image1,
    button1: 'Shop Now',
    button2: 'Explore More',
  },
  {
    id: 2,
    title: 'Summer Collection 2025',
    description: 'Stay cool and stylish with our latest summer wear.',
    image: image2,
    button1: 'View Collection',
    button2: 'Discover More',
  },
  {
    id: 3,
    title: 'Accessories Galore',
    description: 'Bags, Watches, Jewelry and more to complete your outfit.',
    image: image3,
    button1: 'Shop Accessories',
    button2: 'View Deals',
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <motion.div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-70 z-0'
          }`}
          style={{ backgroundImage: `url('${slide.image}')` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === current ? 1 : 0 }}>
          <div className="bg-black/40 w-full h-full flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-3xl">
              <motion.h2
                className="text-4xl md:text-6xl font-bold mb-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}>
                {slide.title}
              </motion.h2>
              <motion.p
                className="text-base md:text-xl mb-6"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}>
                {slide.description}
              </motion.p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md shadow-md font-medium flex items-center gap-2">
                  {slide.button1} <ArrowRight size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-white hover:bg-gray-100 text-orange-600 px-6 py-2 rounded-md shadow-md font-medium">
                  {slide.button2}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Slider;
