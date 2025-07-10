const mongoose = require("mongoose");
const { instance } = require("../config/razorpay");
const Cource = require("../models/Cource");
const User = require("../models/User");
const { mailSender } = require("../utils/mailSender");

// capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {
  try {
    // get cource id and user id
    const { courceId } = req.body;
    const userId = req.user.id;

    // validation
    if (!courceId) {
      return res.json({
        success: false,
        message: "please provide valid cource id",
      });
    }
    let cource;
    try {
      cource = await Cource.findById(courceId);
      if (!cource) {
        return res.json({
          success: false,
          message: "Could Not find the cource",
        });
      }
      // user already paid or not
      const uId = new mongoose.Types.ObjectId(userId);
      if (Cource.studentsEnrolled.includes(uId)) {
        return res.status(200).json({
          success: false,
          message: "Student is already enrolled",
        });
      }
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
    // order create
    let amount = cource.price;
    const currency = "INR";
    const options = {
      amount: amount * 100,
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        courceId: courceId,
        userId,
      },
    };
    try {
      // initiate the payment using razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);
    } catch (error) {
      console.log("failed to pay");
      return res.status(500).json({
        success: false,
        message: "Could not make order",
      });
    }
    // return response
    return res.status(200).josn({
      success: true,
      courceName: cource.courceName,
      courceDescription: cource.courceDescription,
      thumbNail: cource.thumbNail,
      orderId: paymentResponse.id,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Could not initiate order",
    });
  }
};
exports.verifySignature = async (req, res) => {
  const webhookSecret = "12345678";

  const signature = req.headers("x-raxorpay-signature");

  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("payment is authorized");

    // get userid and cource id
    const { courceId, userId } = req.body.payload.payment.entity.notes;
    try {
      // find the cource and enroll the student in it
      const enrolledCource = await Cource.findByIdAndUpdate(
        { courceId },
        {
          $push: {
            studentsEnrolled: userId,
          },
        },
        {
          new: true,
        }
      );
      if (!enrolledCource) {
        return res.status(500).josn({
          success: false,
          message: "Cource not found",
        });
      }
      console.log(enrolledCource);
      // find the student and update the cource
      const updatedStudent = await User.findByIdAndUpdate(
        { userId },
        {
          $push: {
            cources: courceId,
          },
        },
        { new: true }
      );

      console.log(updatedStudent);

      const emailResponse = await mailSender(
        updatedStudent.email,
        "Congratulation - You are enrolled successfully",
        `enrolled Successfully on ${enrolledCource.courceName}`
      );

      return res.status(200).json({
        success: true,
        message: "enrolled successfull",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "signature does not match",
    });
  }
};
