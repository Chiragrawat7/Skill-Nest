const User = require("../models/User");
const { mailSender } = require("../utils/mailSender");
const bcrypt = require("bcrypt")
const crypto=require("crypto")
require("dotenv").config();

// reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from req body
    const { email } = req.body;

    // check email exist
    const userExist = await User.findOne({ email:email });
    if (!userExist) {
      return res.status(401).json({
        success: false,
        message: "Email not found",
      });
    }

    // create token
    const token = crypto.randomBytes(20).toString("hex");

    // Add token in User DB and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email },
      {
        token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );
    // create url
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail containing url
    await mailSender(email,"Password Reset",
			`Your Link for email verification is ${url}. Please click this url to reset your password.`);

    // send response
    return res.status(200).json({
      success: true,
      message: "eamil sent Successfully",
    });

  } catch (error) {
    console.log("error in sending reset link to the mail " + error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    // get passwords
    const { password, confirmPassword, token } = req.body;

    // validate
    if (!password || !confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "please enter both passwords",
      });
    }
    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "please check the password again",
      });
    }
    // get user details from db using token
    const userDetails = await User.findOne({ token });

    // if no entry present - invalid token
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "token invalid",
      });
    }
    // token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "token Expired please regenerate your token",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update password in db
    const updateUser = await User.findOneAndUpdate(
      { token },
      {
        password: hashedPassword,
      },
      { new: true }
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Password Updated successfully",
    });
    
  } catch (error) {
    console.log("error while reseting password" + error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
