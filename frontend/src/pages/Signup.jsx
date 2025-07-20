import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupRenters = () => {
  const [userType, setUserType] = useState("renter");
  const [districtData, setDistrictData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetch('/utils/districtData.json')
      .then((response) => response.json())
      .then((data) => setDistrictData(data.states))
      .catch((error) => console.error('Error fetching the data:', error));
  }, []);

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const [formData, setFormData] = useState({
    userType: "renter",
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    houseName: "",
    homeAddress: {
      street: "",
      state: "",
      city: "",
      zipCode: "",
    },
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle state selection
    if (name === 'homeAddress.state') {
      const stateData = districtData.find((state) => state.state === value);
      setAvailableDistricts(stateData ? stateData.districts : []);

      setFormData((prevData) => ({
        ...prevData,
        homeAddress: {
          ...prevData.homeAddress,
          state: value,
          city: "", // Reset city when state changes
        },
      }));

      return; // Exit early since we handled it above
    }

    // Handle address fields
    if (name.startsWith("homeAddress.")) {
      const addressField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        homeAddress: {
          ...prevData.homeAddress,
          [addressField]: value,
        },
      }));
    } else {
      // Handle other fields
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, formData);

      if (response.status === 200) {
        toast.success("User registered successfully");
        navigate("/login");
      } else {
        console.error("Registration failed:", response.data.message);
        toast.error(`Registration failed: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "An error occurred while registering. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans bg-gray-900 text-white min-h-screen overflow-x-hidden">
      {/* Animated Background */}
      <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Signup Form Container */}
        <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-8">
          <div className={`w-full max-w-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
                <span className="block text-white mt-2">Create Account</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-md mx-auto">
                Start your rental journey with our advanced platform
              </p>
            </div>

            {/* Signup Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-700">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* User Type Selection */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300">
                    Sign up as
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <label className="flex items-center p-3 bg-gray-700 rounded-xl border border-gray-600 hover:border-blue-500 transition-all duration-300 cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="renter"
                        checked={userType === "renter"}
                        onChange={(e) => {
                          setUserType(e.target.value);
                          setFormData((prevData) => ({
                            ...prevData,
                            userType: e.target.value,
                          }));
                        }}
                        className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-400"
                      />
                      <span className="ml-3 text-gray-300 font-medium">Renter</span>
                    </label>
                    <label className="flex items-center p-3 bg-gray-700 rounded-xl border border-gray-600 hover:border-blue-500 transition-all duration-300 cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="landowner"
                        checked={userType === "landowner"}
                        onChange={(e) => {
                          setUserType(e.target.value);
                          setFormData((prevData) => ({
                            ...prevData,
                            userType: e.target.value,
                          }));
                        }}
                        className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-400"
                      />
                      <span className="ml-3 text-gray-300 font-medium">Landowner</span>
                    </label>
                  </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="group">
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-300 group-hover:border-blue-500"
                        required
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="group">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-300 group-hover:border-blue-500"
                        required
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="group">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-300 group-hover:border-blue-500"
                        required
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="group">
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300"
                    >
                      Date of Birth
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-300 group-hover:border-blue-500"
                        required
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                {/* House Name - Only for Landowners */}
                {userType === "landowner" && (
                  <div className="group">
                    <label
                      htmlFor="houseName"
                      className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300"
                    >
                      House Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="houseName"
                        name="houseName"
                        value={formData.houseName}
                        onChange={handleChange}
                        placeholder="Enter your House Name"
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-300 group-hover:border-blue-500"
                        required
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                )}

                {/* Home Address Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Home Address
                  </label>
                  
                  {/* Street Address */}
                  <div className="group">
                    <div className="relative">
                      <input
                        type="text"
                        name="homeAddress.street"
                        value={formData.homeAddress.street}
                        onChange={handleChange}
                        placeholder="Street Address"
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-300 group-hover:border-blue-500"
                        required
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* State and District Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* State Selection */}
                    <div className="group">
                      <div className="relative">
                        <select
                          name="homeAddress.state"
                          value={formData.homeAddress.state}
                          onChange={handleChange}
                          className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-300 group-hover:border-blue-500 appearance-none"
                          required
                        >
                          <option value="">Select State</option>
                          {districtData.map((state) => (
                            <option key={state.state} value={state.state}>
                              {state.state}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* District Selection */}
                    <div className="group">
                      <div className="relative">
                        <select
                          name="homeAddress.city"
                          value={formData.homeAddress.city}
                          onChange={handleChange}
                          className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-300 group-hover:border-blue-500 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!formData.homeAddress.state}
                          required
                        >
                          <option value="">Select District</option>
                          {availableDistricts.map((district, index) => (
                            <option key={index} value={district}>
                              {district}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Zip Code */}
                  <div className="group">
                    <div className="relative">
                      <input
                        type="text"
                        name="homeAddress.zipCode"
                        value={formData.homeAddress.zipCode}
                        onChange={handleChange}
                        placeholder="Zip Code"
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-300 group-hover:border-blue-500"
                        required
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="group">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-300 group-hover:border-blue-500"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Signup Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full inline-flex items-center justify-center px-8 py-4 overflow-hidden font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span className="relative z-10 flex items-center">
                      {isSubmitting && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {isSubmitting ? "Creating Account..." : "Create Account"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </form>

              {/* Additional Links */}
              <div className="mt-8 pt-6 border-t border-gray-600">
                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 hover:underline"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Home Link */}
            <div className="text-center mt-8">
              <Link
                to="/"
                className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-300 group"
              >
                <svg className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupRenters;
