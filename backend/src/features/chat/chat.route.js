import express from "express";
import { getMessages, getUnreadCount, markAsRead } from "./chat.controller.js";
import { requireAuth, authorize } from "../../middleware/authorize.js";

const chatRouter = express.Router();

/**
 * This router also had no middleware, so `GET /api/chat/:relationId` returned
 * any tenancy's private landlord–tenant conversation to anyone who could guess
 * an id. `POST /read` took a `userId` straight from the body.
 *
 * Every route now requires a session and membership of the tenancy. The actor
 * is taken from the token, never from the request body.
 */

chatRouter.get(
  "/:relationId",
  requireAuth,
  authorize("relationship", { from: "params", key: "relationId" }),
  getMessages
);

chatRouter.get(
  "/unread/:relationId",
  requireAuth,
  authorize("relationship", { from: "params", key: "relationId" }),
  getUnreadCount
);

chatRouter.post(
  "/read",
  requireAuth,
  authorize("relationship", { from: "body", key: "relationId" }),
  markAsRead
);

export default chatRouter;
