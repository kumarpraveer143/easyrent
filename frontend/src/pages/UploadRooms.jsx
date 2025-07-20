import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHome, FaMapMarkerAlt, FaMoneyBillWave, FaBed, FaBath, FaBuilding, FaHashtag, FaUpload, FaArrowLeft } from "react-icons/fa";

const UploadRooms = () => {
  const navigate = useNavigate();
  const [districtData, setDistrictData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [availableDistricts, setAvailableDistricts] = useState([]);

  useEffect(() => {
    fetch("/utils/districtData.json")
      .then((response) => response.json())
      .then((data) => setDistrictData(data.states))
      .catch((error) => console.error("Error fetching the data:", error));
  }, []);

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const [formData, setFormData] = useState({
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    rentPrice: "",
    roomType: "",
    numberOfRooms: "",
    numberOfBathrooms: "",
    roomNumber: "",
    // photos: [],
    isAvailable: true,
  });

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setSelectedState(selectedState);

    const stateData = districtData.find(
      (state) => state.state === selectedState
    );
    setAvailableDistricts(stateData ? stateData.districts : []);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // const handleFileUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   if (files.length > 6) {
  //     alert("You can only upload up to 6 images.");
  //     return;
  //   }
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     // photos: files,
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/rooms/`, formData, {
        withCredentials: true,
      });
      // console.log("Response:", response.data); // Handle the response
      toast.success("Room Registered Successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("Something went wrong:", err.message); // Log detailed error
      toast.error("Something went wrong");
    }
  };

  let user = JSON.parse(localStorage.getItem("user"));
  const houseName = user?.houseName;

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
                  Upload Room Details
                </span>
              </h1>
            </div>
            <p className="mt-4 max-w-2xl text-lg text-gray-300 sm:text-xl mx-auto">
              Add your property to our platform and connect with potential tenants
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
                <FaHome className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{houseName}</h2>
                <p className="text-blue-100">Property Registration Form</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Address Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <FaMapMarkerAlt className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Property Address</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                    placeholder="Enter street address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                  <select
                    name="address.state"
                    value={formData.address.state}
                    onChange={(e) => {
                      handleInputChange(e);
                      handleStateChange(e);
                    }}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  >
                    <option value="" disabled>Select a state</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">District</label>
                  <select
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  >
                    <option value="" disabled>Select a district</option>
                    {availableDistricts.map((district, index) => (
                      <option key={index} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Zip Code</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                    placeholder="Enter zip code"
                  />
                </div>
              </div>
            </div>

            {/* Property Details Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <FaBuilding className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">Property Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rent Price (₹)</label>
                  <div className="relative">
                    <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                    <input
                      type="number"
                      name="rentPrice"
                      value={formData.rentPrice}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                      placeholder="Enter rent amount"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Room Type</label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  >
                    <option value="" disabled>Select room type</option>
                    <option value="single">Single</option>
                    <option value="shared">Shared</option>
                    <option value="studio">Studio</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Room Number <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <FaHashtag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                    <input
                      type="text"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                      placeholder="E.g. 101, A1, B2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Number of Rooms</label>
                  <div className="relative">
                    <FaBed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                    <input
                      type="number"
                      name="numberOfRooms"
                      value={formData.numberOfRooms}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                      placeholder="Number of rooms"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Number of Bathrooms</label>
                  <div className="relative">
                    <FaBath className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                    <input
                      type="number"
                      name="numberOfBathrooms"
                      value={formData.numberOfBathrooms}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                      placeholder="Number of bathrooms"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2 group transform hover:scale-105"
              >
                <FaUpload className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Upload Property</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadRooms;
