import RequestRepository from "./request.respository.js";

class RequestController {
  constructor() {
    this.requestRespoitory = new RequestRepository();
  }
  async toggleRequest(req, res) {
    const userId = req.userId;
    const roomId = req.params.id;
    try {
      const switchRequest = await this.requestRespoitory.toggleRequest(
        userId,
        roomId
      );
      return res.status(200).json({ success: true, request: switchRequest });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  async getRequest(req, res) {
    const userId = req.userId;
    const roomId = req.params.id;
    try {
      const request = await this.requestRespoitory.getRequest(userId, roomId);
      if (request) {
        return res.status(200).json({ success: true, message: true });
      } else {
        return res.status(200).json({ success: true, message: false });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  async getUsers(req, res) {
    const roomId = req.params.id;
    try {
      const user = await this.requestRespoitory.getUser(roomId);
      const extractedUser = user.map((u) => u.renterId);
      return res.status(200).json({ success: true, users: extractedUser });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }
}

export default RequestController;
