import { requireAuth, requireRole } from "./authorize.js";

/**
 * "Is this person a landowner?" — and nothing more.
 *
 * This is deliberately still only a ROLE check. It never implied ownership of
 * the thing being acted on, and the mistake was routes treating it as if it
 * did. Routes that touch a specific room or tenancy must now ALSO mount
 * `authorize("room" | "relationship", …)`.
 */
const landOwnerAuth = [requireAuth, requireRole("landowner")];

export default landOwnerAuth;
