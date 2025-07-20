import RequestRepository from "../request/request.respository.js";
import RelationshipSchma from "./relationship.repository.js";

class RelationshipController {
  constructor() {
    this.relaltionshipRepository = new RelationshipSchma();
    this.requestRepository = new RequestRepository();
  }

  async accept(req, res) {
    const ownerId = req.userId;
    const { roomId, renterId } = req.body;

    try {
      const newRequest = await this.relaltionshipRepository.acceptRequest({
        ownerId,
        roomId,
        renterId,
      });
      return res
        .status(200)
        .json({ success: true, message: "Added to your room" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  async rejectRequest(req, res) {
    const { renterId, roomId } = req.body;
    try {
      const rejectedReq = await this.requestRepository.deleteRequestByRandR(
        renterId,
        roomId
      );
      return res.status(200).json({ success: true, message: rejectedReq });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  async getRenters(req, res) {
    const ownerId = req.userId;
    try {
      const renters = await this.relaltionshipRepository.getRentersDetail(
        ownerId
      );
      return res.status(200).json({ success: true, renters: renters });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
    // const users = await this.relaltionshipRepository.getRentersDetail();
  }

  //is the room is available or not!
  async isRoomAvailable(req, res) {
    const roomId = req.body.roomId;
    try {
      const room = await this.relaltionshipRepository.findRelationByRoomId(
        roomId
      );
      let result = room?.status === "active" ? true : false;
      return res.status(200).json({ success: true, renters: result });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  async removeRenter(req, res) {
    let { relationId } = req.body;
    try {
      const relation = await this.relaltionshipRepository.changeStatus(
        relationId
      );
      return res
        .status(200)
        .json({ success: true, relation: "Renter Archived!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  //controller to delete relation.
  async deleteRenter(req, res) {
    const relationId = req.params.id;
    try {
      const deletedUser = await this.relaltionshipRepository.deleteRenter(
        relationId
      );
      return res
        .status(200)
        .json({ success: true, deletedRelation: deletedUser });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  async getRoomDetailsByRenterId(req, res) {
    let { userId } = req.cookies;
    try {
      const room = await this.relaltionshipRepository.getRoomDetails(userId);
      return res.status(200).json({ success: true, room: room });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  async getHistoryOfRenter(req, res) {
    let { userId } = req.cookies;
    try {
      const histories = await this.relaltionshipRepository.getHistoriesOfRenter(
        userId
      );
      return res.status(200).json({ success: true, histories: histories });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  //this is being searched by the renters side
  async engaged(req, res) {
    let { userId } = req.cookies;
    try {
      const findRenterId = await this.relaltionshipRepository.isEngaged(userId);
      if (findRenterId) {
        return res.status(200).json({ success: true, message: true });
      } else {
        return res.status(200).json({ success: true, message: false });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  //this is being use by the landowner side
  async isArchieve(req, res) {
    let { userId } = req.cookies;
    let { relationId } = req.body;
    try {
      const findRenterId = await this.relaltionshipRepository.isArchieve(
        userId,
        relationId
      );
      if (findRenterId) {
        return res.status(200).json({ success: true, message: false });
      } else {
        return res.status(200).json({ success: true, message: true });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  async relationByRoomId(req, res) {
    const { roomId } = req.body;
    try {
      const isRelationship = await this.relaltionshipRepository.isRelation(
        roomId
      );
      if (isRelationship) {
        return res.status(200).json({ success: true, message: true });
      } else {
        return res.status(200).json({ success: true, message: false });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }
}

export default RelationshipController;
