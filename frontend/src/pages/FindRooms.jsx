import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { FaMapMarkerAlt, FaHome, FaMoneyBillWave, FaBed, FaBath, FaArrowRight, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NoRoomsFound from "./NoRoomsFound";
import Loading from "../components/UI/Loading";

const FindRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchState, setSearchState] = useState("");
  const [limit, setLimit] = useState(25);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Indian states for dropdown
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  useEffect(() => {
    setLoading(true);
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/rooms/availableRoom`, {
          withCredentials: true,
        });
        setRooms(response.data.message);
        setFilteredRooms(response.data.message);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
      setLoading(false);
    };
    fetchRooms();
  }, []);

  const handleSearch = () => {
    if (searchDistrict.trim() === "" && searchState.trim() === "") {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter((room) => {
        const districtMatch = searchDistrict.trim() === "" || 
          room.address.city.toLowerCase().includes(searchDistrict.toLowerCase());
        const stateMatch = searchState.trim() === "" || 
          room.address.state.toLowerCase().includes(searchState.toLowerCase());
        return districtMatch && stateMatch;
      });
      setFilteredRooms(filtered);
    }
  };

  const handleClearSearch = () => {
    setSearchDistrict("");
    setSearchState("");
    setFilteredRooms(rooms);
  };

  const roomTypeToImage = {
    'single': '/rooms/room1.jpg',
    'studio': '/rooms/room2.jpg',
    'apartment': '/rooms/room3.jpg',
    'shared': '/rooms/room4.jpeg',
  };

  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 25);
  };

  const handleViewRoom = (roomId) => {
    navigate(`/viewRoomsDetails/${roomId}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (!loading && filteredRooms.length === 0) {
    return <NoRoomsFound />;
  }

  const user = JSON.parse(localStorage.getItem("user"));

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
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mb-4">
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Find Your Perfect Room
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-300 sm:text-xl mx-auto">
              Browse through our collection of available rooms and find your ideal living space
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                  <input
                    type="text"
                    placeholder="Enter district name..."
                    value={searchDistrict}
                    onChange={(e) => setSearchDistrict(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  />
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
                    {indianStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSearch}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <FiSearch className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Search Rooms</span>
              </button>
              
              <button
                onClick={handleClearSearch}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <span>Clear Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {filteredRooms.length > 0 && (
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-2xl font-bold text-white mb-2 sm:mb-0">
                Available Rooms ({filteredRooms.length})
              </h3>
              <div className="text-gray-300 text-sm">
                Showing {Math.min(limit, filteredRooms.length)} of {filteredRooms.length}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRooms.slice(0, limit).map((room) => (
                <div
                  key={room._id}
                  className="group bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="relative">
                    <img
                      src={roomTypeToImage[room.roomType.toLowerCase()] || '/rooms/room1.jpeg'}
                      alt="Room"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-purple-600 text-white px-3 py-1 rounded-bl-lg font-medium text-sm">
                      ₹{room.rentPrice}/month
                    </div>
                    <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 rounded-br-lg font-medium text-sm">
                      Available
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 capitalize">
                        {room.roomType} Room
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-300 text-sm">
                        <FaMapMarkerAlt className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        <span className="truncate">{room.address.city}, {room.address.state}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <FaBed className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{room.numberOfRooms} Rooms</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaBath className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{room.numberOfBathrooms} Bath</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FaMoneyBillWave className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-green-400 font-semibold">₹{room.rentPrice}/month</span>
                    </div>
                    
                    {user ? (
                      <button
                        onClick={() => handleViewRoom(room._id)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2 group"
                      >
                        <span>View Details</span>
                        <FaArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate("/login")}
                        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 group"
                      >
                        <span>Login to View Room</span>
                        <FaArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {limit < filteredRooms.length && (
              <div className="mt-10 text-center">
                <button
                  onClick={handleLoadMore}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                >
                  Load More Rooms
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindRooms;
