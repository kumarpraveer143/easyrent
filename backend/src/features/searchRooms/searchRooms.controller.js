import RoomSchema from "../rooms/room.schema.js";
import mongoose from "mongoose";
import SearchRoomsRepository from "./searchRooms.repository.js";

const searchRoomsRepository = new SearchRoomsRepository();

class SearchRoomsController {
  async search(req, res) {
    const { state, city } = req.query;
    if (!state && !city) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide at least a state or a city to search.",
        });
    }

  }

  async searchByDistrictAndState(req, res) {
    const { district, state } = req.query;
    if (!district && !state) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least a district or a state to search."
      });
    }
    try {
      const rooms = await searchRoomsRepository.findByCityAndState(district, state);
      return res.json({ success: true, rooms });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Database error during search.",
        error: err.message
      });
    }
  }
}

export default SearchRoomsController;
