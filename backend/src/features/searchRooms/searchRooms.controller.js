import SearchRoomsRepository from "./searchRooms.repository.js";

const searchRoomsRepository = new SearchRoomsRepository();

class SearchRoomsController {
  /**
   * BUG-05: this returned 400 when both params were missing, and then — when
   * they WERE supplied — fell off the end of the function without ever calling
   * `res`. A valid `GET /api/search/state?state=Bihar` never responded; the
   * connection stayed open until the client or a proxy timed out, holding a
   * socket each time.
   */
  async search(req, res) {
    const { state, city } = req.query;

    if (!state && !city) {
      return res.status(400).json({
        success: false,
        message: "Give us at least a state or a city to search by.",
      });
    }

    try {
      const rooms = await searchRoomsRepository.findByCityAndState(city, state);
      return res.status(200).json({ success: true, rooms });
    } catch (err) {
      console.error("Search failed:", err);
      return res.status(500).json({ success: false, message: "Search failed. Try again." });
    }
  }

  async searchByDistrictAndState(req, res) {
    const { district, state } = req.query;

    if (!district && !state) {
      return res.status(400).json({
        success: false,
        message: "Give us at least a district or a state to search by.",
      });
    }

    try {
      const rooms = await searchRoomsRepository.findByCityAndState(district, state);
      return res.status(200).json({ success: true, rooms });
    } catch (err) {
      console.error("Search failed:", err);
      return res.status(500).json({ success: false, message: "Search failed. Try again." });
    }
  }
}

export default SearchRoomsController;
