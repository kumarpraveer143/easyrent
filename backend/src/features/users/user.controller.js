import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendWelcomeEmail from "../../util/email/welcomeMail.js";
import sendPasswordResetEmail from "../../util/email/resetPassword.js";
import crypto from "crypto";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  //get all user controller (admin controllers)
  async getAllUsers(req, res) {
    try {
      const users = await this.userRepository.getAllUsers();
      return res.status(200).json({ success: true, users: users });
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
      const user = req.body;
      const { email } = req.body;
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

      const registeredUser = await this.userRepository.registerUser(req.body);
      sendWelcomeEmail(user);

      return res
        .status(200)
        .json({ success: true, registeredUser: registeredUser });
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
          domain: process.env.NODE_ENV === "production" ? ".easyrentify.xyz" : undefined,
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .cookie("userId", user._id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          domain: process.env.NODE_ENV === "production" ? ".easyrentify.xyz" : undefined,
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .status(200)
        .json({ success: true, user });
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
      const token = req.cookies.token;
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      const id = payload.id;

      // Explicitly filter allowed fields to avoid updating sensitive/immutable data
      const allowedFields = ['name', 'phoneNumber', 'dateOfBirth', 'homeAddress', 'houseName', 'aadharCardNumber'];
      const updateData = {};

      Object.keys(req.body).forEach(key => {
        if (allowedFields.includes(key)) {
          updateData[key] = req.body[key];
        }
      });

      console.log("Updating user:", id);
      console.log("Filtered update data:", JSON.stringify(updateData, null, 2));

      const updatedUser = await this.userRepository.updateUserById(id, updateData);

      console.log("Updated user result:", updatedUser);

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "updated successfully!", user: updatedUser });
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

  //update the user password
  async updatePassword(req, res) {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    try {
      if (!currentPassword) {
        return res
          .status(401)
          .json({ success: false, message: "Please enter current password" });
      }
      const user = await this.userRepository({ _id: req.users._id }, true);
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }

  //delete user controller
  async deleteUser(req, res) {
    try {
      const deletedUser = await this.userRepository.deleteUser(req.body.id);
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
      return res.status(200).json({ success: true, message: renters });
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
      return res.status(200).json({ success: true, message: landlords });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong with database",
      });
    }
  }
}
