import RoomRepository from "../rooms/room.repository.js";
import RequestRepository from "../request/request.respository.js";
import {
  Relationship as relationshipModel,
  History as historyModel,
  Room as RoomModel,
} from "../../models/index.js";

const roomRepository = new RoomRepository();
const requestRepository = new RequestRepository();

class RelationshipSchma {
  //repository of accept the request of the renters
  async acceptRequest(acceptObj) {
    const newRelationShip = new relationshipModel(acceptObj);
    const { roomId } = acceptObj;
    const room = await roomRepository.changeStatus(roomId);
    const request = await requestRepository.deleteAllRequest(roomId);
    await newRelationShip.save();
    return newRelationShip;
  }

  //repository to get all the renters profile based of room and lanowner id
  async getRentersDetail(ownerId) {
    const findRelations = await relationshipModel
      .find({ ownerId })
      .populate("renterId")
      .populate("roomId");

    const extractedDetails = findRelations.map((item) => ({
      renterStatus: item.status,
      relationId: item._id,
      // Narrowed from the raw User document — see SEC-09.
      renterDetails: item.renterId
        ? {
            _id: item.renterId._id,
            name: item.renterId.name,
            email: item.renterId.email,
            phoneNumber: item.renterId.phoneNumber,
          }
        : null,
      roomDetails: {
        roomNumber: item.roomId.roomNumber,
        roomId: item.roomId._id,
        roomType: item.roomId.roomType,
        rentPrice: item.roomId.rentPrice,
      },
    }));

    // let renters = findRelations.map((rel) => rel.renterId);
    return extractedDetails;
  }

  //find if a room is there in relation or not
  async findRelationByRoomId(roomId) {
    const relation = await relationshipModel.findOne({ roomId });
    return relation;
  }

  //remove the renters from the landowner house
  async changeStatus(relationId) {
    const relation = await relationshipModel.findOne({ _id: relationId });
    if (!relation) return null;

    relation.status = "archive";
    await relation.save();

    // BUG-02: acceptRequest sets isAvailable = false and nothing ever set it
    // back, so every room that was ever let vanished from search permanently.
    await RoomModel.findByIdAndUpdate(relation.roomId, { isAvailable: true });

    return relation;
  }

  //delete relations
  async deleteRenter(relationId) {
    const deletedRelation = await relationshipModel.findOneAndDelete({
      _id: relationId,
    });
    const deleteHistory = await historyModel.deleteMany({
      relationId: relationId,
    });
    return deletedRelation;
  }

  //get details of room
  async getRoomDetails(userId) {
    const room = await relationshipModel
      .findOne({
        renterId: userId,
        status: "active",
      })
      .populate("roomId")
      .populate("ownerId");

    // BUG-07: this used to read room._id straight away, so a renter with no
    // active tenancy — the state EVERY renter starts in — got a 500 on the
    // "My room" page instead of an empty state.
    if (!room) return null;

    let extractedData = {
      relationId: room._id,
      renterId: room.renterId,
      ownerId: room.ownerId._id,
      houseName: room.ownerId.houseName,
      ownerNumber: room.ownerId.phoneNumber,
      ownerName: room.ownerId.name,
      ownerEmail: room.ownerId.email,
      roomDetails: room.roomId,
    };
    return extractedData;
  }

  //get histories of renter by renter id
  async getHistoriesOfRenter(userId) {
    const relation = await relationshipModel.findOne({
      renterId: userId,
      status: "active",
    });
    if (!relation) return [];
    const relationId = relation._id;
    const history = await historyModel.find({ relationId }).sort({ date: -1 });
    return history;
  }

  //this is searh from the renters id
  async isEngaged(userId) {
    const isEngaged = await relationshipModel.findOne({
      renterId: userId,
    });
    if (isEngaged == null) {
      return false;
    }
    if (isEngaged.status === "active") {
      return true;
    } else {
      return false;
    }
  }

  //this is searh from the landowner id
  async isArchieve(userId, relationId) {
    const isArchieve = await relationshipModel.findOne({
      ownerId: userId,
      _id: relationId,
    });
    if (!isArchieve) return false;
    if (isArchieve.status == "active") {
      return true;
    } else {
      return false;
    }
  }

  //is the room exist in the relation or not!
  async isRelation(roomId) {
    const isRelation = await relationshipModel.findOne({
      roomId: roomId,
    });
    if (isRelation) {
      return true;
    } else {
      return false;
    }
  }
}

export default RelationshipSchma;
