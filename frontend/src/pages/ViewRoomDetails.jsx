import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart, FaPaperPlane, FaTimes, FaArrowLeft, FaHome, FaMapMarkerAlt, FaBed, FaBath, FaMoneyBillWave, FaUser, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../components/UI/Loading";
import Swal from "sweetalert2";

const ViewRoomDetails = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [isEngaged, setEngaged] = useState(false);

  const roomTypeToImage = {
    single: "/rooms/room1.jpg",
    double: "/rooms/room2.jpg",
    apartment: "/rooms/room3.jpg",
    shared: "/rooms/room4.jpeg",
  };

  useEffect(() => {
    const isRequest = async () => {
      try {
        const req = await axios.get(`${import.meta.env.VITE_API_URL}/request/${roomId}`, {
          withCredentials: true,
        });
        const isEngaged = await axios.get(`${import.meta.env.VITE_API_URL}/relationship/engaged`, { withCredentials: true, });
        setEngaged(isEngaged.data.message);
        setHasRequested(req.data.message);
      } catch (err) {
        console.log(err);
      }
    };
    isRequest();
  }, []);

  useEffect(() => {
    const isFabRoom = async () => {
      try {
        const response = await axios(
          `${import.meta.env.VITE_API_URL}/favourite/isFabRoom/${roomId}`,
          { withCredentials: true }
        );
        setIsFavorite(response.data ? true : false);
      } catch (err) {
        console.log(err);
      }
    };
    isFabRoom();
  }, [roomId]);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/rooms/roomDetails/${roomId}`,
          { withCredentials: true }
        );
        setRoomDetails(response.data.room);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };  

    fetchRoomDetails();
  }, [roomId]);

  const handleToggleFavorite = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/favourite/toggle/${roomId}`,
        { withCredentials: true }
      );
      toast.success(
        isFavorite ? "Removed from favourites" : "Added to favourites"
      );
    } catch (err) {
      console.log(err);
    }
    setIsFavorite((prevState) => !prevState);
  };

  const handleRequest = async () => {
    try {
      if (isEngaged) {
        toast.error("You are already occupying another room, so you can't make a request!");
        return;
      }
      // SweetAlert2 confirmation dialog with improved UI
      const result = await Swal.fire({
        title: hasRequested ? "Withdraw Request?" : "Send Request to Landowner?",
        html: `
          <div class="text-left">
            <div class="mb-4 p-4 bg-gray-100 rounded-lg">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-800">${roomDetails.owner.name}</h3>
                  <p class="text-sm text-gray-600">Landowner</p>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  <span class="text-sm text-gray-700">${roomDetails.owner.houseName}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span class="text-sm text-gray-700">${roomDetails.address.street}, ${roomDetails.address.city}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                  <span class="text-sm text-gray-700">₹${roomDetails.rentPrice}/month</span>
                </div>
              </div>
            </div>
            <p class="text-gray-600 text-sm">
              ${hasRequested 
                ? "This will withdraw your request for this room. You can send a new request later if needed." 
                : "This will send a request to the landowner. They will review your request and get back to you soon."}
            </p>
          </div>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: hasRequested ? "Yes, Withdraw" : "Yes, Send Request",
        cancelButtonText: "Cancel",
        confirmButtonColor: hasRequested ? "#ef4444" : "#3b82f6",
        cancelButtonColor: "#6b7280",
        background: "#ffffff",
        backdrop: "rgba(0, 0, 0, 0.8)",
        customClass: {
          popup: "rounded-2xl shadow-2xl",
          title: "text-2xl font-bold text-gray-800",
          confirmButton: "rounded-lg font-semibold px-6 py-3",
          cancelButton: "rounded-lg font-semibold px-6 py-3"
        },
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/request/${roomId}`,
            {},
            { withCredentials: true }
          );
          console.log(response.data);
        } catch (err) {
          console.log(err);
        }

        toast.success(
          hasRequested ? "Request withdrawn" : "Request sent to landowner"
        );
        // Toggle the request state
        setHasRequested((prevState) => !prevState);
      } else {
        toast.info("Action cancelled");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error processing request");
    }
  };

  if (!roomDetails) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-8 relative overflow-hidden pt-24">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
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
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Room Details
                </span>
              </h1>
            </div>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="relative group">
              <img
                src={roomTypeToImage[roomDetails.roomType.toLowerCase()] || "/rooms/room1.jpg"}
                alt="Room"
                className="w-full h-80 lg:h-96 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-gradient-to-l from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                ₹{roomDetails.rentPrice}/month
              </div>
              <div className="absolute top-4 left-4">
                {roomDetails.isAvailable ? (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-lg font-medium text-sm flex items-center space-x-1">
                    <FaCheckCircle className="h-4 w-4" />
                    <span>Available</span>
                  </div>
                ) : (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-lg font-medium text-sm flex items-center space-x-1">
                    <FaTimesCircle className="h-4 w-4" />
                    <span>Not Available</span>
                  </div>
                )}
              </div>
            </div>


          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* House and Room Info */}
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div className="flex items-center space-x-3">
                  <FaHome className="h-6 w-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">Property Information</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 capitalize">
                    {roomDetails.roomType} Room
                  </h3>
                  <p className="text-gray-300 text-lg">
                    House: <span className="text-blue-400 font-semibold">{roomDetails.owner.houseName}</span>
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-300">
                  <FaUser className="h-5 w-5 text-purple-400" />
                  <span>Owner: <span className="text-purple-400 font-semibold">{roomDetails.owner.name}</span></span>
                </div>
                
                <div className="flex items-start space-x-2 text-gray-300">
                  <FaMapMarkerAlt className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <span>
                    {roomDetails.address.street}, {roomDetails.address.city}, {roomDetails.address.state}, {roomDetails.address.zipCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Room Features */}
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
                <div className="flex items-center space-x-3">
                  <FaBed className="h-6 w-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">Room Features</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <FaBed className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-gray-300 text-sm">Number of Rooms</p>
                      <p className="text-white font-semibold">{roomDetails.numberOfRooms}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FaBath className="h-5 w-5 text-cyan-400" />
                    <div>
                      <p className="text-gray-300 text-sm">Number of Bathrooms</p>
                      <p className="text-white font-semibold">{roomDetails.numberOfBathrooms}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center space-x-3">
                  <FaMoneyBillWave className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-gray-300 text-sm">Monthly Rent</p>
                    <p className="text-green-400 font-bold text-xl">₹{roomDetails.rentPrice}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
                <div className="flex items-center space-x-3">
                  <FaPaperPlane className="h-6 w-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">Actions</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleToggleFavorite}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    {isFavorite ? (
                      <>
                        <FaHeart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                        <span>Remove from Favorites</span>
                      </>
                    ) : (
                      <>
                        <FaRegHeart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                        <span>Add to Favorites</span>
                      </>
                    )}
                  </button>

                  {roomDetails.isAvailable === true && (
                    <button
                      onClick={handleRequest}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2 group"
                    >
                      {hasRequested ? (
                        <>
                          <FaTimes className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                          <span>Withdraw Request</span>
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                          <span>Request Landowner</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRoomDetails;
