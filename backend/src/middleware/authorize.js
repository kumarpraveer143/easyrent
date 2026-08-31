import jwt from "jsonwebtoken";
import { User, Room, Relationship, History } from "../models/index.js";

/**
 * Authentication and authorisation, in one place.
 *
 * The old middleware answered only two questions — "is this a valid token?"
 * (jwtAuth) and "is this person A landowner?" (landOwnerAuth). Neither ever
 * asked "does this person own THIS room / THIS tenancy / THIS payment", so any
 * landlord account could delete another landlord's room, accept their
 * applicants, or permanently delete a tenancy and all of its payment history.
 *
 * Worse, several controllers read the actor's id from `req.cookies.userId` —
 * an unsigned cookie any HTTP client can set to anything — rather than from
 * the signed JWT. Identity was spoofable with one header.
 *
 * Everything here derives identity from the signed token only.
 */

/** 401 / 403 helpers so every failure has the same shape. */
const deny = (res, status, message) => res.status(status).json({ success: false, message });

/**
 * Verifies the JWT and loads the actor. Sets:
 *   req.userId — string id, from the SIGNED token (never a cookie)
 *   req.user   — the User document
 *
 * Replaces jwtAuth. Also accepts a bearer token so the API is testable
 * without a cookie jar.
 */
export async function requireAuth(req, res, next) {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  const token = req.cookies?.token ?? bearer;

  if (!token) return deny(res, 401, "You need to be signed in.");

  let payload;
  try {
    payload = jwt.verify(token, process.env.SECRET_KEY);
  } catch {
    return deny(res, 401, "Your session has expired. Please sign in again.");
  }

  const user = await User.findById(payload.id);
  if (!user) return deny(res, 401, "Your session is no longer valid. Please sign in again.");

  req.userId = user._id.toString();
  req.user = user;
  next();
}

/** Role gate. Use AFTER requireAuth. Does not imply ownership of anything. */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return deny(res, 401, "You need to be signed in.");
    if (!roles.includes(req.user.userType)) {
      return deny(res, 403, "You don't have access to this.");
    }
    next();
  };
}

/** Pull an id out of params, body or query without guessing. */
function readId(req, from, key) {
  const bag = from === "body" ? req.body : from === "query" ? req.query : req.params;
  return bag?.[key];
}

/**
 * The ownership gate. `authorize(action, resource)` in practice.
 *
 * Each loader fetches the resource, decides whether the actor may act on it,
 * and stashes it on `req` so the controller doesn't re-fetch.
 */
const RESOURCES = {
  /** A room belongs to exactly one landowner. */
  room: {
    async load(id) {
      return Room.findById(id);
    },
    owns(doc, req) {
      return doc.owner?.toString() === req.userId;
    },
    attach: "room",
    missing: "Room not found.",
  },

  /**
   * A tenancy has two legitimate parties. `roles` narrows it further — rent
   * records may only be created by the owner, for example.
   */
  relationship: {
    async load(id) {
      return Relationship.findById(id);
    },
    owns(doc, req, { parties = ["owner", "renter"] } = {}) {
      const asOwner = parties.includes("owner") && doc.ownerId?.toString() === req.userId;
      const asRenter = parties.includes("renter") && doc.renterId?.toString() === req.userId;
      return asOwner || asRenter;
    },
    attach: "relationship",
    missing: "Tenancy not found.",
  },

  /** A payment record is reachable through its tenancy. */
  history: {
    async load(id) {
      return History.findById(id);
    },
    async owns(doc, req, { parties = ["owner", "renter"] } = {}) {
      const rel = await Relationship.findById(doc.relationId);
      if (!rel) return false;
      const asOwner = parties.includes("owner") && rel.ownerId?.toString() === req.userId;
      const asRenter = parties.includes("renter") && rel.renterId?.toString() === req.userId;
      return asOwner || asRenter;
    },
    attach: "history",
    missing: "Payment record not found.",
  },
};

/**
 * Usage:
 *   authorize("room", { from: "params", key: "id" })
 *   authorize("relationship", { from: "body", key: "relationId", parties: ["owner"] })
 */
export function authorize(kind, { from = "params", key = "id", parties } = {}) {
  const spec = RESOURCES[kind];
  if (!spec) throw new Error(`authorize(): unknown resource "${kind}"`);

  return async (req, res, next) => {
    if (!req.user) return deny(res, 401, "You need to be signed in.");

    const id = readId(req, from, key);
    if (!id) return deny(res, 400, `Missing ${key}.`);

    let doc;
    try {
      doc = await spec.load(id);
    } catch {
      // A malformed ObjectId is a client error, not a server one.
      return deny(res, 400, `That ${kind} id isn't valid.`);
    }
    if (!doc) return deny(res, 404, spec.missing);

    const allowed = await spec.owns(doc, req, { parties });
    if (!allowed) {
      // 404 rather than 403: don't confirm the resource exists to someone who
      // has no business knowing about it.
      return deny(res, 404, spec.missing);
    }

    req[spec.attach] = doc;
    next();
  };
}

/**
 * For the case where the actor claims to be acting on a room they own AND the
 * room id arrives in the body (accept / reject / relation lookups).
 */
export const ownsRoomInBody = (key = "roomId") =>
  authorize("room", { from: "body", key });
