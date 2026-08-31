import rateLimit from "express-rate-limit";

/**
 * There was no rate limiting anywhere.
 *
 * That made login and the password-reset endpoint freely brute-forceable, and
 * turned `POST /api/users/password/forget` into an open relay: it sends a real
 * email for any address supplied, with no cost to the caller.
 */

const message = {
  success: false,
  message: "Too many attempts. Wait a few minutes and try again.",
};

/** Sign-in and sign-up. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message,
});

/** Anything that causes us to send an email. Deliberately tighter. */
export const mailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message,
});

/** A broad backstop for the rest of the API. */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message,
});
