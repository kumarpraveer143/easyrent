import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <div className="text-center relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Loading Container */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
          {/* Loading Text */}
          <h1 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Loading...
          </h1>

          {/* Enhanced Spinner */}
          <div className="flex justify-center items-center mb-4">
            <div className="relative">
              {/* Outer Ring */}
              <div className="w-16 h-16 border-4 border-gray-600 rounded-full animate-spin"></div>
              {/* Inner Ring */}
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
              {/* Center Dot */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>

          {/* Subtitle */}
          <p className="text-gray-400 text-sm mt-4 font-medium">
            Getting things ready, just a sec!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
