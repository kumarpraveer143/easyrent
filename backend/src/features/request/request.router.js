import express from "express";
import RequestController from "./request.controller.js";
import landOwnerAuth from "../../middleware/landOwners.js";
import { requireAuth, requireRole, authorize } from "../../middleware/authorize.js";

const requestRouter = express.Router();
const requestController = new RequestController();

/**
 * Applying for a room is a RENTER action — a landowner had no business
 * creating applications, and nothing stopped them.
 *
 * Listing the applicants for a room was gated on `landOwnerAuth` alone, so any
 * landowner account could enumerate the applicants of ANY room. That is how
 * the PII in SEC-09 was reachable at scale, and the adversarial proof caught
 * it still open after the first pass at SEC-06.
 */

// Apply for / withdraw from a room.
requestRouter.post("/:id", requireAuth, requireRole("renter"), (req, res) =>
  requestController.toggleRequest(req, res)
);

// Have I applied for this room?
requestRouter.get("/users/:id", landOwnerAuth, authorize("room", { key: "id" }), (req, res) =>
  requestController.getUsers(req, res)
);

requestRouter.get("/:id", requireAuth, (req, res) => requestController.getRequest(req, res));

export default requestRouter;
