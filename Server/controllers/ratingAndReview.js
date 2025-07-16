const RatingAndReview = require("../models/RatinAndReview");
const course = require("../models/course");
const { default: mongoose } = require("mongoose");

// create rating
exports.createRating = async (req, res) => {
  try {
    // get data
    const { courseId, rating, review } = req.body;
    const userId = req.user.id;
    // check user is enrolled in course or not
    const userEnrolled = await course.findOne({
      _id: courseId,
      studentsEnrolled: { $elementMatch: { $eq: userId } },
    });
    if (!userEnrolled) {
      return res.staus(401).json({
        success: false,
        message: "Student is not enrolled in this course",
      });
    }

    // check if already reviewed the course
    const reviewExist = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (reviewExist) {
      return res.staus(403).json({
        success: false,
        message: "review already exist by user",
      });
    }

    // create rating and review
    const ratingAndReview = await RatingAndReview.create({
      user: userId,
      rating,
      review,
      course: courseId,
    });

    // course model me update karo
    const updatedcourse = await course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          ratingAndReviews: ratingAndReview._id,
        },
      },
      {
        new: true,
      }
    );
    console.log(updatedcourse);
    // return response
    return res.staus(200).json({
      success: true,
      message: "rating and review created",
      ratingAndReview,
    });
  } catch (error) {
    console.log(error);
    return res.staus(500).json({
      success: false,
      message: error.message,
    });
  }
};
// get avg rating
exports.getAvgRating = async (req, res) => {
  try {
    // get course id
    const { courseId } = req.body;
    // calculate avg rating
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          // course id ko  string se object me convert krne ke liye
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    // if ratings exist
    if (result.length > 0) {
      // return raring
      return res.staus(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }
    // if no rating review exist
    else {
      return res.staus(200).json({
        success: true,
        message: "no rating till now",
        averageRating: 0,
      });
    }
  } catch (error) {
    console.log(error);
    return res.staus(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all rating and reviews
exports.getAllRating = async (req, res) => {
  try {
    const allRatingAndReview = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })

      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();
    return res.staus(200).json({
      success: true,
      allRatingAndReview,
      message: "All reviews fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.staus(500).json({
      success: false,
      message: error.message,
    });
  }
};
// TODO: course id ke corresponding rating review leke aao
