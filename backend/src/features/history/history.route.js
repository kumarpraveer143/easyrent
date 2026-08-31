import express from "express";
import HistoryController from "./history.controller.js";
import { requireAuth, authorize } from "../../middleware/authorize.js";

const historyRouter = express.Router();
const historyController = new HistoryController();

/**
 * This router previously had NO middleware at all — not requireAuth, not a
 * role check, nothing. Create, read, update and delete on the rent ledger were
 * open to anyone on the internet: fabricate a payment, read a tenant's full
 * payment history, silently change an amount, or delete the evidence that rent
 * was ever paid.
 *
 * Every route now requires a signed session AND membership of the tenancy the
 * record belongs to. Writes are landlord-only: the landlord records the rent,
 * the tenant reads it.
 */

// Record a rent payment against a tenancy — the OWNER only.
historyRouter.post(
  "/:relationId",
  requireAuth,
  authorize("relationship", { from: "params", key: "relationId", parties: ["owner"] }),
  (req, res) => historyController.createHistory(req, res)
);

// Read a tenancy's payment history — either party.
historyRouter.get(
  "/:relationId",
  requireAuth,
  authorize("relationship", { from: "params", key: "relationId" }),
  (req, res) => historyController.getRenterHistory(req, res)
);

// Amend a payment record — the OWNER only.
historyRouter.patch(
  "/:historyId",
  requireAuth,
  authorize("history", { from: "params", key: "historyId", parties: ["owner"] }),
  (req, res) => historyController.updateRenterHistory(req, res)
);

// Delete a payment record — the OWNER only.
historyRouter.delete(
  "/:historyId",
  requireAuth,
  authorize("history", { from: "params", key: "historyId", parties: ["owner"] }),
  (req, res) => historyController.delelteHistory(req, res)
);

export default historyRouter;
