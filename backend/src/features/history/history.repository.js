import mongoose from "mongoose";
import HistorySchema from "./history.schema.js";

const HistoryModel = mongoose.model("History", HistorySchema);

class HistoryRepository {
  async createHistory(historyObj) {
    try {
      const history = new HistoryModel(historyObj);
      await history.save();
      return history;
    } catch (err) {
      if (err.code === 11000) {
        throw new Error("This relation already exists.");
      }
      throw err;
    }
  }

  async getRenterHistory(relationId) {
    const history = HistoryModel.find({ relationId }).sort({ date: -1 });
    return history;
  }

  async updateHisotry(historyId, updatedHistory) {
    const history = await HistoryModel.findOneAndUpdate(
      { _id: historyId },
      { ...updatedHistory }
    );
    return history;
  }

  async deleteHistory(id) {
    const history = await HistoryModel.findOneAndDelete({ _id: id });
    return history;
  }
}

export default HistoryRepository;
