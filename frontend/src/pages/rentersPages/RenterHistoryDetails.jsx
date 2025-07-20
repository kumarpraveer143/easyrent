import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaHistory, FaCalendarAlt, FaMoneyBillWave, FaCreditCard, FaComment, FaReceipt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/UI/Loading";

const RenterHistoryDetails = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getHistory = async () => {
      try {
        setLoading(true);
        let response = await axios.get(
          `${import.meta.env.VITE_API_URL}/relationship/historyOfRenter`,
          { withCredentials: true }
        );
        setHistory(response.data.histories);
      } catch (error) {
        console.error("Failed to fetch renter history:", error);
      } finally {
        setLoading(false);
      }
    };
    getHistory();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 py-8 relative overflow-hidden pt-24">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300 group"
            >
              <FaArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Payment History
                </span>
              </h1>
              <p className="mt-2 text-gray-300 text-lg">
                Your rental payment records ({history.length} {history.length === 1 ? 'entry' : 'entries'})
              </p>
            </div>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {history.length > 0 ? (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
                <div className="flex items-center space-x-3">
                  <FaReceipt className="h-6 w-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">Payment Summary</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {history.length}
                    </div>
                    <div className="text-gray-300 text-sm">Total Payments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">
                      ₹{history.reduce((sum, item) => sum + item.rentPaid, 0).toLocaleString()}
                    </div>
                    <div className="text-gray-300 text-sm">Total Amount Paid</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">
                      ₹{Math.round(history.reduce((sum, item) => sum + item.rentPaid, 0) / history.length).toLocaleString()}
                    </div>
                    <div className="text-gray-300 text-sm">Average Payment</div>
                  </div>
                </div>
              </div>
            </div>

            {/* History Table */}
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <div className="flex items-center space-x-3">
                  <FaHistory className="h-6 w-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">Payment History</h2>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700 border-b border-gray-600">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="h-4 w-4 text-blue-400" />
                          <span>Date</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <FaMoneyBillWave className="h-4 w-4 text-green-400" />
                          <span>Amount Paid</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <FaCreditCard className="h-4 w-4 text-purple-400" />
                          <span>Payment Method</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <FaComment className="h-4 w-4 text-orange-400" />
                          <span>Remarks</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {history.map((item, index) => (
                      <tr key={item._id} className="hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{index + 1}</span>
                            </div>
                            <div>
                              <div className="text-white font-semibold">{formatDate(item.date)}</div>
                              <div className="text-gray-400 text-sm">
                                {new Date(item.date).toLocaleDateString('en-GB', { weekday: 'long' })}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-green-400 font-bold text-lg">₹{item.rentPaid.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            {item.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-300">
                            {item.remarks || (
                              <span className="text-gray-500 italic">No remarks</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-6">
              <div className="flex items-center space-x-3">
                <FaHistory className="h-6 w-6 text-white" />
                <h2 className="text-2xl font-bold text-white">No Payment History</h2>
              </div>
            </div>
            
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaReceipt className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Payment Records Found</h3>
              <p className="text-gray-400">You haven't made any payments yet. Payment history will appear here once you start making rent payments.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenterHistoryDetails;
