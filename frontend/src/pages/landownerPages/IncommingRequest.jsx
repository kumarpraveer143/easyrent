import React, { useEffect, useState } from "react";
import NoRequest from "./NoRequest";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaArrowLeft } from "react-icons/fa";
import Loading from "../../components/UI/Loading";

const IncomingRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roomId = location.state?.roomId;

  useEffect(() => {
    if (!roomId) return;

    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/request/users/${roomId}`, {
          withCredentials: true,
        });
        setRequests(response.data.users || []);
      } catch (err) {
        setError("Failed to load requests. Please try again.");
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [roomId]);

  const handleAccept = async (renterId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/relationship/accept`,
        { renterId, roomId },
        { withCredentials: true }
      );
      // Navigate to a specific page after accepting
      navigate("/landowner-rooms");
    } catch (err) {
      console.error("Error accepting request:", err);
      alert("Failed to accept request. Please try again.");
    }
  };

  const handleReject = async (renterId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/relationship/reject`,
        { renterId, roomId },
        { withCredentials: true }
      );
      // Remove the rejected request from the UI
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== renterId)
      );
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Failed to reject request. Please try again.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return <NoRequest />;
  }

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
            <div className="flex items-center justify-center mb-6">
              <button
                onClick={() => navigate("/landowner-rooms")}
                className="mr-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 group"
              >
                <FaArrowLeft className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              </button>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Incoming Requests
                </span>
              </h1>
            </div>
            <p className="mt-4 max-w-2xl text-lg text-gray-300 sm:text-xl mx-auto">
              Review and manage rental requests from potential tenants
            </p>
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 bg-opacity-20 rounded-full border border-blue-500">
              <span className="text-blue-300 text-sm font-medium">
                {requests.length} Request{requests.length !== 1 ? 's' : ''} Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {requests.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              onAccept={() => handleAccept(request._id)}
              onReject={() => handleReject(request._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Separate component for a single request card
const RequestCard = ({ request, onAccept, onReject }) => {
  const {
    name,
    email,
    phoneNumber,
    dateOfBirth,
    homeAddress: { street, city, state, zipCode },
  } = request;

  return (
    <div className="group bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-500 transform hover:-translate-y-2">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
            <FaUser className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{name}</h2>
            <p className="text-blue-100">Rental Applicant</p>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Contact Information */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <FaEnvelope className="h-5 w-5 text-blue-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-gray-300 font-medium">{email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaPhone className="h-5 w-5 text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-400">Phone</p>
              <p className="text-gray-300 font-medium">{phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="h-5 w-5 text-purple-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-400">Date of Birth</p>
              <p className="text-gray-300 font-medium">
                {new Date(dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FaMapMarkerAlt className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-400">Current Address</p>
              <p className="text-gray-300 font-medium">
                {street}, {city}, {state} - {zipCode}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-700 p-4 space-y-3">
        <div className="flex gap-3">
          <button
            onClick={onAccept}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2 group"
          >
            <FaCheckCircle className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            <span>Accept Request</span>
          </button>
          
          <button
            onClick={onReject}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center space-x-2 group"
          >
            <FaTimesCircle className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            <span>Reject Request</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingRequest;
