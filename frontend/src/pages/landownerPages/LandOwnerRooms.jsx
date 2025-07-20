import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NoRoomsFound from "../NoRoomsFound";
import Swal from "sweetalert2";
import { FaBell, FaEdit, FaSave, FaTrash, FaHome, FaMapMarkerAlt, FaMoneyBillWave, FaBed, FaBath, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/UI/Loading";

const LandOwnerRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/rooms/myRoom`, {
          withCredentials: true,
        });
        setRooms(response.data.message);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        console.error("Error response:", error.response);
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);

        if (error.response?.status === 404) {
          toast.error("Rooms not found or access denied!");
        } else if (error.response?.status === 401) {
          toast.error("Authentication failed. Please login again.");
        } else {
          toast.error("Something went wrong! Please try again.");
        }
      }
      setLoading(false);
    };

    fetchRooms();
  }, []);

  const handleEditClick = (roomId) => {
    setEditingRoom(roomId);
  };

  const handleSaveClick = async (roomId) => {
    const updatedRoom = rooms.find((room) => room._id === roomId);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/relationship/isRelationship`,
        { roomId },
        {
          withCredentials: true,
        }
      );
      let isRoomInRelation = res.data.renters;

      if (updatedRoom.isAvailable && isRoomInRelation) {
        toast.error("You have renters in your exsiting room!");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/rooms/${roomId}`,
        updatedRoom,
        {
          withCredentials: true,
        }
      );

      // console.log("API Response:", response.data);
      toast.success("Room updated successfully!");
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update the room!");
    }

    setEditingRoom(null);
  };

  const handleDeleteClick = async (roomId) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/relationship/relationByRoomId`,
      { roomId },
      { withCredentials: true }
    );
    if (response.data.message) {
      toast.error("There is someone in the room, so you can't delete it!");
      return;
    }
    // const room = rooms.find((room) => room._id == roomId)
    // const isAvailable = room.isAvailable;
    // if (!isAvailable) {
    //   toast.error("There is someone in the room, so you can't delete it!");
    //   return;
    // }
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${import.meta.env.VITE_API_URL}/rooms/${roomId}`, {
            withCredentials: true,
          });
          toast.success("Room Deleted Successfully!");
          // Update the rooms state after deletion
          setRooms(rooms.filter((room) => room._id !== roomId));
        } catch (err) {
          toast.error("Something went wrong!");
          console.log(err);
        }
      } else {
        toast.info("Deletion cancelled");
      }
    });
  };

  const handleIncomingRequest = (roomId) => {
    navigate("/incoming-request", { state: { roomId } });
  };

  const handleAddressChange = (e, field) => {
    const { value } = e.target;
    setRooms(
      rooms.map((room) => {
        if (room._id === editingRoom) {
          return {
            ...room,
            address: {
              ...room.address,
              [field]: value,
            },
          };
        }
        return room;
      })
    );
  };

  const handleAvailabilityChange = (e, roomId) => {
    const { checked } = e.target;
    setRooms(
      rooms.map((room) => {
        if (room._id === roomId) {
          return { ...room, isAvailable: checked };
        }
        return room;
      })
    );
  };

  const handleChange = (e, field) => {
    const { value } = e.target;
    setRooms(
      rooms.map((room) => {
        if (room._id === editingRoom) {
          return {
            ...room,
            [field]: value,
          };
        }
        return room;
      })
    );
  };

  if (loading) {
    return <Loading />;
  }
  if (rooms.length === 0) {
    return <NoRoomsFound />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mb-4">
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                My Properties
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-300 sm:text-xl mx-auto">
              Manage your rental properties with advanced tools and real-time updates
            </p>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="group bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Room Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
                      <FaHome className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Room {room.roomNumber ? room.roomNumber : "N/A"}
                      </h3>
                      <p className="text-blue-100 capitalize">{room.roomType}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    room.isAvailable 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {room.isAvailable ? 'Available' : 'Occupied'}
                  </div>
                </div>
              </div>

              {/* Room Content */}
              <div className="p-6 space-y-4">
                {/* Address */}
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    {editingRoom === room._id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={room.address.street}
                          onChange={(e) => handleAddressChange(e, "street")}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          placeholder="Street"
                        />
                        <input
                          type="text"
                          value={room.address.city}
                          onChange={(e) => handleAddressChange(e, "city")}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          placeholder="City"
                        />
                        <input
                          type="text"
                          value={room.address.state}
                          onChange={(e) => handleAddressChange(e, "state")}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          placeholder="State"
                        />
                        <input
                          type="text"
                          value={room.address.zipCode}
                          onChange={(e) => handleAddressChange(e, "zipCode")}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          placeholder="Zip Code"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-300">
                        {room.address.street}, {room.address.city}, {room.address.state}, {room.address.zipCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* Room Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Rent Price */}
                  <div className="flex items-center space-x-3">
                    <FaMoneyBillWave className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <div className="flex-1">
                      {editingRoom === room._id ? (
                        <input
                          type="number"
                          value={room.rentPrice}
                          onChange={(e) => handleChange(e, "rentPrice")}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          placeholder="Rent Price"
                        />
                      ) : (
                        <p className="text-gray-300">₹{room.rentPrice}</p>
                      )}
                    </div>
                  </div>

                  {/* Room Type */}
                  <div className="flex items-center space-x-3">
                    <FaHome className="h-5 w-5 text-purple-400 flex-shrink-0" />
                    <div className="flex-1">
                      {editingRoom === room._id ? (
                        <select
                          value={room.roomType}
                          onChange={(e) => handleChange(e, "roomType")}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                        >
                          <option value="single">Single</option>
                          <option value="shared">Shared</option>
                          <option value="studio">Studio</option>
                          <option value="apartment">Apartment</option>
                          <option value="house">House</option>
                        </select>
                      ) : (
                        <p className="text-gray-300 capitalize">{room.roomType}</p>
                      )}
                    </div>
                  </div>

                  {/* Number of Rooms */}
                  <div className="flex items-center space-x-3">
                    <FaBed className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <div className="flex-1">
                      {editingRoom === room._id ? (
                        <input
                          type="number"
                          value={room.numberOfRooms}
                          onChange={(e) => handleChange(e, "numberOfRooms")}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          placeholder="Rooms"
                        />
                      ) : (
                        <p className="text-gray-300">{room.numberOfRooms} Rooms</p>
                      )}
                    </div>
                  </div>

                  {/* Number of Bathrooms */}
                  <div className="flex items-center space-x-3">
                    <FaBath className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                    <div className="flex-1">
                      {editingRoom === room._id ? (
                        <input
                          type="number"
                          value={room.numberOfBathrooms}
                          onChange={(e) => handleChange(e, "numberOfBathrooms")}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          placeholder="Bathrooms"
                        />
                      ) : (
                        <p className="text-gray-300">{room.numberOfBathrooms} Bathrooms</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Availability Toggle */}
                {editingRoom === room._id && (
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-300">Available for Rent:</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={room.isAvailable}
                        onChange={(e) => handleAvailabilityChange(e, room._id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="bg-gray-700 p-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {editingRoom === room._id ? (
                    <button
                      onClick={() => handleSaveClick(room._id)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2 group"
                    >
                      <FaSave className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      <span>Save Changes</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(room._id)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 group"
                    >
                      <FaEdit className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      <span>Edit Room</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteClick(room._id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <FaTrash className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>Delete</span>
                  </button>
                </div>
                
                {room.isAvailable && (
                  <button
                    onClick={() => handleIncomingRequest(room._id)}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <FaBell className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>View Incoming Requests</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandOwnerRooms;
