import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa"; // Importing React Icon

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-800">
      {/* Main Content */}
      <div className="text-blue-500 mb-4">
        <FaExclamationTriangle size={80} />
      </div>
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 text-center mb-6 px-4">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Back to Home Button */}
      <Link
        to="/"
        className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
