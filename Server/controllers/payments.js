const mongoose = require("mongoose");
const { instance } = require("../config/razorpay");
const Course = require("../models/course");
const {paymentSuccessEmail}=require('../mails/templates/paymentSuccessEmail');
const User = require("../models/User");
const crypto=require('crypto')
const {courseEnrollmentEmail} = require("../mails/templates/courseEnrollmentEmail");
const { mailSender } = require("../utils/mailSender");

exports.capturePayment = async (req, res) => {
  try {
    const { courses } = req.body;
    const userId = req.user.id;
    if (courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please Provide CourseId",
      });
    }
    let totalAmount = 0;
    for (const course_Id of courses) {
      let course;
      try {
        course = await Course.findById(course_Id);
        if (!course) {
          return res.status(200).json({
            success: false,
            message: "Could not find the course",
          });
        }
        const uid = new mongoose.Types.ObjectId(userId);
        console.log(uid)
        if (course.studentsEnrolled.includes(uid)) {
          return res.status(200).json({
            success: false,
            message: "student is already enrolled",
          });
        }
        totalAmount += course.price;
      } catch (error) {
        console.log("Error in fetching Courses inside Payment", error);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    };
    try {
      const paymentResponse = await instance.orders.create(options);

      return res.status(200).json({
        success: true,
        message: paymentResponse,
      });
    } catch (error) {
      console.log("Error in crreating Instance", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Could not initiate order",
    });
  }
};
exports.verifyPayment = async (req, res) => {
  try {
    const razorpay_order_id = req.body.razorpay_order_id;
    const razorpay_payment_id = req.body.razorpay_payment_id;
    const razorpay_signature = req.body.razorpay_signature;

    const courses = req.body?.courses;
    const userId = req.user.id;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !userId
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment Failed",
      });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");
    if (expectedSignature === razorpay_signature) {
      // enroll the student
      await enrollStudents(courses, userId, res);

      // return response
      return res.status(200).json({
        success: true,
        message: "Payment Verified",
      });
    }
    return res.status(300).json({
      success: false,
      message: "Payment Failed",
    });
  } catch (error) {
    console.log("failed to verify payment",error)
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
};
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId)
    return res.status(400).json({
      success: false,
      message: "Please provide data for Cources or UserId",
    });
  for (const courseId of courses) {
    try {
      const enrolledcourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );
      if (!enrolledcourse) {
        return res.status(500).json({
          success: false,
          message: "course not Found",
        });
      }
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
          },
        },
        { new: true }
      );
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledcourse.courseName}`,
        courseEnrollmentEmail(
          enrolledcourse.courseName,
          `${enrolledStudent.firstName}`
        )
      );
      console.log("Email Sent Successfully", emailResponse);
    } catch (error) {
      console.log("Error ", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};
// capture the payment and initiate the razorpay order
// exports.capturePayment = async (req, res) => {
//   try {
//     // get course id and user id
//     const { courseId } = req.body;
//     const userId = req.user.id;

//     // validation
//     if (!courseId) {
//       return res.json({
//         success: false,
//         message: "please provide valid course id",
//       });
//     }
//     let course;
//     try {
//       course = await Course.findById(courseId);
//       if (!course) {
//         return res.json({
//           success: false,
//           message: "Could Not find the course",
//         });
//       }
//       // user already paid or not
//       const uId = new mongoose.Types.ObjectId(userId);
//       if (course.studentsEnrolled.includes(uId)) {
//         return res.status(200).json({
//           success: false,
//           message: "Student is already enrolled",
//         });
//       }
//     } catch (error) {
//       return res.json({
//         success: false,
//         message: error.message,
//       });
//     }
//     // order create
//     let amount = course.price;
//     const currency = "INR";
//     const options = {
//       amount: amount * 100,
//       currency,
//       receipt: Math.random(Date.now()).toString(),
//       notes: {
//         courseId: courseId,
//         userId,
//       },
//     };
//     try {
//       // initiate the payment using razorpay
//       const paymentResponse = await instance.orders.create(options);
//       console.log(paymentResponse);
//     } catch (error) {
//       console.log("failed to pay");
//       return res.status(500).json({
//         success: false,
//         message: "Could not make order",
//       });
//     }
//     // return response
//     return res.status(200).josn({
//       success: true,
//       courseName: course.courseName,
//       courseDescription: course.courseDescription,
//       thumbNail: course.thumbNail,
//       orderId: paymentResponse.id,
//       amount: paymentResponse.amount,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Could not initiate order",
//     });
//   }
// };

// exports.verifySignature = async (req, res) => {
//   const webhookSecret = "12345678";

//   const signature = req.headers("x-raxorpay-signature");

//   const shasum = crypto.createHmac("sha256", webhookSecret);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest("hex");

//   if (signature === digest) {
//     console.log("payment is authorized");

//     // get userid and course id
//     const { courseId, userId } = req.body.payload.payment.entity.notes;
//     try {
//       // find the course and enroll the student in it
//       const enrolledcourse = await Course.findByIdAndUpdate(
//         { courseId },
//         {
//           $push: {
//             studentsEnrolled: userId,
//           },
//         },
//         {
//           new: true,
//         }
//       );
//       if (!enrolledcourse) {
//         return res.status(500).josn({
//           success: false,
//           message: "course not found",
//         });
//       }
//       console.log(enrolledcourse);
//       // find the student and update the course
//       const updatedStudent = await User.findByIdAndUpdate(
//         { userId },
//         {
//           $push: {
//             courses: courseId,
//           },
//         },
//         { new: true }
//       );

//       console.log(updatedStudent);

//       const emailResponse = await mailSender(
//         updatedStudent.email,
//         "Congratulation - You are enrolled successfully",
//         `enrolled Successfully on ${enrolledcourse.courseName}`
//       );

//       return res.status(200).json({
//         success: true,
//         message: "enrolled successfull",
//       });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   } else {
//     return res.status(400).json({
//       success: false,
//       message: "signature does not match",
//     });
//   }
// };
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;
  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).josn({
      success: false,
      message: "please provide all details",
    });
  }

  try {
    const enrolledStudent=await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(`${enrolledStudent.firstName}`,
      amount/100,orderId,paymentId)
    )
  } catch (error) {
    console.log("Error in Sending mail",error)
    return res.status(500).json({
      success:false,
      message:"Could Not Send email"
    })
  }
};
