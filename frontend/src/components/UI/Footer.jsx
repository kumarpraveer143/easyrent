import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white py-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              EasyRent
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Your reliable rental companion with advanced features and seamless user experience.
              Connect with verified landlords and tenants for a hassle-free rental journey.
            </p>
            {/* <div className="flex space-x-4">
              <Link
                to="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
              >
                <FaFacebook size={24} />
              </Link>
              <Link
                to="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
              >
                <FaTwitter size={24} />
              </Link>
              <Link
                to="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-600 transition-all duration-300 transform hover:scale-110"
              >
                <FaInstagram size={24} />
              </Link>
              <Link
                to="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-700 transition-all duration-300 transform hover:scale-110"
              >
                <FaLinkedin size={24} />
              </Link>
            </div> */}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium block"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium block"
                  to="/about"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium block"
                  to="/findRooms"
                >
                  Find Rooms
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium block"
                  to="/uploadrooms"
                >
                  List Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium block"
                  to="/faq"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium block"
                  to="/contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium block"
                  to="/about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium block"
                  to="/developer"
                >
                  Developer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400 font-medium">
                &copy; {new Date().getFullYear()} EasyRent. All Rights Reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Advanced rental platform for modern property management
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                to="/privacy"
              >
                Privacy Policy
              </Link>
              <Link
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                to="/terms"
              >
                Terms of Service
              </Link>
              <Link
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                to="/cookies"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
