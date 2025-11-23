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
  FaCalendar,
  FaInfoCircle,
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header Section */}
      <div className="bg-white py-16 relative overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-teal-50 opacity-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 px-4 py-2 rounded-xl transition-all duration-300 group font-medium shadow-sm"
            >
              <FaArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back</span>
            </button>

            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-2">
                My Current Room
              </h1>
              <p className="text-gray-600 text-lg">
                Your rented property details
              </p>
            </div>

            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Monthly Rent Highlight - Top Banner */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <FaMoneyBillWave className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Monthly Rent</p>
                <p className="text-white font-bold text-3xl">₹{rentPrice}</p>
              </div>
            </div>
            <button
              onClick={() => handleCheckHistory(roomDetails._id)}
              className="bg-white text-green-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center space-x-2 group shadow-md"
            >
              <FaHistory className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Payment History</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property & Room Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Information Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-5">
                <div className="flex items-center space-x-2">
                  <FaBuilding className="h-5 w-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Property Information</h2>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-50 p-3 rounded-xl">
                    <FaHome className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm font-medium mb-1">Property Name</p>
                    <p className="text-gray-900 font-bold text-xl">{houseName}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <FaMapMarkerAlt className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm font-medium mb-1">Full Address</p>
                    <p className="text-gray-900 font-semibold">
                      {address.street}, {address.city}, {address.state} - {address.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Details Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5">
                <div className="flex items-center space-x-2">
                  <FaDoorOpen className="h-5 w-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Room Details</h2>
                </div>
              </div>

              <div className="p-6">
                {/* Room Number Highlight */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border border-purple-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">{roomNumber}</span>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Your Room Number</p>
                      <p className="text-gray-900 font-bold text-2xl">Room {roomNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaBuilding className="h-5 w-5 text-blue-500" />
                      <p className="text-gray-500 text-sm font-medium">Type</p>
                    </div>
                    <p className="text-gray-900 font-bold text-lg capitalize">{roomType}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaBed className="h-5 w-5 text-cyan-500" />
                      <p className="text-gray-500 text-sm font-medium">Bedrooms</p>
                    </div>
                    <p className="text-gray-900 font-bold text-lg">{numberOfRooms}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaBath className="h-5 w-5 text-teal-500" />
                      <p className="text-gray-500 text-sm font-medium">Bathrooms</p>
                    </div>
                    <p className="text-gray-900 font-bold text-lg">{numberOfBathrooms}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Owner Details */}
          <div className="space-y-6">
            {/* Owner Details Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-5">
                <div className="flex items-center space-x-2">
                  <FaUser className="h-5 w-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Landowner Contact</h2>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <FaUser className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs font-medium mb-1">Name</p>
                    <p className="text-gray-900 font-bold">{ownerName}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg">
                    <FaEnvelope className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs font-medium mb-1">Email</p>
                    <p className="text-gray-900 font-semibold text-sm break-all">{ownerEmail}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-red-50 p-2 rounded-lg">
                    <FaPhone className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs font-medium mb-1">Phone</p>
                    <p className="text-gray-900 font-bold">{ownerNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-start space-x-3">
                <FaInfoCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-gray-900 font-bold mb-2">Need Help?</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    For any issues or queries regarding your room, payment, or maintenance, please contact your landowner using the details provided above.
                  </p>
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
