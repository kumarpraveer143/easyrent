import React, { useEffect, useState } from "react";
import { FaHistory, FaMoneyBillWave, FaTrashAlt, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaHome, FaBed, FaArrowLeft, FaArchive } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import NoRenters from "./NoRenters";
import Loading from "../../components/UI/Loading";
import { useNavigate } from "react-router-dom";

const ArchievedRenters = () => {
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
        let archivedRenters = response.data.renters.filter(
          (item) => item.renterStatus === "archive"
        );
        setRenters(archivedRenters);
      } catch (err) {
        console.error("Error fetching renters:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCheckHistory = (relationId) => {
    navigate(`/check-history/${relationId}`);
  };

  const handleRemoveRenter = async (relationId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently remove the renter!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/relationship/deleteRenter/${relationId}`,
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header Section */}
      <div className="bg-white py-16 relative overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-2 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 px-4 py-2 rounded-xl transition-all duration-300 group font-medium shadow-sm"
            >
              <FaArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back</span>
            </button>

            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-2">
                Archived Renters
              </h1>
              <p className="text-gray-600 text-lg">
                View archived tenant records
              </p>
            </div>

            <div className="w-20"></div>
          </div>

          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center px-5 py-2 bg-orange-100 rounded-full border border-orange-200">
              <span className="text-orange-700 text-sm font-bold">
                {renters.length} Archived Renter{renters.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Renters Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renters.map((renter) => (
            <ArchivedRenterCard
              key={renter.relationId}
              renter={renter}
              onCheckHistory={() => handleCheckHistory(renter.relationId)}
              onRemoveRenter={() => handleRemoveRenter(renter.relationId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Separate component for a single archived renter card
const ArchivedRenterCard = ({ renter, onCheckHistory, onRemoveRenter }) => {
  const { renterDetails, roomDetails } = renter;

  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 hover:-translate-y-1">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-xl bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-sm">
              <FaArchive className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{renterDetails.name}</h2>
              <p className="text-orange-100 text-sm">Archived Tenant</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              Room {roomDetails.roomNumber}
            </div>
            <div className="text-orange-100 capitalize text-sm">{roomDetails.roomType}</div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-4">
        {/* Contact Information */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaEnvelope className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium">Email</p>
              <p className="text-gray-900 font-semibold text-sm truncate">{renterDetails.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaPhone className="h-5 w-5 text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Phone</p>
              <p className="text-gray-900 font-semibold">{renterDetails.phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaCalendarAlt className="h-5 w-5 text-purple-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
              <p className="text-gray-900 font-semibold">
                {new Date(renterDetails.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaMapMarkerAlt className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium mb-1">Address</p>
              <p className="text-gray-900 font-semibold text-sm">
                {renterDetails.homeAddress.street}, {renterDetails.homeAddress.city}, {renterDetails.homeAddress.state} - {renterDetails.homeAddress.zipCode}
              </p>
            </div>
          </div>
        </div>

        {/* Room Details */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
          <div className="flex items-center space-x-3 mb-3">
            <FaHome className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-bold text-gray-900">Room Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <FaBed className="h-5 w-5 text-orange-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Room Type</p>
                <p className="text-gray-900 font-bold capitalize">{roomDetails.roomType}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaMoneyBillWave className="h-5 w-5 text-orange-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Rent Price</p>
                <p className="text-gray-900 font-bold">₹{roomDetails.rentPrice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-50 p-4 border-t border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onCheckHistory}
            className="bg-primary-600 text-white py-2.5 px-4 rounded-xl hover:bg-primary-700 transition-all duration-300 flex items-center justify-center space-x-2 group font-medium shadow-md"
          >
            <FaHistory className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm">View History</span>
          </button>

          <button
            onClick={onRemoveRenter}
            className="bg-red-600 text-white py-2.5 px-4 rounded-xl hover:bg-red-700 transition-all duration-300 flex items-center justify-center space-x-2 group font-medium shadow-md"
          >
            <FaTrashAlt className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchievedRenters;
