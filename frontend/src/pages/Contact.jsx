import React, { useState } from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

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
              Get in Touch
            </span>
            <span className="block text-white mt-2">Contact Us</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl mx-auto leading-relaxed">
            We'd love to hear from you! Fill out the form below, and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-700 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-600">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Input */}
              <div className="group">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all duration-300 hover:border-gray-500"
                />
              </div>

              {/* Email Input */}
              <div className="group">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all duration-300 hover:border-gray-500"
                />
              </div>

              {/* Message Input */}
              <div className="group">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-blue-400 transition-colors duration-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Tell us how we can help you..."
                  className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all duration-300 hover:border-gray-500 resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative z-10">Send Message</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
              Other Ways to
            </h2>
            <p className="text-3xl leading-8 font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent sm:text-4xl">
              Reach Us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Email Contact */}
            <div className="group bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700 hover:border-blue-500 transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto mb-6">
                <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-4">Email Support</h3>
              <p className="text-gray-300 text-center leading-relaxed mb-4">
                Send us an email and we'll respond within 24 hours.
              </p>
              <a 
                href="mailto:techpraveer@gmail.com" 
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium block text-center"
              >
                techpraveer@gmail.com
              </a>
            </div>

            {/* Phone Contact */}
            <div className="group bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700 hover:border-purple-500 transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto mb-6">
                <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-4">Phone Support</h3>
              <p className="text-gray-300 text-center leading-relaxed mb-4">
                Call us for immediate assistance during business hours.
              </p>
              <a 
                href="tel:+918252965226" 
                className="text-purple-400 hover:text-purple-300 transition-colors duration-300 font-medium block text-center"
              >
                +91 8252965226
              </a>
            </div>

            {/* WhatsApp Contact */}
            <div className="group bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700 hover:border-green-500 transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto mb-6">
                <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-4">WhatsApp Support</h3>
              <p className="text-gray-300 text-center leading-relaxed mb-4">
                Start a WhatsApp chat for instant messaging support.
              </p>
              <a 
                href="https://wa.me/918252965226" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-colors duration-300 font-medium block text-center"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
