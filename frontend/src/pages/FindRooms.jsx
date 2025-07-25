import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaHome, FaMoneyBillWave, FaBed, FaBath, FaArrowRight, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SearchNoFound from "./SearchNoFound";
import Loading from "../components/UI/Loading";
import districtData from "../../public/utils/districtData.json";
import SearchRooms from "./SearchRooms";

const FindRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchState, setSearchState] = useState("");
  const [limit, setLimit] = useState(25);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [districts, setDistricts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRooms, setTotalRooms] = useState(0);

  // Indian states for dropdown
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  // Fetch rooms
  const fetchRooms = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/rooms/availableRoom`, {
        params: { limit, offset: (pageNum - 1) * limit },
        withCredentials: true,
      });
      const newRooms = response.data.message;
      setRooms(newRooms);
      setFilteredRooms(newRooms); // <-- Add this line
      // If backend provides total count, use it. Otherwise, estimate.
      const total = response.data.totalCount || (response.data.total || 0);
      if (total) {
        setTotalRooms(total);
        setTotalPages(Math.ceil(total / limit));
      } else {
        // Fallback: if no total, estimate pages by response length
        setTotalRooms((pageNum - 1) * limit + newRooms.length);
        setTotalPages(newRooms.length < limit ? pageNum : pageNum + 1);
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
    setLoading(false);
  }, [limit]);

  // Initial fetch and on page change
  useEffect(() => {
    fetchRooms(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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

  useEffect(() => {
    // On mount, set all districts from all states
    const allDistricts = districtData.states.flatMap((s) => s.districts);
    setDistricts(allDistricts);
  }, []);

  useEffect(() => {
    if (!searchState) {
      // If no state selected, show all districts
      const allDistricts = districtData.states.flatMap((s) => s.districts);
      setDistricts(allDistricts);
    } else {
      // Find the selected state and set its districts
      const found = districtData.states.find((s) => s.state === searchState);
      setDistricts(found ? found.districts : []);
      // If the selected district is not in the new list, clear it
      if (searchDistrict && !(found && found.districts.includes(searchDistrict))) {
        setSearchDistrict("");
      }
    }
  }, [searchState]);

  useEffect(() => {
    setFilteredRooms(rooms);
  }, [rooms]);

  const handleRoomSearch = async (district, state) => {
    setLoading(true);
    try {
      const params = {};
      if (district) params.district = district;
      if (state) params.state = state;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/search/district-state`, {
        params,
        withCredentials: true,
      });
      setRooms(response.data.rooms || []);
      setFilteredRooms(response.data.rooms || []);
      setTotalRooms((response.data.rooms || []).length);
      setTotalPages(1);
    } catch (err) {
      setRooms([]);
      setFilteredRooms([]);
      setTotalRooms(0);
      setTotalPages(1);
    }
    setLoading(false);
  };

  const handleClearRooms = async () => {
    setSearchDistrict("");
    setSearchState("");
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/rooms/availableRoom`, {
        withCredentials: true,
      });
      setRooms(response.data.message);
      setFilteredRooms(response.data.message);
      setTotalRooms((response.data.message || []).length);
      setTotalPages(1);
    } catch (err) {
      setRooms([]);
      setFilteredRooms([]);
      setTotalRooms(0);
      setTotalPages(1);
    }
    setLoading(false);
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

  // Pagination handlers
  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
      setCurrentPage(pageNum);
    }
  };

  const handleViewRoom = (roomId) => {
    navigate(`/viewRoomsDetails/${roomId}`);
  };

  if (loading) {
    return <Loading />;
  }

  const user = JSON.parse(localStorage.getItem("user"));

  // console.log("Rooms to render:", rooms);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-12 relative overflow-hidden pt-24">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
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
        <SearchRooms
          searchDistrict={searchDistrict}
          setSearchDistrict={setSearchDistrict}
          searchState={searchState}
          setSearchState={setSearchState}
          districts={districts}
          states={indianStates}
          onSearchRooms={handleRoomSearch}
          onClearRooms={handleClearRooms}
        />

        {/* Results Section */}
        {!loading && rooms.length === 0 ? (
          <div className="mt-8">
            <SearchNoFound />
          </div>
        ) : rooms.length > 0 ? (
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-2xl font-bold text-white mb-2 sm:mb-0">
                Available Rooms ({totalRooms})
              </h3>
              <div className="text-gray-300 text-sm">
                Showing {rooms.length} of {totalRooms}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRooms.map((room) => (
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
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${currentPage === 1 ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePageChange(num)}
                    className={`px-3 py-2 rounded-lg font-bold transition-all duration-300 ${currentPage === num ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-blue-500 hover:text-white'}`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${currentPage === totalPages ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FindRooms;
