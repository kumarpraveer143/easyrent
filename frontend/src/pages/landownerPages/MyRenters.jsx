import React, { useEffect, useState } from "react";
import { FaHistory, FaMoneyBillWave, FaTrashAlt, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaHome, FaBed, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import NoRenters from "./NoRenters";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/UI/Loading";

const MyRenters = () => {
  const [renters, setRenters] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response = await axios.get(`${import.meta.env.VITE_API_URL}/relationship/getRenters`, {
          withCredentials: true,
        });
        let activeRenters = response.data.renters.filter(
          (item) => item.renterStatus === "active"
        );
        setRenters(activeRenters);
      } catch (err) {
        console.error("Error fetching renters", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCheckHistory = (relationId) => {
    navigate(`/check-history/${relationId}`);
  };

  const handleAddRent = (relationId, rentPrice) => {
    navigate(`/add-rent/${relationId}`, {
      state: {
        rentPrice,
      },
    });
  };

  const handleRemoveRenter = async (relationId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will Archive renter!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Archive it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/relationship/removeRenter`,
          { relationId },
          { withCredentials: true }
        );

        if (response.status === 200) {
          setRenters((prevRenters) =>
            prevRenters.filter((renter) => renter.relationId !== relationId)
          );
        }

        toast.success("Renter removed successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to remove renter. Please try again.");
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (renters.length === 0) {
    return <NoRenters />;
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
                onClick={() => navigate("/dashboard")}
                className="mr-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 group"
              >
                <FaArrowLeft className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              </button>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  My Renters
                </span>
              </h1>
            </div>
            <p className="mt-4 max-w-2xl text-lg text-gray-300 sm:text-xl mx-auto">
              Manage your active tenants and rental relationships
            </p>
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-green-600 bg-opacity-20 rounded-full border border-green-500">
              <span className="text-green-300 text-sm font-medium">
                {renters.length} Active Renter{renters.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Renters Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {renters.map((renter) => (
            <RenterCard
              key={renter.relationId}
              renter={renter}
              onCheckHistory={() => handleCheckHistory(renter.relationId)}
              onAddRent={() => handleAddRent(renter.relationId, renter.roomDetails.rentPrice)}
              onRemoveRenter={() => handleRemoveRenter(renter.relationId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Separate component for a single renter card
const RenterCard = ({ renter, onCheckHistory, onAddRent, onRemoveRenter }) => {
  const { renterDetails, roomDetails } = renter;

  return (
    <div className="group bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-500 transform hover:-translate-y-2">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
              <FaUser className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{renterDetails.name}</h2>
              <p className="text-blue-100">Active Tenant</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              Room {roomDetails.roomNumber}
            </div>
            <div className="text-blue-100 capitalize">{roomDetails.roomType}</div>
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
              <p className="text-gray-300 font-medium">{renterDetails.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaPhone className="h-5 w-5 text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-400">Phone</p>
              <p className="text-gray-300 font-medium">{renterDetails.phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="h-5 w-5 text-purple-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-400">Date of Birth</p>
              <p className="text-gray-300 font-medium">
                {new Date(renterDetails.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FaMapMarkerAlt className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-400">Address</p>
              <p className="text-gray-300 font-medium">
                {renterDetails.homeAddress.street}, {renterDetails.homeAddress.city}, {renterDetails.homeAddress.state} - {renterDetails.homeAddress.zipCode}
              </p>
            </div>
          </div>
        </div>

        {/* Room Details */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <FaHome className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Room Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <FaBed className="h-5 w-5 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Room Type</p>
                <p className="text-gray-300 font-medium capitalize">{roomDetails.roomType}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaMoneyBillWave className="h-5 w-5 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Rent Price</p>
                <p className="text-gray-300 font-medium">₹{roomDetails.rentPrice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-700 p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onCheckHistory}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 group"
          >
            <FaHistory className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm">History</span>
          </button>
          
          <button
            onClick={onAddRent}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2 group"
          >
            <FaMoneyBillWave className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm">Add Rent</span>
          </button>
          
          <button
            onClick={onRemoveRenter}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center space-x-2 group"
          >
            <FaTrashAlt className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyRenters;
