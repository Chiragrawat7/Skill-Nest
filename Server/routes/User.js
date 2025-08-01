const express = require("express");
const router = express.Router();

const {
  logIn,
  signUp,
  createOtp,
  changePassword,
} = require("../controllers/Auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetPassword");

const { auth } = require("../middlewares/auth");

router.post("/login", logIn);
router.post("/signup", signUp);
router.post("/sendotp", createOtp);
router.post("/changepassword", auth, changePassword);

router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

module.exports = router;
