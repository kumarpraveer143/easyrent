import express from "express";
import FavouriteController from "./favourite.controller.js";
import jwtAuth from "../../middleware/jwtAuth.js";
import validate from "../../middleware/validate.js";
import { roomIdParam } from "../../validation/schemas.js";

const favouriteRouter = express.Router();

const favouriteController = new FavouriteController();

// SEC-13: toggling a favourite on GET mutates state, so it is CSRF-able and
// can be tripped by a link prefetcher. POST is the real route; the GET stays
// until the client is migrated off it.
favouriteRouter.post("/toggle/:id", jwtAuth, validate({ params: roomIdParam }), (req, res) => {
  favouriteController.toggleFavourite(req, res);
});

favouriteRouter.get("/toggle/:id", jwtAuth, validate({ params: roomIdParam }), (req, res) => {
  favouriteController.toggleFavourite(req, res);
});

favouriteRouter.get("/myfavourite", jwtAuth, (req, res) => {
  favouriteController.getFavourite(req, res);
});

favouriteRouter.get("/isFabRoom/:id", jwtAuth, validate({ params: roomIdParam }), (req, res) => {
  favouriteController.isFabRoom(req, res);
});

export default favouriteRouter;
