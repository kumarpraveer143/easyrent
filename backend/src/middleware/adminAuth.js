import { requireAuth, requireRole } from "./authorize.js";

/**
 * Every admin route was unreachable.
 *
 * The old check read `payload.user?.userType`, but the login handler signs the
 * token as `{ id: user._id }` — there is no `user` key on the payload, so the
 * comparison always failed and all five admin routes returned 404. It also did
 * `res.cookie("userData", payload)`, writing the raw token payload back to the
 * browser for no reason.
 *
 * Now the role is read from the loaded user document.
 */
const adminAuth = [requireAuth, requireRole("admin")];

export default adminAuth;
