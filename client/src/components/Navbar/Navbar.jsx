import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

// Import the logo image
import logo from "../../assets/Dinitha/logo3.png"; // Update the path to your logo file

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed z-50 bg-white rounded-full shadow-lg top-5 left-10 right-10">
      <div className="container flex items-center justify-between p-4 mx-auto">
        
        {/* Navbar Logo */}
        <div className="text-2xl font-bold">
          <Link to="/user-blog">
            <img
              src={logo}
              alt="Ceylon Odyssey Logo"
              className="w-auto h-12" // Adjust height as needed, width will scale proportionally
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="justify-center flex-1 hidden space-x-8 md:flex">
          <Link to="/about" className="text-gray-700 transition duration-300 hover:text-blue-600">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 transition duration-300 hover:text-blue-600">
            Contact
          </Link>
          <Link to="/blog" className="text-gray-700 transition duration-300 hover:text-blue-600">
            Blog
          </Link>
          <Link to="/destinations" className="text-gray-700 transition duration-300 hover:text-blue-900">
            Destinations
          </Link>
        </div>

        {/* Buttons */}
        <div className="items-center hidden space-x-4 md:flex">
          <Link to="/login" className="px-4 py-2 text-blue-900 transition duration-300 rounded-full hover:bg-gray-300">
            Sign In
          </Link>
          <Link to="/signup" className="px-4 py-2 text-white transition duration-300 bg-blue-900 rounded-full hover:bg-blue-700">
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="text-gray-900 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute z-50 p-4 mt-2 bg-white rounded-lg shadow-md md:hidden top-16 left-10 right-10">
          <Link to="/about" className="block py-2 text-gray-700 hover:text-blue-600">About</Link>
          <Link to="/contact" className="block py-2 text-gray-700 hover:text-blue-600">Contact</Link>
          <Link to="/blog" className="block py-2 text-gray-700 hover:text-blue-600">Blog</Link>
          <Link to="/destinations" className="block py-2 text-gray-700 hover:text-blue-600">Destinations</Link>
          <div className="mt-4">
            <Link to="/login" className="block py-2 text-center text-blue-600 rounded-lg hover:bg-gray-300">Sign In</Link>
            <Link to="/signup" className="block py-2 mt-2 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700">Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;