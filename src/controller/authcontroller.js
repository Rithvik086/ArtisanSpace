import {
  addUser,
  findUserByEmail,
  findUserByName,
  updateUserPassword,
} from "../services/userServices.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/emailService.js";
import {
  generateOtp,
  verifyOtp,
  verifyOtpExistence,
} from "../utils/otpGenerator.js";
import crypto from "crypto";

const signup = async (req, res) => {
  const { username, name, email, password, mobile_no, role } = req.body;

  // username = username.toLowerCase();
  // email = email.toLowerCase();
  // role = role.toLowerCase();

  const hashpass = await bcrypt.hash(password, 9);

  // const newUser = new User({ username, email, password: hashpass, role });
  // await newUser.save();
  try {
    await addUser(username, name, email, hashpass, mobile_no, role);
    await sendMail(
      email,
      "Welcome to ArtisanSpace!",
      `Dear ${name},\n\nThank you for registering with ArtisanSpace! We are thrilled to have you on board. Explore, connect, and enjoy the experience.\n\nIf you have any questions or need assistance, feel free to reach out to us.\n\nBest regards,\nThe ArtisanSpace Team`
    );
    res.redirect("/login");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // const user = await User.findOne({ username });
    const user = await findUserByName(username);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const ismatched = await bcrypt.compare(password, user.password);

    if (!ismatched) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      //modify to use https while in production during deployment
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 86400000,
    });

    // res.status(200).json({ message: "Login successful" });
    res.redirect(`/${user.role}`);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict",
  });

  res.redirect("/");
};

const forgotPasswordRender = async (req, res) => {
  res.render("forgotPassword");
};

const forgotPasswordEmail = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    const id1 = crypto.randomUUID();
    const id2 = crypto.randomUUID();

    const otp = await generateOtp(id1, id2, user._id.toString());

    if (
      !(await sendMail(
        user.email,
        "Reset Password",
        `Hello ${user.name},\n\nWe received a request to reset your password. Please use the following OTP to reset your password:\n\nOTP: ${otp}\n\nThis OTP is valid for 5 minutes. If you did not request a password reset, please ignore this email.\n\nBest regards,\nArtisanSpace Team`
      ))
    ) {
      return res.status(500).json({ success: false, message: "Server Error!" });
    }
    return res.status(200).json({ success: true, id: id1 });
  } catch (e) {
    throw new Error("Error in forgotPasswordEmail controller: " + e.message);
  }
};

const forgotPasswordOtp = async (req, res) => {
  try {
    const receivedOtp = parseInt(req.body.otp);
    const id = req.body.id;

    console.log(id, receivedOtp);
    if (!(id === undefined || receivedOtp === undefined)) {
      const response = await verifyOtp(id, receivedOtp);
      if (response) {
        return res.status(200).json({ success: true, id: response });
      }
    }
    res
      .status(400)
      .json({ success: false, message: "Invalid OTP or OTP expired!" });
  } catch (e) {
    throw new Error("Error in forgotPasswordOtp controller: " + e.message);
  }
};

const forgotPasswordNewPassword = async (req, res) => {
  try {
    const { id, password } = req.body;

    const userId = await verifyOtpExistence(id);
    if (!(userId && randomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request! trying to become smart ass X",
      });
    }

    if (id === undefined || password === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request!" });
    }

    const hashpass = await bcrypt.hash(password, 9);
    if (await updateUserPassword(userId, hashpass)) {
      return res
        .status(200)
        .json({ success: true, message: "Password updated" });
    }
    res.status(400).json({ success: false, message: "Password not updated" });
  } catch (e) {
    throw new Error(
      "Error in forgotPasswordNewPassword controller: " + e.message
    );
  }
};

export {
  signup,
  login,
  logout,
  forgotPasswordRender,
  forgotPasswordEmail,
  forgotPasswordOtp,
  forgotPasswordNewPassword,
};
