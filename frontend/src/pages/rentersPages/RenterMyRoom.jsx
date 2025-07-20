import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaHistory,
  FaHome,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaMoneyBillWave,
  FaArrowLeft,
  FaBuilding,
  FaDoorOpen,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import NoRoomsFound from "../NoRoomsFound";
import Loading from "../../components/UI/Loading";

const RenterMyRoom = () => {
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckHistory = (roomId) => {
    navigate("/renter-history");
  };

  useEffect(() => {
    setLoading(true);
    const getRoomDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/relationship/getRoomDetails`,
          {
            withCredentials: true,
          }
        );
        setRoom(response.data.room);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
      setLoading(false);
    };

    getRoomDetails();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!room) {
    return <NoRoomsFound />;
  }

  const { houseName, ownerNumber, ownerName, ownerEmail, roomDetails } = room;
  const {
    address,
    rentPrice,
    roomType,
    numberOfRooms,
    numberOfBathrooms,
    roomNumber,
  } = roomDetails;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-gray-900 via-green-900 to-teal-900 py-8 relative overflow-hidden pt-24">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
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
                <span className="block bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                  My Current Room
                </span>
              </h1>
              <p className="mt-2 text-gray-300 text-lg">
                Your rented property details
              </p>
            </div>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Information Card */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
              <div className="flex items-center space-x-3">
                <FaBuilding className="h-6 w-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Property Information</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <FaHome className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-gray-300 text-sm">Property Name</p>
                  <p className="text-white font-bold text-lg">{houseName}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Address</p>
                  <p className="text-white text-sm">
                    {address.street}, {address.city}, {address.state} - {address.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Details Card */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <div className="flex items-center space-x-3">
                <FaUser className="h-6 w-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Owner Details</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <FaUser className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-gray-300 text-sm">Name</p>
                  <p className="text-white font-semibold">{ownerName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaEnvelope className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-gray-300 text-sm">Email</p>
                  <p className="text-white font-semibold">{ownerEmail}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaPhone className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-gray-300 text-sm">Contact Number</p>
                  <p className="text-white font-semibold">{ownerNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Room Details Card */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden lg:col-span-2">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <div className="flex items-center space-x-3">
                <FaDoorOpen className="h-6 w-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Room Details</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{roomNumber}</span>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Room Number</p>
                    <p className="text-white font-bold text-lg">{roomNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FaBuilding className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-gray-300 text-sm">Room Type</p>
                    <p className="text-white font-semibold capitalize">{roomType}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FaBed className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-gray-300 text-sm">Number of Rooms</p>
                    <p className="text-white font-semibold">{numberOfRooms}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FaBath className="h-5 w-5 text-teal-400" />
                  <div>
                    <p className="text-gray-300 text-sm">Number of Bathrooms</p>
                    <p className="text-white font-semibold">{numberOfBathrooms}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaMoneyBillWave className="h-6 w-6 text-white" />
                    <div>
                      <p className="text-white text-sm opacity-90">Monthly Rent</p>
                      <p className="text-white font-bold text-2xl">₹{rentPrice}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCheckHistory(roomDetails._id)}
                    className="bg-white text-green-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 group"
                  >
                    <FaHistory className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>Check History</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenterMyRoom;
