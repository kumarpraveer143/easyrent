import { History as HistoryModel } from "../../models/index.js";

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
    return await HistoryModel.find({ relationId }).sort({ date: -1 });
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
