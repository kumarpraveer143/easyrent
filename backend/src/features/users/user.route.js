import express from "express";
import UserController from "./user.controller.js";
import adminAuth from "../../middleware/adminAuth.js";
import jwtAuth from "../../middleware/jwtAuth.js";
import { authLimiter, mailLimiter } from "../../middleware/rateLimit.js";

const userRouter = express.Router();
const userController = new UserController();

//get all the users
userRouter.get("/", adminAuth, (req, res) => {
  userController.getAllUsers(req, res);
});

//get all the landowners
userRouter.get("/landowners-list", adminAuth, (req, res) => {
  userController.getAllLandlords(req, res);
});

//get all the Renters
userRouter.get("/renters-list", adminAuth, (req, res) => {
  userController.getAllRenters(req, res);
});

//route to register user
userRouter.post("/register", authLimiter, (req, res) => {
  userController.registerUser(req, res);
});

//route to login user
userRouter.post("/login", authLimiter, (req, res) => {
  userController.loginUser(req, res);
});

//route to logout user
userRouter.post("/logout", (req, res) => {
  userController.logout(req, res);
});

//route to edit user
userRouter.put("/editprofile", jwtAuth, (req, res) => {
  userController.editProfile(req, res);
});

//route to delete user
userRouter.delete("/delete/:id", adminAuth, (req, res) => {
  userController.deleteUser(req, res);
});

//route of forget password
userRouter.post("/password/forget", mailLimiter, (req, res) => {
  userController.forgetPassword(req, res);
});

//route to reset password
userRouter.post("/password/reset/:token", authLimiter, (req, res) => {
  userController.resetPassword(req, res);
});

// BUG-11: `updatePassword` was an unfinished stub — it called
// `this.userRepository(...)` as if the repository were a function, so the
// route threw on every call — and it carried no auth at all. Removed rather
// than left exposed; it comes back with the rest of account settings.

export default userRouter;
