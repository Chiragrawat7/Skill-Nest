const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const { mailSender } = require("../utils/mailSender");
const {passwordUpdated}=require('../mails/templates/passwordUpdate')
require("dotenv").config();

// sendotp
exports.createOtp = async (req, res) => {
  try {
    // fetch email from body
    const { email } = req.body;

    // check if email already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(401).json({
        success: false,
        message: "user already exist",
      });
    }

    // create OTP for new user for signUp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp generated " + otp);

    // check unique otp or not
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }

    const otpPayload = { email, otp };

    // create an entry in db for otp
    const otpBody = await OTP.create(otpPayload);
    console.log("otp created successfully " + otpBody);

    return res.status(200).json({
      success: true,
      message: "otp sent successfully",
      otp,
    });
  } catch (error) {
    console.log("error in generating otp " + error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// signup
exports.signUp = async (req, res) => {
  try {
    // fetch data from req body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNo,
      otp,
    } = req.body;

    // validate data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "please enter all the feilds",
      });
    }

    // check if password are not same
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "password and confirm password value does not match, please check again passwords",
      });
    }

    // check if user already exist
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User Already Exist please sign in to continue",
      });
    }

    // *******************otp send karna hai shyd**********
    // this.sendOtp(req,res)

    // find most recent otp for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1); //??

    console.log("recent Otp " + recentOtp);

    // validate otp
    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Otp Not found",
      });
    } else if (otp !== recentOtp[0].otp) {
    const otpe = recentOtp[0].otp;
      return res.status(400).json({
        success: false,
        otp,
        otpe,
        message: "Invalid Otp",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a profile
    const profileDetails = await Profile.create({
      contactNumber: contactNo,
      gender: null,
      dateOfBirth: null,
      about: null,
    });

    // create entry in db
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      contactNo,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    // return response
    return res.status(200).json({
      success: true,
      user,
      message: "user is registered successfully",
    });
  } catch (error) {
    console.log("error in signing up " + error.message);
    return res.status(500).json({
      success: false,
      message: "User Cannot be registered please try again",
    });
  }
};

// login
exports.logIn = async (req, res) => {
  try {
    // fetch data
    const { email, password } = req.body;

    // validate data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Please enter all the fields",
      });
    }
    // check if user exists??
    const userExist = await User.findOne({ email }).populate('additionalDetails').exec();
    if (!userExist) {
      return res.status(401).json({
        success: false,
        message: "please sign Up first",
      });
    }

    // check if password is correct or not
    if (await bcrypt.compare(password, userExist.password)) {
      // generate JWT
      const payload = {
        email: userExist.email,
        id: userExist._id,
        accountType: userExist.accountType,
      };
      const jwt_secret = process.env.JWT_SECRET;
      const token = jwt.sign(payload, jwt_secret, { expiresIn: "2h" });

      userExist.token = token;
      userExist.password = undefined;

      // create cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        userExist,
        message: "Logged In Successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password",
      });
    }
  } catch (error) {
    console.log("error in logging in " + error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

// ***********************************************
// change password  TODO
exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    // Match new password and confirm new password
    if (newPassword !== confirmNewPassword) {
      // If new password and confirm new password do not match, return a 400 (Bad Request) error
      return res.status(400).json({
        success: false,
        message: "The password and confirm password does not match",
      });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};