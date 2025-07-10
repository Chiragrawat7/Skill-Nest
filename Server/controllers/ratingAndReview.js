const RatingAndReview = require("../models/RatinAndReview");
const Cource = require("../models/Cource");
const { default: mongoose } = require("mongoose");

// create rating
exports.createRating = async (req, res) => {
  try {
    // get data
    const { courceId, rating, review } = req.body;
    const userId = req.user.id;
    // check user is enrolled in cource or not
    const userEnrolled = await Cource.findOne({
      _id: courceId,
      studentsEnrolled: { $elementMatch: { $eq: userId } },
    });
    if (!userEnrolled) {
      return res.staus(401).json({
        success: false,
        message: "Student is not enrolled in this cource",
      });
    }

    // check if already reviewed the cource
    const reviewExist = await RatingAndReview.findOne({
      user: userId,
      cource: courceId,
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
      cource: courceId,
    });

    // cource model me update karo
    const updatedCource = await Cource.findByIdAndUpdate(
      courceId,
      {
        $push: {
          ratingAndReviews: ratingAndReview._id,
        },
      },
      {
        new: true,
      }
    );
    console.log(updatedCource);
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
    // get cource id
    const { courceId } = req.body;
    // calculate avg rating
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          // cource id ko  string se object me convert krne ke liye
          cource: new mongoose.Types.ObjectId(courceId),
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
        path: "cource",
        select: "courceName",
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
// TODO: cource id ke corresponding rating review leke aao
