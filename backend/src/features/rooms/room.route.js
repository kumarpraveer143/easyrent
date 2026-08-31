import express from "express";
import RoomController from "./room.controller.js";
import landOwnerAuth from "../../middleware/landOwners.js";
import adminAuth from "../../middleware/adminAuth.js";
import { requireAuth, authorize } from "../../middleware/authorize.js";

const roomRouter = express.Router();
const roomController = new RoomController();

/**
 * `landOwnerAuth` only ever asked "are you A landowner". Every route below
 * that takes a room id now ALSO asserts you own THAT room — previously any
 * landlord account could delete, re-price or re-list any other landlord's
 * room by id.
 */

// Browsing available rooms is public — a listing site nobody can see without
// an account has no acquisition channel. (Full public listing pages: B29.)
roomRouter.get("/availableRoom", (req, res) => roomController.getAvailableRoom(req, res));

roomRouter.get("/roomDetails/:id", requireAuth, (req, res) =>
  roomController.getRoomDetails(req, res)
);

// The owner is taken from the session, never from a client-supplied cookie.
roomRouter.post("/", landOwnerAuth, (req, res) => roomController.registerRoom(req, res));

roomRouter.get("/myRoom", landOwnerAuth, (req, res) =>
  roomController.getRoomsByOwnerId(req, res)
);

roomRouter.delete("/:id", landOwnerAuth, authorize("room"), (req, res) =>
  roomController.deleteRoom(req, res)
);

roomRouter.put("/:id", landOwnerAuth, authorize("room"), (req, res) =>
  roomController.updateRoom(req, res)
);

roomRouter.post(
  "/toggle-room/:roomId",
  landOwnerAuth,
  authorize("room", { key: "roomId" }),
  (req, res) => roomController.toggleRoomAssign(req, res)
);

roomRouter.get("/getAllRoomsDetails", adminAuth, (req, res) =>
  roomController.getAllRoom(req, res)
);

roomRouter.get("/unAvailableRoom", adminAuth, (req, res) =>
  roomController.getUnAvailableRoom(req, res)
);

export default roomRouter;
