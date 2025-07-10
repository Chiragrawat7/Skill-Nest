const mongoose = require("mongoose");

const courceSchema = new mongoose.Schema({
  courceName: {
    type: String,
    required: true,
  },
  courceDescription: {
    type: String,
    trim: true,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  whatYouWillLearn: {
    type: String,
    required: true,
  },
  courceContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  price: {
    type: Number,
  },
  thumbNail: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  tags: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
});
module.exports = mongoose.model("Cource", courceSchema);
