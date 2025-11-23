import React from "react";
import { FaInbox, FaArrowLeft, FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const NoRequest = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header Section */}
      <div className="bg-white py-16 relative overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/landowner-rooms")}
              className="flex items-center space-x-2 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 px-4 py-2 rounded-xl transition-all duration-300 group font-medium shadow-sm"
            >
              <FaArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back</span>
            </button>

            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-2">
                No Incoming Requests
              </h1>
              <p className="text-gray-600 text-lg">
                No rental requests at the moment
              </p>
            </div>

            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-16 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-6">
                <FaInbox className="w-12 h-12 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                No Requests Available
              </h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                You currently have no incoming requests. Once new requests arrive, they will appear here for your review.
              </p>
            </div>

            <div className="space-y-4">
              <Link to="/landowner-rooms">
                <button className="bg-gray-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 group transform hover:scale-105 mx-auto shadow-md">
                  <FaArrowLeft className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span>Back to My Rooms</span>
                </button>
              </Link>

              <div className="flex items-center justify-center space-x-2 text-gray-500">
                <FaBell className="h-4 w-4 animate-pulse" />
                <span className="text-sm">New requests will appear here automatically</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoRequest;
