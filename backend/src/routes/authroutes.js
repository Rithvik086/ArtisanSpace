import express from "express";

import {
  forgotPasswordRender,
  forgotPasswordEmail,
  forgotPasswordOtp,
  forgotPasswordNewPassword,
  signup,
  login,
  logout,
} from "../controller/authcontroller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.get("/password/reset", forgotPasswordRender);
router.post("/password/reset", forgotPasswordEmail);
router.post("/password/otp", forgotPasswordOtp);
router.post("/password/new", forgotPasswordNewPassword);

export default router;
