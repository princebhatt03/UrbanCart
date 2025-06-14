import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import logo from '../assets/images/logo.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    if (user) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
      setUser(null);
      navigate('/userLogin');
    } else if (admin) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      setAdmin(null);
      navigate('/adminLogin');
    }
  };

  useEffect(() => {
    const syncAuthData = () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('userInfo'));
        const storedAdmin = JSON.parse(localStorage.getItem('adminInfo'));
        setUser(storedUser || null);
        setAdmin(storedAdmin || null);
      } catch {
        setUser(null);
        setAdmin(null);
      }
    };

    syncAuthData();
    window.addEventListener('storage', syncAuthData);
    return () => window.removeEventListener('storage', syncAuthData);
  }, []);

  const navLinks = user
    ? [
        { label: 'Home', path: '/' },
        { label: 'Shop', path: '/shop' },
        { label: 'Categories', path: '/categories' },
        { label: 'Cart', path: '/cart' },
      ]
    : [
        { label: 'Home', path: '/' }, // Admin sees only Home
      ];

  const isLoggedIn = !!user || !!admin;
  const displayName = user?.username || admin?.adminUsername;
  const profileLink = user ? '/userProfile' : admin ? '/adminProfile' : '#';
  const userTypeLabel = user ? 'User' : admin ? 'Admin' : '';

  return (
    <header className="bg-white shadow-md w-full fixed top-0 left-0 z-50">
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
            UrbanKart
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
                `text-gray-700 hover:text-orange-500 transition duration-200 ${
                  isActive ? 'font-semibold text-orange-500' : ''
                }`
              }>
              {link.label}
            </NavLink>
          ))}

          {!isLoggedIn ? (
            <>
              <NavLink
                to="/userLogin"
                className="text-gray-700 hover:text-blue-600 transition font-medium">
                Login
              </NavLink>
              <NavLink
                to="/userRegister"
                className="text-gray-700 hover:text-green-600 transition font-medium">
                Create Account
              </NavLink>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">
                Hello,{' '}
                <strong>
                  {userTypeLabel}: {displayName}
                </strong>
              </span>
              <NavLink
                to={profileLink}
                className="text-gray-700 hover:text-purple-600 transition font-medium">
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 font-medium">
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-white shadow-lg px-4 pb-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block text-gray-700 hover:text-orange-500 transition-colors duration-200 ${
                    isActive ? 'font-semibold text-orange-500' : ''
                  }`
                }>
                {link.label}
              </NavLink>
            ))}

            {!isLoggedIn ? (
              <>
                <NavLink
                  to="/userLogin"
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 font-medium">
                  Login
                </NavLink>
                <NavLink
                  to="/userRegister"
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 hover:text-green-600 font-medium">
                  Create Account
                </NavLink>
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-gray-600">
                  Hello,{' '}
                  <strong>
                    {userTypeLabel}: {displayName}
                  </strong>
                </span>
                <NavLink
                  to={profileLink}
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 hover:text-purple-600 font-medium">
                  Profile
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left text-red-500 hover:text-red-700 font-medium">
                  Logout
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
