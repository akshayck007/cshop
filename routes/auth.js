const express = require("express");
const User = require("../models/User");
const passport = require("passport");
const Product = require("../models/Product");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("signup");
});

router.post("/register", async (req, res) => {
  const { username, password, email, gender, role } = req.body;
  let user = new User({ username, email, gender, role });
  let newUser = await User.register(user, password);
  res.redirect("/products");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  async (req, res) => {
    req.flash("success", `logged in as ${req.user.username}`);
    res.redirect("/products");
  }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success", "logged out");
    res.redirect("/login");
  });
});

module.exports = router;
