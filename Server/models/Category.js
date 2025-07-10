const mongoose = require("mongoose");
const Cource = require("./Cource");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  cources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cource",
    },
  ],
});
module.exports = mongoose.model("Category", categorySchema);
