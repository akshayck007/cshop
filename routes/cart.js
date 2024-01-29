const express = require("express");
const User = require("../models/User");
const { isLoggedIn } = require("../middleware");
const Product = require("../models/Product");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51OdizzSBHgTnIqKrhhTRHtVV3LZFwZnBeAbeWqpEWAGIWLoRZB6x1PkzIYWrF4V9qNFlgI2ZD6tClNhlTzoShhox007E488MZk"
);

router.get("/user/cart", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate("cart");
  const totalPrice = user.cart.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );
  res.render("cart/cart", { cartArray: user.cart, totalPrice });
});

router.post("/user/:productId/cart", isLoggedIn, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const user = await User.findById(userId);
  const product = await Product.findById(productId);
  user.cart.push(product);
  await user.save();
  res.redirect(`/user/cart`);
});

router.delete("/user/:productId/cart", isLoggedIn, async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);
  const productIndex = user.cart.indexOf(productId);
  if (productIndex !== -1) {
    user.cart.splice(productIndex, 1);
    await user.save();
  }
  res.redirect("/user/cart");
});

router.get("/checkout", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart");
  const totalAmount = user.cart.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "T-shirt",
          },
          unit_amount: totalAmount * 100,
        },
        quantity: user.cart.length,
      },
    ],
    mode: "payment",
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/cancel",
  });

  res.redirect(303, session.url);
});

module.exports = router;
