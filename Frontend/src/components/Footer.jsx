import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaWhatsapp,
} from 'react-icons/fa';

import logo from '../assets/images/logo.png';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white w-full px-6 py-10 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src={logo}
            alt="UrbanKart Logo"
            className="h-22 mb-4"
          />
          <p className="text-gray-400">
            Your one-stop shop for trendy, affordable shopping. Click. Cart.
            Conquer.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li
              onClick={() => navigate('/')}
              className="hover:text-white transition duration-300 cursor-pointer">
              Home
            </li>
            <li
              onClick={() => navigate('/shop')}
              className="hover:text-white transition duration-300 cursor-pointer">
              Shop
            </li>
            <li
              onClick={() => navigate('/about')}
              className="hover:text-white transition duration-300 cursor-pointer">
              About Us
            </li>
            <li
              onClick={() => navigate('/contact')}
              className="hover:text-white transition duration-300 cursor-pointer">
              Contact
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <a
              href="https://github.com/princebhatt03"
              target="_blank"
              rel="noopener noreferrer">
              <FaGithub className="text-xl hover:text-white" />
            </a>
            <a
              href="https://wa.me/916265307739"
              target="_blank"
              rel="noopener noreferrer">
              <FaWhatsapp className="text-xl hover:text-green-400" />
            </a>
            <a
              href="https://www.instagram.com/prince20.02/"
              target="_blank"
              rel="noopener noreferrer">
              <FaInstagram className="text-xl hover:text-pink-500" />
            </a>
            <a
              href="https://www.linkedin.com/in/prince-bhatt-0958a725a/"
              target="_blank"
              rel="noopener noreferrer">
              <FaLinkedinIn className="text-xl hover:text-blue-500" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} UrbanKart. All rights reserved. <br />
        Developed by{' '}
        <a
          href="https://www.linkedin.com/in/prince-bhatt-0958a725a/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline">
          Prince Bhatt
        </a>
      </div>
    </footer>
  );
};

export default Footer;
