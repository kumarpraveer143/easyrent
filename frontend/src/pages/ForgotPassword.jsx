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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden font-sans">
      {/* Blurred background circles for effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      <div className="relative w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 z-10">
        <h2 className="mb-6 text-3xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Reset Your Password
        </h2>
        <form className="space-y-6" id="resetForm" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            >
              Send Reset Link
            </button>
          </div>
        </form>
        <div className="mt-6 space-y-4 text-center">
          <p className="text-sm text-gray-300">
            If you didn't request a password reset, please ignore this.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
