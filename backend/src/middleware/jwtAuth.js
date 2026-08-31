import { requireAuth } from "./authorize.js";

/**
 * Kept as a named file so existing route imports keep working, but it now
 * delegates to requireAuth — which loads the user and sets `req.user`, so
 * controllers never have to trust `req.cookies.userId` again.
 */
export default requireAuth;
