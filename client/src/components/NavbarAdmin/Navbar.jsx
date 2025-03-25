import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/Dinitha/logo3.png'; // Import the logo

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any logout logic here (e.g., clearing tokens)
    navigate('/');
  };

  return (
    <nav className="fixed top-5 left-10 right-10 bg-gray-100 shadow-lg rounded-full z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Navbar Title and Logo */}
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <img
            src={logo}
            alt="ReservaSys Logo"
            className="h-12 w-auto object-contain"
            onError={(e) => {
              e.target.src = '/fallback-logo.png'; // Fallback image if the logo fails to load
            }}
          />
         
        </div>

        {/* Desktop Logout Button */}
        <div className="hidden md:flex items-center">
          <button
            onClick={handleLogout}
            className="bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md rounded-lg mt-2 p-4 absolute top-16 left-10 right-10 z-50">
          <div className="text-sm text-gray-600 font-medium mb-4 text-center">
            This is Admin Dashboard
          </div>
          <button
            onClick={handleLogout}
            className="block w-full bg-blue-900 text-white py-2 rounded-lg text-center hover:bg-blue-700 transition duration-300"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;