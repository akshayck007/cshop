const Product = require("./models/Product");
const { productSchema, reviewSchema } = require("./schema");

const validateProduct = function (req, res, next) {
  const { name, img, price, desc } = req.body;
  const { error } = productSchema.validate({ name, img, price, desc });
  if (error) {
    const msg = error.details.map((err) => err.message).join(", ");
    return res.render("error", { err: msg });
  }
  next();
};

const validateReview = function (req, res, next) {
  let { rating, comment } = req.body;
  const { error } = reviewSchema.validate({ rating, comment });
  if (error) {
    const msg = error.details.map((err) => err.message).join(", ");
    return res.render("error", { err: msg });
  }
  next();
};

const isLoggedIn = function (req, res, next) {
  if (req.xhr && !req.isAuthenticated()) {
    return res.status(401).json({ error: "Login to proceed" });
  }

  if (!req.isAuthenticated()) {
    req.flash("error", "Please login to proceed");
    return res.redirect("/login");
  }
  next();
};

const isSeller = (req, res, next) => {
  if (!req.user.role) {
    req.flash("error", "Don't have permissions, Login");
    return res.redirect("/products");
  } else if (req.user.role !== "seller") {
    req.flash("error", "Register as seller to add a product");
    return res.redirect("/products");
  }
  next();
};

const isProductOwner = async (req, res, next) => {
  const { id } = req.params;
  const foundProduct = await Product.findById(id);
  if (!foundProduct.author.equals(req.user._id)) {
    req.flash("error", "not the product owner");
    return res.redirect(`/products/${id}`);
  }
  next();
};

module.exports = {
  validateProduct,
  validateReview,
  isLoggedIn,
  isSeller,
  isProductOwner,
};
