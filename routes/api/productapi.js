const express = require("express");
const { isLoggedIn } = require("../../middleware");
const User = require("../../models/User");
const router = express.Router();

router.post("/products/:productId/like", isLoggedIn, async (req, res) => {
  const { productId } = req.params;
  const user = req.user;
  let isLiked = user.wishlist.includes(productId);
  console.log(isLiked);
  if (isLiked) {
    await User.findByIdAndUpdate(user._id, {
      $pull: { wishlist: productId },
      
    });

    console.log("removed");
  } else {
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { wishlist: productId },
    });
    console.log("added to wishlist");
  }
});

module.exports = router;
