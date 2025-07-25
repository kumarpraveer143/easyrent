import React, { useState } from "react";
import { FaMapMarkerAlt, FaFilter } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

const SearchRooms = ({
  searchDistrict,
  setSearchDistrict,
  searchState,
  setSearchState,
  districts,
  states,
  onSearchRooms,
  onClearRooms,
}) => {
  const [emptySearchMsg, setEmptySearchMsg] = useState("");

  const handleSearchClick = () => {
    if (!searchDistrict && !searchState) {
      setEmptySearchMsg("Please select a district or state to search.");
      return;
    }
    setEmptySearchMsg("");
    onSearchRooms(searchDistrict, searchState);
  };
  const handleClear = () => {
    setEmptySearchMsg("");
    onClearRooms();
  };
  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="flex items-center space-x-3">
          <FaFilter className="h-6 w-6 text-white" />
          <h2 className="text-2xl font-bold text-white">Search Rooms</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">District</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
              <select
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors duration-300"
              >
                <option value="">Select District</option>
                {districts.map((district, index) => (
                  <option key={`${district}-${index}`} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
              <select
                value={searchState}
                onChange={(e) => setSearchState(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors duration-300"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSearchClick}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2 group"
          >
            <FiSearch className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Search Rooms</span>
          </button>

          <button
            onClick={handleClear}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 group"
          >
            <span>Clear Search</span>
          </button>
        </div>
        {emptySearchMsg && (
          <div className="text-yellow-400 mt-4 text-center">{emptySearchMsg}</div>
        )}
      </div>
    </div>
  );
};

export default SearchRooms; 