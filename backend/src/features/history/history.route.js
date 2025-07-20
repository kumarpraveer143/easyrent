import express from "express";
import HistoryController from "./history.controller.js";
const historyRouter = express.Router();

const historyController = new HistoryController();

// get all history => /history
historyRouter.post("/:relationId", (req, res) => {
  historyController.createHistory(req, res);
});

// get renter payment history
historyRouter.get("/:relationId", (req, res) => {
  historyController.getRenterHistory(req, res);
});

//update the history route
historyRouter.patch("/:historyId", (req, res) => {
  historyController.updateRenterHistory(req, res);
});

//delte the histroy route
historyRouter.delete("/:historyId", (req, res) => {
  historyController.delelteHistory(req, res);
});

// historyRouter.patch("/updatePaymentHistory/:renterID", (req, response) => {});
export default historyRouter;
