import express from "express";
import SearchRoomsController from "./searchRooms.controller.js";
import validate from "../../middleware/validate.js";
import { searchQuery } from "../../validation/schemas.js";

const searchRoomRouter = express.Router();

const searchRoomController = new SearchRoomsController();

searchRoomRouter.get("/state", validate({ query: searchQuery }), (req, res) => {
  searchRoomController.search(req, res);
});

searchRoomRouter.get("/district-state", validate({ query: searchQuery }), (req, res) => {
  searchRoomController.searchByDistrictAndState(req, res);
});

export default searchRoomRouter;
