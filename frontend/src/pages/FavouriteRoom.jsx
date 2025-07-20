import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaMapMarkerAlt, FaBed, FaBath, FaMoneyBillWave, FaEye, FaHome, FaArrowLeft } from "react-icons/fa";
import NoRoomsFound from "./NoRoomsFound";
import Loading from "../components/UI/Loading";

const FavouriteRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchRooms = async () => {
      try {
        const cachedRooms = localStorage.getItem("favouriteRooms");
        if (cachedRooms) {
          setRooms(JSON.parse(cachedRooms));
        }
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/favourite/myfavourite`, {
          withCredentials: true,
        });
        const fetchedRooms = response.data.rooms;
        localStorage.setItem("favouriteRooms", JSON.stringify(fetchedRooms));

        setRooms(fetchedRooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
      setLoading(false);
    };
    fetchRooms();
  }, []);

  const navigate = useNavigate();

  const handleViewRoom = (roomId) => {
    navigate(`/viewRoomsDetails/${roomId}`); // Redirect to detailed room page
  };

  if (loading) {
    return <Loading />;
  }

  if (rooms.length == 0) {
    return <NoRoomsFound />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-gray-900 via-pink-900 to-red-900 py-8 relative overflow-hidden pt-24">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300 group"
            >
              <FaArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                  My Favourite Rooms
                </span>
              </h1>
              <p className="mt-2 text-gray-300 text-lg">
                Your saved properties ({rooms.length} {rooms.length === 1 ? 'room' : 'rooms'})
              </p>
            </div>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <div
              key={room?._id}
              className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden hover:shadow-3xl transition-all duration-500 group hover:scale-105"
            >
              {/* Image Section */}
              <div className="relative overflow-hidden">
                <img
                  src={room?.photos?.[0] || "/rooms/room1.jpg"}
                  alt="Room"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-l from-pink-600 to-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
                  ₹{room?.rentPrice}/month
                </div>
                <div className="absolute top-4 left-4">
                  {room?.isAvailable ? (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-lg font-medium text-xs flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Available</span>
                    </div>
                  ) : (
                    <div className="bg-red-500 text-white px-2 py-1 rounded-lg font-medium text-xs flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Not Available</span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4">
                {/* Room Type and Price */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-2 capitalize">
                    {room?.roomType} Room
                  </h2>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <FaHome className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">{room?.owner?.houseName}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-2 text-gray-300">
                  <FaMapMarkerAlt className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-sm">
                    {room?.address?.street}, {room?.address?.city}, {room?.address?.state}
                  </span>
                </div>

                {/* Room Features */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <FaBed className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">{room?.numberOfRooms} Rooms</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <FaBath className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm">{room?.numberOfBathrooms} Bath</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <FaMoneyBillWave className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-bold text-lg">₹{room?.rentPrice}</span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewRoom(room._id)}
                  className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 px-4 rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <FaEye className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavouriteRoom;
