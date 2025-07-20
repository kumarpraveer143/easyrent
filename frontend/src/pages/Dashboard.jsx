import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaHome,
  FaUpload,
  FaMoneyBillAlt,
  FaSearch,
  FaStar,
  FaHouseUser,
  FaArchive,
  FaChartLine,
  FaCog,
  FaBell,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Get user data from localStorage or session storage
    const userData = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    setUser(userData);
    setIsVisible(true);
  }, []);

  const { userType } = user || {};

  const dashboardCards = [
    {
      id: "profile",
      title: "Profile",
      description: "View and edit your profile details easily.",
      icon: FaUser,
      link: "/profile",
      color: "from-blue-500 to-purple-500",
      hoverColor: "hover:border-blue-500",
      delay: "0ms"
    },
    ...(userType === "landowner" ? [
      {
        id: "my-rooms",
        title: "My Rooms",
        description: "Manage the rooms you own and oversee their details.",
        icon: FaHome,
        link: "/landowner-rooms",
        color: "from-green-500 to-teal-500",
        hoverColor: "hover:border-green-500",
        delay: "100ms"
      },
      {
        id: "upload-rooms",
        title: "Upload Rooms",
        description: "Add new rooms to your listings with ease.",
        icon: FaUpload,
        link: "/uploadrooms",
        color: "from-purple-500 to-pink-500",
        hoverColor: "hover:border-purple-500",
        delay: "200ms"
      },
      {
        id: "my-renters",
        title: "My Renters",
        description: "Add and manage renters here with ease.",
        icon: FaHouseUser,
        link: "/my-renters",
        color: "from-pink-500 to-red-500",
        hoverColor: "hover:border-pink-500",
        delay: "300ms"
      },
      {
        id: "archived-renters",
        title: "Archived Renters",
        description: "View your archived renters here.",
        icon: FaArchive,
        link: "/archieved-renters",
        color: "from-red-500 to-orange-500",
        hoverColor: "hover:border-red-500",
        delay: "400ms"
      }
    ] : userType === "renter" ? [
      {
        id: "find-rooms",
        title: "Find Rooms",
        description: "Search and discover rooms that match your preferences.",
        icon: FaSearch,
        link: "/findRooms",
        color: "from-purple-500 to-indigo-500",
        hoverColor: "hover:border-purple-500",
        delay: "100ms"
      },
      {
        id: "favourite-rooms",
        title: "Favourite Rooms",
        description: "View your saved favorite rooms here.",
        icon: FaStar,
        link: "/favouriteRooms",
        color: "from-yellow-500 to-orange-500",
        hoverColor: "hover:border-yellow-500",
        delay: "200ms"
      },
      {
        id: "my-room",
        title: "My Room",
        description: "Check details and payment history updated by the owner.",
        icon: FaHouseUser,
        link: "/rentersMyRoom",
        color: "from-red-500 to-pink-500",
        hoverColor: "hover:border-red-500",
        delay: "300ms"
      }
    ] : []),
    {
      id: "payment-history",
      title: "Payment History",
      description: "Track your payment records and transaction history.",
      icon: FaMoneyBillAlt,
      link: "/payment-history",
      color: "from-green-500 to-emerald-500",
      hoverColor: "hover:border-green-500",
      delay: "500ms"
    }
  ];

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
              Welcome Back
            </span>
            <span className="block text-white mt-2">Dashboard</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl mx-auto leading-relaxed">
            Manage your {userType === "landowner" ? "properties and renters" : "rental experience"} with our advanced dashboard tools.
          </p>
          
          {/* User Info Card */}
          <div className="mt-8 inline-block bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <FaUser className="text-white text-xl" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-400">Logged in as</p>
                <p className="text-lg font-semibold text-white capitalize">{userType || "User"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Cards Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
              Quick Access
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Access all your important features and tools from one central location.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {dashboardCards.map((card, index) => (
              <Link
                key={card.id}
                to={card.link}
                className={`group bg-gray-700 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-600 ${card.hoverColor} transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl`}
                style={{
                  animationDelay: card.delay,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.6s ease-out ${card.delay}`
                }}
              >
                <div className={`h-16 w-16 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-6`}>
                  <card.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 mb-4">
                  {card.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {card.description}
                </p>
                
                {/* Hover Arrow */}
                <div className="mt-6 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-sm font-medium">Access Now</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
              Platform Overview
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get insights into your {userType === "landowner" ? "property management" : "rental"} activities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700 hover:border-blue-500 transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto mb-6">
                <FaChartLine className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-4">Active Status</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Your account is active and ready for {userType === "landowner" ? "property management" : "room searching"}.
              </p>
            </div>

            <div className="group bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700 hover:border-purple-500 transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto mb-6">
                <FaBell className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-4">Notifications</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Stay updated with real-time notifications about your activities.
              </p>
            </div>

            <div className="group bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700 hover:border-green-500 transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto mb-6">
                <FaCog className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-4">Settings</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Customize your preferences and manage your account settings.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;