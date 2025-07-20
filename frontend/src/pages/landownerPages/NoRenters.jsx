import React from "react";
import { MdOutlineGroupOff } from "react-icons/md";
import { FaArrowLeft, FaUsers } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const NoRenters = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-12 relative overflow-hidden pt-24">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <button
                onClick={() => navigate("/dashboard")}
                className="mr-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 group"
              >
                <FaArrowLeft className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              </button>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  No Renters Found
                </span>
              </h1>
            </div>
            <p className="mt-4 max-w-2xl text-lg text-gray-300 sm:text-xl mx-auto">
              No active tenants at the moment
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="p-12 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 group">
                <MdOutlineGroupOff className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                No Active Renters
              </h2>
              <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
                There are currently no active renters in your properties. New tenants will appear here once they are assigned to rooms.
              </p>
            </div>
            
            <div className="space-y-4">
              <Link to="/dashboard">
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-8 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2 group transform hover:scale-105 mx-auto">
                  <FaArrowLeft className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span>Back to Dashboard</span>
                </button>
              </Link>
              
              <div className="flex items-center justify-center space-x-2 text-gray-400">
                <FaUsers className="h-4 w-4 animate-pulse" />
                <span className="text-sm">Active renters will appear here automatically</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoRenters;
