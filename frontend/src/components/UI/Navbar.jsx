import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Loading from "./Loading";
import axios from "axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = localStorage.getItem("user");

  const handleNavigation = (path) => {
    if (location.pathname === path) return; // Don't navigate if already on the same page

    setIsLoading(true);
    setIsMenuOpen(false);

    // Simulate a small delay to show loading (you can adjust this)
    setTimeout(() => {
      navigate(path);
      setIsLoading(false);
    }, 500);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("favouriteRooms");
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 text-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        {/* Logo */}
        <div className="text-2xl font-extrabold">
          <button
            onClick={() => handleNavigation("/")}
            className="focus:outline-none group transition-all duration-300"
          >
            <span className="text-primary-700 font-bold group-hover:text-primary-600 transition-colors duration-300">
              EasyRent
            </span>
          </button>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => handleNavigation("/about")}
            className="text-gray-600 hover:text-primary-600 transition-all duration-300 font-medium relative group"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
          </button>
          <button
            onClick={() => handleNavigation("/developer")}
            className="text-gray-600 hover:text-primary-600 transition-all duration-300 font-medium relative group"
          >
            Developer
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
          </button>
          <button
            onClick={() => handleNavigation("/contact")}
            className="text-gray-600 hover:text-primary-600 transition-all duration-300 font-medium relative group"
          >
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
          </button>
        </div>

        {/* Profile and Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              {/* Dashboard Button Only */}
              <button
                onClick={() => handleNavigation("/dashboard")}
                className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigation("/signup")}
                className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Sign Up
              </button>
              <button
                onClick={() => handleNavigation("/login")}
                className="px-6 py-2 border border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Log In
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-600 hover:text-primary-600 focus:outline-none transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-t border-gray-100 transition-all duration-500 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-2 space-y-1">
          <button
            onClick={() => handleNavigation("/")}
            className="block w-full px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg text-center font-medium transition-all duration-300"
          >
            Home
          </button>
          <button
            onClick={() => handleNavigation("/about")}
            className="block w-full px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg text-center font-medium transition-all duration-300"
          >
            About
          </button>
          <button
            onClick={() => handleNavigation("/contact")}
            className="block w-full px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg text-center font-medium transition-all duration-300"
          >
            Contact
          </button>
          {JSON.parse(user || "{}")?.userType === "renter" && (
            <button
              onClick={() => handleNavigation("/findrooms")}
              className="block w-full px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg text-center font-medium transition-all duration-300"
            >
              Rooms
            </button>
          )}
          {user ? (
            <>
              <button
                onClick={() => handleNavigation("/dashboard")}
                className="block w-full px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg text-center font-medium transition-all duration-300"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white text-center font-medium rounded-lg transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigation("/signup")}
                className="block w-full px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white text-center font-medium rounded-lg transition-all duration-300"
              >
                Sign Up
              </button>
              <button
                onClick={() => handleNavigation("/login")}
                className="block w-full px-4 py-3 text-primary-600 border border-primary-600 text-center font-medium rounded-lg hover:bg-primary-50 transition-all duration-300"
              >
                Log In
              </button>
            </>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && <Loading />}
    </nav>
  );
};

export default Navbar;