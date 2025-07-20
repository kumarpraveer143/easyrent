import React, { useState, useEffect } from "react";
import { FaHome, FaUsers, FaShieldAlt, FaRocket, FaHandshake, FaChartLine, FaMobileAlt, FaGlobe } from "react-icons/fa";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="font-sans bg-gray-900 text-white min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={`text-4xl md:text-6xl font-extrabold text-white mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              About
            </h1>
            <p className={`text-2xl md:text-3xl leading-8 font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              EasyRent Platform
            </p>
            <p className={`text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Revolutionizing the rental experience with cutting-edge technology,
              seamless user interactions, and a commitment to making property rental
              accessible, secure, and efficient for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* For Renters Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
              For Renters: Find Your Perfect Home
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover trusted listings, streamline your application, and find a
              place you can call home – all at your fingertips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-700 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-600 hover:border-blue-500 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaShieldAlt size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Trusted Listings</h3>
              <p className="text-gray-300 leading-relaxed">
                Browse a wide range of verified properties, ensuring a secure and
                reliable rental experience with comprehensive background checks.
              </p>
            </div>

            <div className="bg-gray-700 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-600 hover:border-purple-500 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaRocket size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Effortless Application</h3>
              <p className="text-gray-300 leading-relaxed">
                Apply for properties quickly and easily with our simple,
                streamlined application process and instant notifications.
              </p>
            </div>

            <div className="bg-gray-700 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-600 hover:border-green-500 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaHandshake size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Fast Moves</h3>
              <p className="text-gray-300 leading-relaxed">
                Connect with landlords directly, finalize the deal, and get moving
                in no time. Experience a seamless rental process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Landlords Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
              For Landlords: Maximize Your Property Value
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Streamline property management, find quality tenants, and optimize
              your rental income with our comprehensive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaChartLine size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Property Analytics</h3>
              <p className="text-gray-300 leading-relaxed">
                Get detailed insights into your property performance, market trends,
                and rental optimization strategies.
              </p>
            </div>

            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700 hover:border-cyan-500 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaUsers size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Quality Tenants</h3>
              <p className="text-gray-300 leading-relaxed">
                Access pre-screened tenants with verified backgrounds, ensuring
                reliable and responsible renters for your properties.
              </p>
            </div>

            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700 hover:border-yellow-500 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaMobileAlt size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Mobile Management</h3>
              <p className="text-gray-300 leading-relaxed">
                Manage your properties on-the-go with our mobile-optimized platform,
                keeping you connected 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built with modern technology to provide the best rental experience for everyone.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-700 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-600">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center">
                <FaGlobe className="text-blue-400 mr-3" />
                Global Reach
              </h3>
              <ul className="space-y-4 text-gray-300 max-w-2xl mx-auto">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Advanced search and filtering capabilities</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Real-time property availability updates</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Interactive maps and location-based search</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Multi-language support for global users</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-6">
            Ready to Transform Your Rental Experience?
          </h2>
          <p className="text-xl text-blue-200 mb-10 max-w-3xl mx-auto">
            Join thousands of satisfied users who have revolutionized their property rental journey with our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="transform hover:scale-105 transition-all duration-300">
              <button className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
                <span className="relative z-10">Get Started Today</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
            <div className="transform hover:scale-105 transition-all duration-300">
              <button className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-semibold text-white border-2 border-blue-400 rounded-xl hover:bg-blue-400 transition-all duration-300">
                <span className="relative z-10">Learn More</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
