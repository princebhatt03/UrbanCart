import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  PlusCircle,
  UserCircle,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';
import logo from '../assets/images/logo.png';

const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    setAdmin(null);
    navigate('/adminLogin');
  };

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem('adminInfo'));
    setAdmin(storedAdmin || null);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/', icon: <Home size={18} /> },
    ...(admin
      ? [
          {
            label: 'Add Products',
            path: '/admin/add-product',
            icon: <PlusCircle size={18} />,
          },
          {
            label: 'Profile',
            path: '/adminProfile',
            icon: <UserCircle size={18} />,
          },
        ]
      : []),
  ];

  const authLinks = admin
    ? [
        <span
          key="adminName"
          className="text-sm font-medium text-gray-600">
          Hello, <strong>{admin.adminUsername}</strong>
        </span>,
        <button
          key="logout"
          onClick={handleLogout}
          className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium">
          <LogOut size={18} /> Logout
        </button>,
      ]
    : [
        <NavLink
          key="login"
          to="/adminLogin"
          className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium">
          <LogIn size={18} /> Login
        </NavLink>,
        <NavLink
          key="register"
          to="/adminRegister"
          className="flex items-center gap-1 text-gray-700 hover:text-green-600 font-medium">
          <UserPlus size={18} /> Register
        </NavLink>,
      ];

  return (
    <header className="bg-white shadow-md w-full sticky top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto"
          />
          <span className="ml-2 text-xl font-bold text-orange-500 hidden sm:inline">
            UrbanKart Admin
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-1 text-gray-700 hover:text-orange-500 transition ${
                  isActive ? 'font-semibold text-orange-500' : ''
                }`
              }>
              {link.icon}
              {link.label}
            </NavLink>
          ))}
          {authLinks.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </nav>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="md:hidden bg-white shadow-lg px-4 pb-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-gray-700 hover:text-orange-500 transition ${
                    isActive ? 'font-semibold text-orange-500' : ''
                  }`
                }>
                {link.icon} {link.label}
              </NavLink>
            ))}
            {authLinks.map((item, index) => (
              <div
                key={index}
                onClick={() => setMenuOpen(false)}>
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default AdminHeader;
