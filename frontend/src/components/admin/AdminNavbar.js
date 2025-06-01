import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/adminSlice';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { adminInfo } = useSelector((state) => state.admin);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="BrandHash"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">Admin Panel</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/admin/dashboard"
              className={`text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/admin/dashboard')
                  ? 'border-b-2 border-indigo-600'
                  : ''
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/tasks"
              className={`text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/admin/tasks')
                  ? 'border-b-2 border-indigo-600'
                  : ''
              }`}
            >
              Tasks
            </Link>
            <button
              onClick={handleLogout}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/admin/dashboard"
              className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/tasks"
              className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Tasks
            </Link>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left bg-indigo-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar; 