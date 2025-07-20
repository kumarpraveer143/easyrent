import express from "express";
import SearchRoomsController from "./searchRooms.controller.js";

const searchRoomRouter = express.Router();

const searchRoomController = new SearchRoomsController();

searchRoomRouter.get("/state", (req, res) => {
  searchRoomController.search(req, res);
});

export default searchRoomRouter;
