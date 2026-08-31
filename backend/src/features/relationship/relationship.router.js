import express from "express";
import RelationshipController from "./relationship.controller.js";
import landOwnerAuth from "../../middleware/landOwners.js";
import { requireAuth, authorize, ownsRoomInBody } from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";
import {
  acceptSchema,
  rejectSchema,
  roomIdBody,
  relationIdBody,
  objectId,
} from "../../validation/schemas.js";
import { z } from "zod";

const relationshipRouter = express.Router();
const relationshipController = new RelationshipController();

/**
 * The worst IDORs in the app lived here.
 *
 * `removeRenter` and `deleteRenter` took a relationId from the request with no
 * ownership check at all, so any landlord account could archive — or
 * PERMANENTLY DELETE — any other landlord's tenancy. `deleteRenter` also runs
 * `historyModel.deleteMany({ relationId })`, so that took every rent payment
 * record with it.
 *
 * Meanwhile the renter-facing routes read the actor from `req.cookies.userId`,
 * so setting one cookie header returned somebody else's room, their landlord's
 * phone number and email, and their full payment history.
 */

// --- Landlord side: must own the ROOM being acted on -------------------------

relationshipRouter.post(
  "/accept",
  landOwnerAuth,
  validate({ body: acceptSchema }),
  ownsRoomInBody(),
  (req, res) =>
  relationshipController.accept(req, res)
);

relationshipRouter.post(
  "/reject",
  landOwnerAuth,
  validate({ body: rejectSchema }),
  ownsRoomInBody(),
  (req, res) =>
  relationshipController.rejectRequest(req, res)
);

relationshipRouter.post(
  "/isRelationship",
  landOwnerAuth,
  validate({ body: roomIdBody }),
  ownsRoomInBody(),
  (req, res) =>
  relationshipController.isRoomAvailable(req, res)
);

relationshipRouter.post(
  "/relationByRoomId",
  landOwnerAuth,
  validate({ body: roomIdBody }),
  ownsRoomInBody(),
  (req, res) =>
  relationshipController.relationByRoomId(req, res)
);

// --- Landlord side: must own the TENANCY being acted on ----------------------

relationshipRouter.post(
  "/removeRenter",
  landOwnerAuth,
  validate({ body: relationIdBody }),
  authorize("relationship", { from: "body", key: "relationId", parties: ["owner"] }),
  (req, res) => relationshipController.removeRenter(req, res)
);

relationshipRouter.delete(
  "/deleteRenter/:id",
  landOwnerAuth,
  validate({ params: z.object({ id: objectId }) }),
  authorize("relationship", { from: "params", key: "id", parties: ["owner"] }),
  (req, res) => relationshipController.deleteRenter(req, res)
);

relationshipRouter.post(
  "/isArchieve",
  landOwnerAuth,
  validate({ body: relationIdBody }),
  authorize("relationship", { from: "body", key: "relationId", parties: ["owner"] }),
  (req, res) => relationshipController.isArchieve(req, res)
);

// Scoped to the caller by req.userId inside the controller.
relationshipRouter.get("/getRenters", landOwnerAuth, (req, res) =>
  relationshipController.getRenters(req, res)
);

// --- Renter side: always scoped to req.userId, never a cookie ----------------

relationshipRouter.get("/getRoomDetails", requireAuth, (req, res) =>
  relationshipController.getRoomDetailsByRenterId(req, res)
);

relationshipRouter.get("/historyOfRenter", requireAuth, (req, res) =>
  relationshipController.getHistoryOfRenter(req, res)
);

relationshipRouter.get("/engaged", requireAuth, (req, res) =>
  relationshipController.engaged(req, res)
);

export default relationshipRouter;
