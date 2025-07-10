const mongoose = require("mongoose");

const courceProgressSchema = new mongoose.Schema({
  courceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cource",
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});
module.exports = mongoose.model("CourceProgress", courceProgressSchema);
