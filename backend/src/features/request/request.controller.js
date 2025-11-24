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
      const result = await this.requestRespoitory.toggleRequest(
        userId,
        roomId
      );

      const { request: switchRequest, action } = result || {};

      if (switchRequest) {
        // Get user details
        const user = await this.userRepository.getUserById(userId);
        const userName = user ? user.name : "Someone";

        // Get room details to find owner
        const roomDetails = await this.requestRespoitory.getRoomDetails(roomId);
        if (roomDetails) {
          let notificationType = null;
          let notificationMessage = null;

          if (action === 'created') {
            notificationType = 'request_received';
            notificationMessage = `${userName} is requested for the room ${roomDetails.roomNumber || 'N/A'}`;
          } else if (action === 'deleted') {
            notificationType = 'request_withdrawn';
            notificationMessage = `${userName} withdrew the request for room ${roomDetails.roomNumber || 'N/A'}`;
          }

          if (notificationType) {
            // Create notification in database
            const notification = await this.notificationRepository.createNotification({
              userId: roomDetails.owner,
              type: notificationType,
              message: notificationMessage,
              roomId: roomId,
              roomNumber: roomDetails.roomNumber || 'N/A',
            });

            // Emit real-time notification via socket
            emitToUser(roomDetails.owner.toString(), 'notification', {
              type: notificationType,
              message: notification.message,
              roomId: roomId,
              roomNumber: roomDetails.roomNumber || 'N/A',
              createdAt: notification.createdAt,
            });
          }
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
