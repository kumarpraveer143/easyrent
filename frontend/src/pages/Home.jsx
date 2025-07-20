

import React, { useState, useEffect } from 'react';
import HomeImage from "/images/homeImage.png"
import {Link} from"react-router-dom"
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [activeTab, setActiveTab] = useState('landlords');
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  const faqs = [
    {
      question: "How do I list my property?",
      answer: "Simply create an account, click on 'List Property', and follow the step-by-step guide to showcase your space to potential tenants."
    },
    {
      question: "Is there a fee for listing my property?",
      answer: "Basic listings are free. Premium features are available for a small fee to boost visibility and attract more potential tenants."
    },
    {
      question: "How do I search for rooms?",
      answer: "Use our search bar to filter by location, price range, amenities, and more. You can search by pin code or use our interactive map feature."
    },
    {
      question: "Are payments secure?",
      answer: "Yes, all transactions are processed through our secure payment gateway with encryption and fraud protection measures in place."
    },
    {
      question: "Can I schedule a viewing before renting?",
      answer: "Absolutely! You can request viewings directly through our platform and coordinate with property owners for a convenient time."
    }
  ];

  return (
    <div className="font-sans bg-gray-900 text-white min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className={`lg:w-1/2 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Find Your Perfect
                </span>
                <span className="block text-white mt-2">Rental Space</span>
              </h1>
              <p className="mt-6 max-w-md text-lg text-gray-300 sm:text-xl md:mt-8 md:max-w-3xl leading-relaxed">
                Experience seamless property rentals with our advanced platform. Connect with verified landlords and tenants for a hassle-free rental journey.
              </p>
              <div className="mt-10 sm:flex space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="transform hover:scale-105 transition-all duration-300">
                  <Link to="/uploadrooms" className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
                    <span className="relative z-10">List Property</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>
                <div className="transform hover:scale-105 transition-all duration-300">
                  <Link to="/findRooms" className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-white border-2 border-blue-500 rounded-lg hover:bg-blue-500 transition-all duration-300">
                    <span className="relative z-10">Find Rooms</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className={`mt-12 lg:mt-0 lg:w-1/2 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                <div className="w-full h-64 flex items-center justify-center">
                  <img 
                    className="sm:w-[30rem] md:w-[30rem] mt-10 transform hover:scale-105 transition-transform duration-500 drop-shadow-2xl" 
                    src={HomeImage} 
                    alt="Rental Platform" 
                  />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-20 blur-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
              Why Choose
            </h2>
            <p className="text-3xl leading-8 font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent sm:text-4xl">
              EasyRent Platform
            </p>
            <p className="mt-6 max-w-2xl text-xl text-gray-400 lg:mx-auto">
              Advanced features designed to streamline your rental experience with cutting-edge technology.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="group bg-gray-700 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-600 hover:border-blue-500">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">Smart Property Management</h3>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Advanced dashboard with real-time analytics, automated tenant screening, and comprehensive property management tools.
              </p>
            </div>

            <div className="group bg-gray-700 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-600 hover:border-purple-500">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">AI-Powered Search</h3>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Intelligent search algorithms with location-based filtering, price optimization, and personalized recommendations.
              </p>
            </div>

            <div className="group bg-gray-700 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-600 hover:border-green-500">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white group-hover:text-green-400 transition-colors duration-300">Secure Transactions</h3>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Enterprise-grade security with encrypted payments, fraud protection, and compliance with financial regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="why-us" className="py-20 bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
              Platform Benefits
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive solutions tailored for both property owners and tenants with advanced features and seamless user experience.
            </p>
          </div>

          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2">
                <div className="flex justify-center lg:justify-start mb-8">
                  <div className="inline-flex rounded-xl shadow-lg overflow-hidden relative">
                    {/* Active Tab Indicator */}
                    <div 
                      className={`absolute top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl transition-all duration-500 ease-in-out ${
                        activeTab === 'landlords' ? 'left-0 w-1/2' : 'left-1/2 w-1/2'
                      }`}
                    ></div>
                    
                    <button
                      onClick={() => handleTabChange('landlords')}
                      className={`relative px-8 py-4 text-base font-semibold transition-all duration-300 z-10 ${
                        activeTab === 'landlords'
                          ? 'text-white'
                          : 'text-gray-300 hover:text-white'
                      } cursor-pointer`}
                    >
                      For Landlords
                    </button>
                    <button
                      onClick={() => handleTabChange('renters')}
                      className={`relative px-8 py-4 text-base font-semibold transition-all duration-300 z-10 ${
                        activeTab === 'renters'
                          ? 'text-white'
                          : 'text-gray-300 hover:text-white'
                      } cursor-pointer`}
                    >
                      For Renters
                    </button>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="space-y-6">
                  {activeTab === 'landlords' ? (
                    <>
                      <div className="flex items-start group">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-4 text-lg text-gray-300 group-hover:text-white transition-colors duration-300">Advanced property analytics and market insights</p>
                      </div>
                      <div className="flex items-start group">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-4 text-lg text-gray-300 group-hover:text-white transition-colors duration-300">Automated tenant screening and verification</p>
                      </div>
                      <div className="flex items-start group">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-4 text-lg text-gray-300 group-hover:text-white transition-colors duration-300">Integrated payment processing and financial reporting</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start group">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-4 text-lg text-gray-300 group-hover:text-white transition-colors duration-300">Personalized property recommendations</p>
                      </div>
                      <div className="flex items-start group">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-4 text-lg text-gray-300 group-hover:text-white transition-colors duration-300">One-click application and document submission</p>
                      </div>
                      <div className="flex items-start group">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-4 text-lg text-gray-300 group-hover:text-white transition-colors duration-300">Real-time notifications and communication tools</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get answers to common questions about our advanced rental platform.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-700 rounded-xl shadow-lg border border-gray-600 overflow-hidden group hover:border-blue-500 transition-all duration-300">
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full px-8 py-6 text-left focus:outline-none flex justify-between items-center group-hover:bg-gray-600 transition-colors duration-300"
                  >
                    <span className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">{faq.question}</span>
                    <svg
                      className={`h-6 w-6 text-blue-400 transform transition-transform duration-300 ${activeQuestion === index ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeQuestion === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 pb-6">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
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
              <Link
                to="/signup"
                className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
              >
                <span className="relative z-10">Get Started Today</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
            <div className="transform hover:scale-105 transition-all duration-300">
              <Link
                to="/about"
                className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-semibold text-white border-2 border-blue-400 rounded-xl hover:bg-blue-400 transition-all duration-300"
              >
                <span className="relative z-10">Learn More</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
