const mongoose = require("mongoose");
const { instance } = require("../config/razorpay");
const course = require("../models/course");
const User = require("../models/User");
const { mailSender } = require("../utils/mailSender");

// capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {
  try {
    // get course id and user id
    const { courseId } = req.body;
    const userId = req.user.id;

    // validation
    if (!courseId) {
      return res.json({
        success: false,
        message: "please provide valid course id",
      });
    }
    let course;
    try {
      course = await course.findById(courseId);
      if (!course) {
        return res.json({
          success: false,
          message: "Could Not find the course",
        });
      }
      // user already paid or not
      const uId = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uId)) {
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
    let amount = course.price;
    const currency = "INR";
    const options = {
      amount: amount * 100,
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        courseId: courseId,
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
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbNail: course.thumbNail,
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

    // get userid and course id
    const { courseId, userId } = req.body.payload.payment.entity.notes;
    try {
      // find the course and enroll the student in it
      const enrolledcourse = await course.findByIdAndUpdate(
        { courseId },
        {
          $push: {
            studentsEnrolled: userId,
          },
        },
        {
          new: true,
        }
      );
      if (!enrolledcourse) {
        return res.status(500).josn({
          success: false,
          message: "course not found",
        });
      }
      console.log(enrolledcourse);
      // find the student and update the course
      const updatedStudent = await User.findByIdAndUpdate(
        { userId },
        {
          $push: {
            courses: courseId,
          },
        },
        { new: true }
      );

      console.log(updatedStudent);

      const emailResponse = await mailSender(
        updatedStudent.email,
        "Congratulation - You are enrolled successfully",
        `enrolled Successfully on ${enrolledcourse.courseName}`
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
