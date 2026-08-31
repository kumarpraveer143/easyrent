import RoomRepository from "./room.repository.js";

export default class RoomController {
  constructor() {
    this.roomRepository = new RoomRepository();
  }

  async getRoomDetails(req, res) {
    const id = req.params.id;
    try {
      let rooms = await this.roomRepository.getRoomDetails(id);
      let { homeAddress, name, houseName } = rooms.owner;
      const cleanedRoom = { ...rooms, owner: { homeAddress, name, houseName } };
      res.json({ success: true, room: cleanedRoom });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  //registerRoom Controller
  async registerRoom(req, res) {
    // Owner comes from the SIGNED session, never a client-settable cookie.
    const { roomNumber, address, rentPrice, roomType, numberOfRooms, numberOfBathrooms } =
      req.body;
    const roomObj = {
      roomNumber,
      address,
      rentPrice,
      roomType,
      numberOfRooms,
      numberOfBathrooms,
      owner: req.userId,
    };
    try {
      const result = await this.roomRepository.registerRoom(roomObj);
      res.json({ success: true, room: result });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  //get all the room controller
  async getAllRoom(req, res) {
    try {
      const rooms = await this.roomRepository.allRooms();
      res.json({ success: true, rooms });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  //get room by owner id
  async getRoomsByOwnerId(req, res) {
    const ownerId = req.userId;
    try {
      const rooms = await this.roomRepository.getRoomsByOwnerId(ownerId);
      res.status(200).json({ success: true, message: rooms });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  //delete the room by id controller
  async deleteRoom(req, res) {
    const { id } = req.params;
    try {
      const result = await this.roomRepository.deleteRoom(id);
      if (result) {
        return res
          .status(200)
          .json({ success: true, message: "Room deleted successfully!" });
      } else {
        return res
          .status(404)
          .json({ success: true, message: "Room not found!" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  //update the room by id controller
  async updateRoom(req, res) {
    const roomId = req.params.id;
    const roomObj = req.body;
    try {
      const room = req.room ?? (await this.roomRepository.getRoomById(roomId));

      if (!room) {
        return res
          .status(404)
          .json({ success: false, message: "Room not found" });
      }

      // Whitelist: `owner` and `isAvailable` are not client-editable here.
      const { roomNumber, address, rentPrice, roomType, numberOfRooms, numberOfBathrooms } =
        roomObj;
      Object.assign(room, {
        ...(roomNumber !== undefined && { roomNumber }),
        ...(address !== undefined && { address }),
        ...(rentPrice !== undefined && { rentPrice }),
        ...(roomType !== undefined && { roomType }),
        ...(numberOfRooms !== undefined && { numberOfRooms }),
        ...(numberOfBathrooms !== undefined && { numberOfBathrooms }),
      });
      await room.save();
      return res.json({ success: true, message: room });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  //toggle room assingment controller
  async toggleRoomAssign(req, res) {
    const roomId = req.params.roomId;
    try {
      const room = req.room ?? (await this.roomRepository.getRoomById(roomId));
      if (!room) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }
      room.isAvailable = !room.isAvailable;
      await room.save();
      return res.json({ success: true, message: "Room is toggled!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  //get room by status available or not by landlords
  async getAvailableRoom(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 25;
      const offset = parseInt(req.query.offset) || 0;
      const rooms = await this.roomRepository.availableRoom(limit, offset);
      const totalCount = await this.roomRepository.availableRoomCount();
      res.status(200).json({ message: rooms, totalCount });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch available rooms" });
    }
  }

  async getUnAvailableRoom(req, res) {
    let rooms = await this.roomRepository.unAvailableRoom();
    return res.status(200).json({ success: true, message: rooms });
  }
}
