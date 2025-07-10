const mongoose = require("mongoose");
const ratingAndReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    trim: true,
    required: true,
  },
  cource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cource",
    index: true,
  },
});
module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);
