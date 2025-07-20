import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Loading from "../components/UI/Loading";
import { FaUser, FaEdit, FaSave, FaTimes, FaArrowLeft } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setFormData(storedUser);
    }
    setIsVisible(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      homeAddress: {
        ...prevData.homeAddress,
        [name]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      // Update user data in localStorage
      localStorage.setItem("user", JSON.stringify(formData));
      setUser(formData);
      toast.success("Profile Updated Successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong!");
    }
  };

  if (!user) {
    return (
      <div className="font-sans bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-900 text-white min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mb-6">
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Profile
            </span>
            <span className="block text-white mt-2">Management</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl mx-auto leading-relaxed">
            View and edit your profile information with our secure and user-friendly interface.
          </p>
          
          {/* User Type Badge */}
          <div className="mt-8 inline-block bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <FaUser className="text-white text-lg" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-400">Account Type</p>
                <p className="text-lg font-semibold text-white capitalize">{user.userType}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Form Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-700 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-600">
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all duration-300 hover:border-gray-500"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="p-4 bg-gray-800 border border-gray-600 rounded-xl text-white">
                      {user.name || "Not provided"}
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300">
                    Email Address
                  </label>
                  <div className="p-4 bg-gray-800 border border-gray-600 rounded-xl text-white">
                    {user.email}
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all duration-300 hover:border-gray-500"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="p-4 bg-gray-800 border border-gray-600 rounded-xl text-white">
                      {user.phoneNumber || "Not provided"}
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth?.split("T")[0] || ""}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white transition-all duration-300 hover:border-gray-500"
                    />
                  ) : (
                    <div className="p-4 bg-gray-800 border border-gray-600 rounded-xl text-white">
                      {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not provided"}
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  Address
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="street"
                      value={formData.homeAddress?.street || ""}
                      onChange={handleAddressChange}
                      className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all duration-300 hover:border-gray-500"
                      placeholder="Street Address"
                    />
                    <input
                      type="text"
                      name="city"
                      value={formData.homeAddress?.city || ""}
                      onChange={handleAddressChange}
                      className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all duration-300 hover:border-gray-500"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      name="state"
                      value={formData.homeAddress?.state || ""}
                      onChange={handleAddressChange}
                      className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all duration-300 hover:border-gray-500"
                      placeholder="State"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.homeAddress?.zipCode || ""}
                      onChange={handleAddressChange}
                      className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all duration-300 hover:border-gray-500"
                      placeholder="Zip Code"
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-gray-800 border border-gray-600 rounded-xl text-white">
                    {user.homeAddress?.street ? 
                      `${user.homeAddress.street}, ${user.homeAddress.city}, ${user.homeAddress.state} - ${user.homeAddress.zipCode}` : 
                      "Not provided"
                    }
                  </div>
                )}
              </div>

              {/* House Name (for landowners) */}
              {user?.userType === "landowner" && (
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300">
                    House Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="houseName"
                      value={formData.houseName || ""}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all duration-300 hover:border-gray-500"
                      placeholder="Enter house name"
                    />
                  ) : (
                    <div className="p-4 bg-gray-800 border border-gray-600 rounded-xl text-white">
                      {user.houseName || "Not provided"}
                    </div>
                  )}
                </div>
              )}

              {/* Aadhar Number */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  Aadhar Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="aadharCardNumber"
                    value={formData.aadharCardNumber || ""}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all duration-300 hover:border-gray-500"
                    placeholder="Enter Aadhar number"
                  />
                ) : (
                  <div className="p-4 bg-gray-800 border border-gray-600 rounded-xl text-white">
                    {user.aadharCardNumber || "Not provided"}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-12">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold text-white bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl shadow-2xl hover:shadow-gray-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    <FaTimes className="mr-2" />
                    <span className="relative z-10">Cancel</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <button
                    onClick={handleSave}
                    className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    <FaSave className="mr-2" />
                    <span className="relative z-10">Save Changes</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <FaEdit className="mr-2" />
                  <span className="relative z-10">Edit Profile</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}
              
              <Link
                to="/dashboard"
                className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold text-white border-2 border-blue-400 rounded-xl hover:bg-blue-400 transition-all duration-300 transform hover:scale-105"
              >
                <FaArrowLeft className="mr-2" />
                <span className="relative z-10">Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;