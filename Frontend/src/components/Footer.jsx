import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';
import logo from '../assets/images/logo.png';

const Footer = () => {
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
            <li className="hover:text-white transition duration-300 cursor-pointer">
              Home
            </li>
            <li className="hover:text-white transition duration-300 cursor-pointer">
              Shop
            </li>
            <li className="hover:text-white transition duration-300 cursor-pointer">
              About Us
            </li>
            <li className="hover:text-white transition duration-300 cursor-pointer">
              Contact
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
              (Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="bg-gray-700 hover:bg-white hover:text-gray-900 p-2 rounded-full transition duration-300">
                  <Icon />
                </a>
              )
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} UrbanKart. All rights reserved.
        Developed by Prince Bhatt
      </div>
    </footer>
  );
};

export default Footer;
