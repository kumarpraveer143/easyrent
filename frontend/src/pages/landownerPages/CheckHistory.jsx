import React, { useEffect, useState } from "react";
import NoHistory from "./NoHistory";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaHistory, FaMoneyBillWave, FaCalendarAlt, FaCreditCard, FaComment, FaArrowLeft, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Loading from "../../components/UI/Loading";

const CheckHistory = () => {
  const [rentHistory, setRentHistory] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedRent, setEditedRent] = useState({});
  const [loading, setLoading] = useState(false);
  const [isArchieve, setIsArchieve] = useState(false);
  const navigate = useNavigate();

  const { relationId } = useParams();

  useEffect(() => {
    const fetchisArchieve = async () => {
      const isArchieve = await axios.post(`${import.meta.env.VITE_API_URL}/relationship/isArchieve`, { relationId }, { withCredentials: true });
      setIsArchieve(isArchieve.data.message)
    }
    fetchisArchieve();
  }, [])

  useEffect(() => {
    setLoading(true);
    const fetchHistory = async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/history/${relationId}`, {
        withCredentials: true,
      });
      setRentHistory(response.data.history);
    };
    fetchHistory();
    setLoading(false);
  }, [relationId]);

  // Format the date to "Month Day, Year" format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedRent({
      rentPaid: rentHistory[index].rentPaid,
      paymentMethod: rentHistory[index].paymentMethod,
      remarks: rentHistory[index].remarks || "",
      date: rentHistory[index].date,
    });
  };

  const handleDelete = async (historyId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this history item? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/history/${historyId}`,
            {
              withCredentials: true,
            }
          );

          let filteredHistory = rentHistory.filter(
            (rent) => rent._id !== historyId
          );
          setRentHistory(filteredHistory);
        } catch (err) {
          console.log(err);
          Swal.fire(
            "Error!",
            "Something went wrong. Please try again.",
            "error"
          );
        }
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (historyId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/history/${historyId}`,
        editedRent,
        {
          withCredentials: true,
        }
      );

      setRentHistory((prevHistory) =>
        prevHistory.map((item) =>
          item._id === historyId ? { ...item, ...editedRent } : item
        )
      );

      toast.success("History updated successfully!");
    } catch (err) {
      console.log(err);
    }
    setEditIndex(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (rentHistory.length === 0) {
    return <NoHistory />;
  }

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
                  Rent History
                </span>
              </h1>
            </div>
            <p className="mt-4 max-w-2xl text-lg text-gray-300 sm:text-xl mx-auto">
              View and manage payment history for your tenants
            </p>
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 bg-opacity-20 rounded-full border border-blue-500">
              <span className="text-blue-300 text-sm font-medium">
                {rentHistory.length} Payment{rentHistory.length !== 1 ? 's' : ''} Recorded
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
                <FaHistory className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Payment Records</h2>
                <p className="text-blue-100">Complete transaction history</p>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700 border-b border-gray-600">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FaMoneyBillWave className="h-4 w-4 text-green-400" />
                      <span>Amount</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="h-4 w-4 text-purple-400" />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FaCreditCard className="h-4 w-4 text-blue-400" />
                      <span>Method</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FaComment className="h-4 w-4 text-cyan-400" />
                      <span>Remarks</span>
                    </div>
                  </th>
                  {!isArchieve && (
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rentHistory.map((rent, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200"
                  >
                    {editIndex === index ? (
                      <>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
                            <input
                              type="number"
                              name="rentPaid"
                              value={editedRent.rentPaid}
                              onChange={handleChange}
                              className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                            <input
                              type="date"
                              name="date"
                              value={editedRent.date}
                              onChange={handleChange}
                              className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                            <select
                              name="paymentMethod"
                              value={editedRent.paymentMethod}
                              onChange={handleChange}
                              className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            >
                              <option value="Online">Online</option>
                              <option value="Cash">Cash</option>
                              <option value="Others">Others</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <FaComment className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                            <input
                              type="text"
                              name="remarks"
                              value={editedRent.remarks}
                              onChange={handleChange}
                              className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                              placeholder="Add remarks"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleSave(rent._id)}
                              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-1 group"
                            >
                              <FaSave className="h-3 w-3 group-hover:scale-110 transition-transform duration-300" />
                              <span className="text-sm">Save</span>
                            </button>
                            <button
                              onClick={() => setEditIndex(null)}
                              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center space-x-1 group"
                            >
                              <FaTimes className="h-3 w-3 group-hover:scale-110 transition-transform duration-300" />
                              <span className="text-sm">Cancel</span>
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <FaMoneyBillWave className="h-4 w-4 text-green-400" />
                            <span className="font-semibold text-green-400">₹{rent.rentPaid}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <FaCalendarAlt className="h-4 w-4 text-purple-400" />
                            <span>{formatDate(rent.date)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <FaCreditCard className="h-4 w-4 text-blue-400" />
                            <span className="capitalize">{rent.paymentMethod}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <FaComment className="h-4 w-4 text-cyan-400" />
                            <span className="text-gray-300">{rent.remarks || "N/A"}</span>
                          </div>
                        </td>
                        {!isArchieve && (
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleEdit(index)}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group"
                              >
                                <FaEdit className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                              </button>
                              <button
                                onClick={() => handleDelete(rent._id)}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 group"
                              >
                                <FaTrash className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                              </button>
                            </div>
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Back Button */}
          <div className="bg-gray-700 p-6">
            <Link to="/my-renters">
              <button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 group">
                <FaArrowLeft className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span>Back to Renters</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckHistory;
