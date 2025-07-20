import mongoose from "mongoose";
import requestSchema from "./request.schema.js";

const requestModel = mongoose.model("Request", requestSchema);

class RequestRepository {
  async toggleRequest(renterId, roomId) {
    const existingRequest = await requestModel.findOne({ renterId, roomId });
    try {
      if (!existingRequest) {
        const newRequest = new requestModel({ renterId, roomId });
        await newRequest.save();
        return newRequest;
      } else {
        const deletedRequest = await requestModel.findOneAndDelete({
          renterId,
          roomId,
        });
        return deletedRequest;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteAllRequest(roomId) {
    const request = await requestModel.deleteMany({ roomId });
    return request;
  }

  async getRequest(renterId, roomId) {
    try {
      const request = await requestModel.findOne({ renterId, roomId });
      return request ? true : false;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteRequestByRandR(renterId, roomId) {
    const deletedRequest = await requestModel.findOneAndDelete({
      renterId,
      roomId,
    });
    return deletedRequest;
  }

  async getUser(roomId) {
    const user = await requestModel.find({ roomId }).populate("renterId");
    return user;
  }
}
export default RequestRepository;
