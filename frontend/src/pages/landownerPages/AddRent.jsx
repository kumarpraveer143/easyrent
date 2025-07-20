import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaMoneyBillWave, FaCalendarAlt, FaCreditCard, FaComment, FaArrowLeft, FaUpload, FaHome } from "react-icons/fa";

const AddRent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rentPrice } = location.state || {};

  const [formData, setFormData] = useState({
    rentPaid: "",
    paymentMethod: "Online",
    remarks: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  let { relationId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/history/${relationId}`,
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Data submitted successfully!");
      } else {
        toast.warn(
          "Submission was successful, but the server returned an unexpected response."
        );
      }
      navigate("/my-renters");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during submission. Please try again.");
    }
  };

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
                onClick={() => navigate("/my-renters")}
                className="mr-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 group"
              >
                <FaArrowLeft className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              </button>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Add Rent Payment
                </span>
              </h1>
            </div>
            <p className="mt-4 max-w-2xl text-lg text-gray-300 sm:text-xl mx-auto">
              Record rent payments and manage your rental income
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
                <FaMoneyBillWave className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Rent Payment</h2>
                <p className="text-blue-100">Record payment details</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-3xl font-bold text-white">₹{rentPrice}</div>
                <div className="text-blue-100 text-sm">Monthly Rent</div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Rent Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rent Amount Paid (₹)
              </label>
              <div className="relative">
                <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                <input
                  type="number"
                  id="rentPaid"
                  name="rentPaid"
                  value={formData.rentPaid}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  placeholder="Enter amount paid"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Method
              </label>
              <div className="relative">
                <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors duration-300"
                >
                  <option value="Online">Online Payment</option>
                  <option value="Cash">Cash Payment</option>
                  <option value="Others">Other Methods</option>
                </select>
              </div>
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Date
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  required
                />
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Remarks (Optional)
              </label>
              <div className="relative">
                <FaComment className="absolute left-3 top-3 h-5 w-5 text-cyan-400" />
                <textarea
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  placeholder="Add any additional notes or remarks"
                  rows="3"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-3">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-6 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 group transform hover:scale-105"
              >
                <FaUpload className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Submit Payment</span>
              </button>
              
              <Link to="/my-renters">
                <button
                  type="button"
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-4 px-6 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <FaArrowLeft className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span>Back to Renters</span>
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRent;
