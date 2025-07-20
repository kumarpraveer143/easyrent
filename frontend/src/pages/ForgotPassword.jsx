import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";



const ForgotPassword = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/password/forget`, {
        email,
      });
      toast.success("Reset link is sent to your email!");
      navigate("/login");
    } catch (error) {
      console.error(
        "Error sending reset link:",
        error.response?.data || error.message
      );
      toast.error("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center md:h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-700">
          Reset Your Password
        </h2>
        <form className="space-y-4" id="resetForm" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Send Reset Link
            </button>
          </div>
        </form>
        <div className="mt-6 space-y-4 text-center">
          <p className="text-sm text-gray-600">
            If you didn't request a password reset, please ignore this.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
