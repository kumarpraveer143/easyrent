import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(""); // Clear previous errors

    const loginData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        loginData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Login Successful");
        let user = response.data.user;
        delete user.password;
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
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

        {/* Login Form Container */}
        <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          <div className={`w-full max-w-md transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
                <span className="block text-white mt-2">Sign In</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-md mx-auto">
                Access your account and continue your rental journey with EasyRent
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-300 group-hover:border-blue-500"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Password Input */}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-300 group-hover:border-blue-500"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-xl p-4 text-red-200 text-sm">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  </div>
                )}

                {/* Login Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full inline-flex items-center justify-center px-8 py-4 overflow-hidden font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span className="relative z-10 flex items-center">
                      {loading && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {loading ? "Signing In..." : "Sign In"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </form>

              {/* Additional Links */}
              <div className="mt-8 pt-6 border-t border-gray-600">
                <div className="space-y-4 text-center">
                  <p className="text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 hover:underline"
                    >
                      Create Account
                    </Link>
                  </p>
                  <p className="text-sm text-gray-400">
                    Forgot your password?{" "}
                    <Link
                      to="/forget-password"
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 hover:underline"
                    >
                      Reset Password
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

export default Login;
