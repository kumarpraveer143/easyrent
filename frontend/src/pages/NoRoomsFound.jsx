import React from "react";
import { FaRegSadTear } from "react-icons/fa";
import { Link } from "react-router-dom";

const NoRoomsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        {/* Icon */}
        <FaRegSadTear className="text-center text-blue-500 text-6xl sm:text-8xl md:text-9xl" />

        {/* Title */}
        <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
          No Rooms Found
        </h1>

        {/* Description */}
        <p className="mt-4 text-gray-600 text-sm sm:text-lg md:text-xl">
          It seems there are no rooms available at the moment.
          <br className="hidden sm:block" /> Please check back later or add new
          rooms.
        </p>

        {/* Dashboard Button */}
        <Link
          to="/dashboard"
          className="mt-8 inline-block px-4 py-2 sm:px-6 sm:py-3 bg-gray-800 text-white rounded-lg shadow-md text-sm sm:text-base hover:bg-gray-600 focus:ring-2 focus:ring-gray-400 focus:outline-none"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NoRoomsFound;
