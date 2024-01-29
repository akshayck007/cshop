const mongoose = require("mongoose");

const { Schema } = mongoose;

//schema
const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//Model
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
