import React, { useState, useEffect } from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaCode, FaLaptopCode, FaRocket, FaDatabase, FaLinux, FaServer, FaFutbol, FaPlane } from "react-icons/fa";
import { SiCplusplus } from "react-icons/si";

const Developer = () => {
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
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image Section */}
            <div className="lg:w-1/2 w-full">
              <div className="w-full flex items-center justify-center">
                <img
                  src="images/myPhoto3.jpg"
                  alt="Developer"
                  className="rounded-2xl shadow-2xl w-80 h-96 object-cover drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Text and Social Section */}
            <div className={`lg:w-1/2 w-full text-center lg:text-left transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                Praveer Kumar
              </h1>
              <p className="text-2xl md:text-3xl leading-8 font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                Full-Stack Developer
              </p>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                Hi, I'm a passionate developer currently pursuing MCA at NIT Bhopal.
                I am dedicated to building intuitive applications and solving
                real-world problems with innovative solutions. Let's connect and
                create something amazing together!
              </p>

              {/* Skills/Interests */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                <div className="flex items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700 hover:border-blue-500 transition-all duration-300 group">
                  <FaCode className="text-blue-400 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Web Development</span>
                </div>
                <div className="flex items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700 hover:border-purple-500 transition-all duration-300 group">
                  <FaLaptopCode className="text-purple-400 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Full-Stack</span>
                </div>
                <div className="flex items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700 hover:border-green-500 transition-all duration-300 group">
                  <FaServer className="text-green-400 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Backend</span>
                </div>
                <div className="flex items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700 hover:border-orange-500 transition-all duration-300 group">
                  <FaDatabase className="text-orange-400 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Big Data</span>
                </div>
                <div className="flex items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700 hover:border-yellow-500 transition-all duration-300 group">
                  <FaLinux className="text-yellow-400 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Linux</span>
                </div>
                <div className="flex items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700 hover:border-red-500 transition-all duration-300 group">
                  <SiCplusplus className="text-red-400 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">C++</span>
                </div>
                <div className="flex items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700 hover:border-pink-500 transition-all duration-300 group">
                  <FaRocket className="text-pink-400 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Innovation</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center lg:justify-start space-x-6">
                <a
                  href="https://github.com/kumarpraveer143"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center w-14 h-14 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-full border border-gray-700 hover:border-gray-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gray-500/25"
                >
                  <FaGithub size={24} className="text-gray-300 group-hover:text-white transition-colors duration-300" />
                </a>
                <a
                  href="https://www.linkedin.com/in/praveerdeveloper/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center w-14 h-14 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-full border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <FaLinkedin size={24} className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                </a>
                <a
                  href="https://x.com/kumarpraveer3?t=s-r4AAAheb9JaG9UBN70og&s=09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center w-14 h-14 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-full border border-gray-700 hover:border-blue-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-400/25"
                >
                  <FaTwitter size={24} className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
              What I Do
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Passionate about creating innovative solutions, building applications, and enjoying life through sports and travel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-700 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-600 hover:border-blue-500 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaCode size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Web Development</h3>
              <p className="text-gray-300 leading-relaxed">
                Building modern, responsive web applications using cutting-edge technologies and best practices.
              </p>
            </div>

            <div className="bg-gray-700 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-600 hover:border-purple-500 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaLaptopCode size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Full-Stack Solutions</h3>
              <p className="text-gray-300 leading-relaxed">
                End-to-end development from database design to user interface, ensuring seamless integration.
              </p>
            </div>

            <div className="bg-gray-700 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-600 hover:border-green-500 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaFutbol size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Football</h3>
              <p className="text-gray-300 leading-relaxed">
                Passionate about football, both playing and watching. It keeps me active and teaches teamwork and strategy.
              </p>
            </div>

            <div className="bg-gray-700 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-600 hover:border-cyan-500 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaPlane size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Travel</h3>
              <p className="text-gray-300 leading-relaxed">
                Love exploring new places and cultures. Traveling broadens perspectives and inspires creativity in my work.
              </p>
            </div>

            <div className="bg-gray-700 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-600 hover:border-pink-500 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaRocket size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Innovation</h3>
              <p className="text-gray-300 leading-relaxed">
                Constantly exploring new technologies and approaches to solve complex problems creatively.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Developer;
