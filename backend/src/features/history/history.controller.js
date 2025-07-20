import HistoryRepository from "./history.repository.js";

class HistoryController {
  constructor() {
    this.historyRepository = new HistoryRepository();
  }

  async createHistory(req, res) {
    const { relationId } = req.params;
    const historyObj = req.body;
    historyObj.relationId = relationId;
    try {
      const history = await this.historyRepository.createHistory(historyObj);
      return res.status(200).json({ success: true, history });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async getRenterHistory(req, res) {
    const { relationId } = req.params;
    try {
      const history = await this.historyRepository.getRenterHistory(relationId);
      return res.status(200).json({ success: true, history: history });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async updateRenterHistory(req, res) {
    const { historyId } = req.params;
    const newData = req.body;
    try {
      const updatedHistory = await this.historyRepository.updateHisotry(
        historyId,
        newData
      );
      return res
        .status(200)
        .json({ success: true, updatedHistory: updatedHistory });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async delelteHistory(req, res) {
    const { historyId } = req.params;
    try {
      const deltedHistory = await this.historyRepository.deleteHistory(
        historyId
      );
      return res
        .status(200)
        .json({ success: true, deltedHistory: deltedHistory });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}

export default HistoryController;
