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
}

export default SearchRoomsController;
