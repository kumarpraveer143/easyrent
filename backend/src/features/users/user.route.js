import express from "express";
import UserController from "./user.controller.js";
import adminAuth from "../../middleware/adminAuth.js";
import jwtAuth from "../../middleware/jwtAuth.js";
import { authLimiter, mailLimiter } from "../../middleware/rateLimit.js";
import validate from "../../middleware/validate.js";
import {
  registerSchema,
  loginSchema,
  editProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  objectId,
} from "../../validation/schemas.js";
import { z } from "zod";

const userRouter = express.Router();
const userController = new UserController();

// --- admin ------------------------------------------------------------------

userRouter.get("/", adminAuth, (req, res) => userController.getAllUsers(req, res));

userRouter.get("/landowners-list", adminAuth, (req, res) =>
  userController.getAllLandlords(req, res)
);

userRouter.get("/renters-list", adminAuth, (req, res) =>
  userController.getAllRenters(req, res)
);

userRouter.delete(
  "/delete/:id",
  adminAuth,
  validate({ params: z.object({ id: objectId }) }),
  (req, res) => userController.deleteUser(req, res)
);

// --- auth -------------------------------------------------------------------

userRouter.post("/register", authLimiter, validate({ body: registerSchema }), (req, res) =>
  userController.registerUser(req, res)
);

userRouter.post("/login", authLimiter, validate({ body: loginSchema }), (req, res) =>
  userController.loginUser(req, res)
);

userRouter.post("/logout", (req, res) => userController.logout(req, res));

// --- profile ----------------------------------------------------------------

userRouter.put(
  "/editprofile",
  jwtAuth,
  validate({ body: editProfileSchema }),
  (req, res) => userController.editProfile(req, res)
);

// --- password ---------------------------------------------------------------

userRouter.post(
  "/password/forget",
  mailLimiter,
  validate({ body: forgotPasswordSchema }),
  (req, res) => userController.forgetPassword(req, res)
);

userRouter.post(
  "/password/reset/:token",
  authLimiter,
  validate({
    params: z.object({ token: z.string().length(40, "That reset link isn't valid.") }),
    body: resetPasswordSchema,
  }),
  (req, res) => userController.resetPassword(req, res)
);

// BUG-11: `updatePassword` was an unfinished stub that called
// `this.userRepository(...)` as if it were a function, on an unauthenticated
// route. Removed rather than left exposed; it returns with account settings.

export default userRouter;
