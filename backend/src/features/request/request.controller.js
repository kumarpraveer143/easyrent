import RequestRepository from "./request.respository.js";
import NotificationRepository from "../notification/notification.repository.js";
import UserRepository from "../users/user.repository.js";
import { emitToUser } from "../../config/socket.config.js";

class RequestController {
  constructor() {
    this.requestRespoitory = new RequestRepository();
    this.notificationRepository = new NotificationRepository();
    this.userRepository = new UserRepository();
  }
  async toggleRequest(req, res) {
    const userId = req.userId;
    const roomId = req.params.id;
    try {
      const switchRequest = await this.requestRespoitory.toggleRequest(
        userId,
        roomId
      );

      // If a new request was created (not deleted), send notification to landowner
      if (switchRequest && !switchRequest.deletedAt) {
        // Get user details
        const user = await this.userRepository.getUserById(userId);
        const userName = user ? user.name : "Someone";

        // Get room details to find owner
        const roomDetails = await this.requestRespoitory.getRoomDetails(roomId);
        if (roomDetails) {
          // Create notification in database
          const notification = await this.notificationRepository.createNotification({
            userId: roomDetails.owner,
            type: 'request_received',
            message: `${userName} is requested for the room ${roomDetails.roomNumber || 'N/A'}`,
            roomId: roomId,
            roomNumber: roomDetails.roomNumber || 'N/A',
          });

          // Emit real-time notification via socket
          emitToUser(roomDetails.owner.toString(), 'notification', {
            type: 'request_received',
            message: notification.message,
            roomId: roomId,
            roomNumber: roomDetails.roomNumber || 'N/A',
            createdAt: notification.createdAt,
          });
        }
      }

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
