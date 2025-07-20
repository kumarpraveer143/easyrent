import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaArrowLeft } from "react-icons/fa";

const PageNotFound = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="font-sans bg-gray-900 text-white min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-red-900 to-pink-900 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Icon */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative inline-block">
                <FaExclamationTriangle className="text-8xl sm:text-9xl md:text-[10rem] text-red-400 mx-auto transform hover:scale-110 transition-transform duration-500" />
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full opacity-20 blur-lg animate-pulse"></div>
              </div>
            </div>

            {/* 404 Number */}
            <div className={`mt-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white">
                <span className="block bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  404
                </span>
              </h1>
            </div>

            {/* Title */}
            <div className={`mt-4 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="block bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  Page Not Found
                </span>
              </h2>
            </div>

            {/* Description */}
            <div className={`mt-6 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Oops! The page you're looking for doesn't exist or has been moved.
                <br className="hidden sm:block" /> 
                Let's get you back on track to finding your perfect rental space.
              </p>
            </div>

            {/* Action Buttons */}
            <div className={`mt-12 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="transform hover:scale-105 transition-all duration-300">
                  <Link
                    to="/"
                    className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 rounded-lg shadow-2xl hover:shadow-red-500/25 transition-all duration-300"
                  >
                    <FaHome className="mr-2 h-5 w-5" />
                    <span className="relative z-10">Go to Home</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>

                <div className="transform hover:scale-105 transition-all duration-300">
                  <button
                    onClick={() => window.history.back()}
                    className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-white border-2 border-red-500 rounded-lg hover:bg-red-500 transition-all duration-300"
                  >
                    <FaArrowLeft className="mr-2 h-5 w-5" />
                    <span className="relative z-10">Go Back</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageNotFound;
