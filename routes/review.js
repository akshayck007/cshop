const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Review = require("../models/Review");
const { validateReview, isLoggedIn } = require("../middleware");
const User = require("../models/User");

router.post(
  "/products/:Id/rating",
  isLoggedIn,
  validateReview,
  async (req, res) => {
    try {
      let { rating, comment } = req.body;
      let { Id } = req.params;
      const userId = req.user._id;

      const user = await User.findById(userId);

      const foundProduct = await Product.findById(Id);
      const review = new Review({ rating, comment, author: user });
      foundProduct.reviews.push(review);
      user.reviews.push(review);

      await foundProduct.save();
      await review.save();
      await user.save();

      req.flash("success", "review added successfully");
      res.redirect(`/products/${Id}`);
    } catch (e) {
      res.render("error", { err: e.message });
    }
  }
);

router.delete(
  "/products/:productId/rating/:reviewId",
  isLoggedIn,
  async (req, res) => {
    const { reviewId, productId } = req.params;

    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/products/${productId}`);
  }
);

module.exports = router;
