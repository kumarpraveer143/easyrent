import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendWelcomeEmail from "../../util/email/welcomeMail.js";
import sendPasswordResetEmail from "../../util/email/resetPassword.js";
import crypto from "crypto";

/**
 * The ONLY shape a user is allowed to leave the API in.
 *
 * Handlers used to return raw mongoose documents, which carry the password
 * hash (when selected), and — for applicant/tenant listings — date of birth,
 * home address and, until it was dropped, the Aadhaar number.
 */
export function publicUser(doc) {
  if (!doc) return null;
  const u = doc.toObject ? doc.toObject() : doc;
  return {
    _id: u._id,
    name: u.name,
    email: u.email,
    userType: u.userType,
    phoneNumber: u.phoneNumber,
    houseName: u.houseName,
    createdAt: u.createdAt,
  };
}

/** Even narrower: what a landlord may see about an applicant. */
export function applicantUser(doc) {
  if (!doc) return null;
  const u = doc.toObject ? doc.toObject() : doc;
  return { _id: u._id, name: u.name, email: u.email, phoneNumber: u.phoneNumber };
}

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  //get all user controller (admin controllers)
  async getAllUsers(req, res) {
    try {
      const users = await this.userRepository.getAllUsers();
      return res.status(200).json({ success: true, users: users.map(publicUser) });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  //user register controller
  async registerUser(req, res) {
    try {
      const { email } = req.body;

      // SEC-03: req.body used to be handed straight to the model, and
      // `userType` is a normal schema field whose enum includes "admin" — so a
      // signup request carrying "userType": "admin" created an admin account.
      // Only these fields are ever accepted, and the role is clamped.
      const {
        name,
        password,
        phoneNumber,
        dateOfBirth,
        homeAddress,
        houseName,
        userType,
      } = req.body;

      const user = {
        name,
        email,
        password,
        phoneNumber,
        dateOfBirth,
        homeAddress,
        ...(houseName !== undefined && { houseName }),
        userType: userType === "landowner" ? "landowner" : "renter",
      };
      // Check if email already exists in the database
      const findUserByEmail = await this.userRepository.findUserByEmail({
        email,
      });

      if (findUserByEmail) {
        return res.status(401).json({
          success: false,
          message: "Email already registered!",
        });
      }

      const registeredUser = await this.userRepository.registerUser(user);
      sendWelcomeEmail(user);

      return res.status(201).json({ success: true, user: publicUser(registeredUser) });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        const validationErrors = Object.values(err.errors).map(
          (e) => e.message
        );
        return res.status(400).json({
          success: false,
          message: "Validation error(s): " + validationErrors.join(", "),
        });
      }

      return res.status(500).json({
        success: false,
        message: err.message || "Something went wrong with the database",
      });
    }
  }

  //user login controller
  async loginUser(req, res) {
    const { email } = req.body;
    try {
      const user = await this.userRepository.findUserByEmail({ email }, true);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found! Register yourself now!!",
        });
      }

      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isValidPassword) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid Username or Password" });
      }

      const jwtToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_Expire,
      });

      return res
        .cookie("token", jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        })
        .cookie("userId", user._id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        })
        .status(200)
        // SEC-08: this used to return `user` — the document fetched with
        // .select("+password") — so every login handed the browser the bcrypt
        // hash, which the frontend then wrote to localStorage.
        .json({ success: true, user: publicUser(user) });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        err,
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  //user logout controller
  async logout(req, res) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res.clearCookie("userData", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res.clearCookie("userId", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logout Successfully!" });
  }

  //user edit controller
  async editProfile(req, res) {
    try {
      // requireAuth already verified the token and loaded the user.
      const id = req.userId;

      // Explicitly filter allowed fields to avoid updating sensitive/immutable data
      const allowedFields = ['name', 'phoneNumber', 'dateOfBirth', 'homeAddress', 'houseName'];
      const updateData = {};

      Object.keys(req.body).forEach(key => {
        if (allowedFields.includes(key)) {
          updateData[key] = req.body[key];
        }
      });

      const updatedUser = await this.userRepository.updateUserById(id, updateData);

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Profile updated.", user: publicUser(updatedUser) });
    } catch (err) {
      console.error("Error updating profile:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  }

  //user forget password controller
  async forgetPassword(req, res) {
    const { email } = req.body;
    try {
      const user = await this.userRepository.findUserByEmail({ email }, true);

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "User not found!" });
      }

      const token = await user.getResetPasswordToken();
      // console.log(token);
      sendPasswordResetEmail(user, token);
      console.log("Email sent");
      res.status(200).json({
        success: true,
        message: "The reset link is send to your gmail!",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        err,
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  //reset password controller
  async resetPassword(req, res) {
    const { token } = req.params;

    const hashedPassword = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await this.userRepository.findUserForPasswordReset(
      hashedPassword
    );

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token!" });
    }
    const { password, confirmPassword } = req.body;

    if (!password || password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "mismatch new password and confirm password!",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  }

  //delete user controller
  async deleteUser(req, res) {
    try {
      // BUG-12: this read req.body.id while the route supplies :id, so it
      // always deleted nothing and still reported success.
      const deletedUser = await this.userRepository.deleteUser(req.params.id);
      if (!deletedUser) {
        return res
          .status(400)
          .json({ success: false, message: "No user found with provided id" });
      }
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully!" });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  //get all the renters controller
  async getAllRenters(req, res) {
    try {
      const renters = await this.userRepository.getAllRenters();
      return res.status(200).json({ success: true, message: renters.map(publicUser) });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  //get all the landlord controller
  async getAllLandlords(req, res) {
    try {
      const landlords = await this.userRepository.getAllLandlords();
      return res.status(200).json({ success: true, message: landlords.map(publicUser) });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }
}
