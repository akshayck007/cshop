const express = require("express");
const Product = require("../models/Product");
const Review = require("../models/Review");
const {
  validateProduct,
  isLoggedIn,
  isSeller,
  isProductOwner,
} = require("../middleware");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home");
});
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("index", { products });
  } catch (e) {
    res.render("error", { err: e.message });
  }
});

router.get("/product/new", isLoggedIn, isSeller, (req, res) => {
  try {
    res.render("new");
  } catch (e) {
    res.render("error", { err: e.message });
  }
});

router.post(
  "/products",
  isLoggedIn,
  isSeller,
  validateProduct,
  async (req, res) => {
    try {
      const { name, img, price, desc } = req.body;
      const newProduct = new Product({
        name,
        img,
        price,
        desc,
        author: req.user._id,
      });

      await newProduct.save();
      console.log("Product added successfully");
      req.flash("success", "Product added successfully");
      res.redirect("/products");
    } catch (e) {
      res.render("error", { err: e.message });
    }
  }
);

router.get("/products/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const foundProduct = await Product.findById(id).populate("reviews");
    res.render("show", { foundProduct });
  } catch (e) {
    res.render("error", { err: e.message });
  }
});

router.get("/products/:id/edit", isLoggedIn, isSeller, async (req, res) => {
  try {
    const { id } = req.params;
    const foundProduct = await Product.findById(id);

    res.render("edit", { foundProduct });
  } catch (e) {
    res.render("error", { err: e.message });
  }
});

router.patch(
  "/products/:id",
  isLoggedIn,
  isSeller,
  isProductOwner,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, img, price, desc } = req.body;
      await Product.findByIdAndUpdate(id, { name, img, price, desc });

      req.flash("success", `${name} Updated successfully`);
      res.redirect("/products");
    } catch (e) {
      res.render("error", { err: e.message });
    }
  }
);

router.delete(
  "/products/:id",
  isLoggedIn,
  isSeller,
  isProductOwner,
  async (req, res) => {
    try {
      const { id } = req.params;
      const foundProduct = await Product.findById(id);
      for (let ids of foundProduct.reviews) {
        await Review.findByIdAndDelete(ids);
        console.log("all reviews deleted");
      }
      await Product.findByIdAndDelete(id);
      req.flash("success", "deleted successfully");
      res.redirect("/products");
    } catch (e) {
      res.render("error", { err: e.message });
    }
  }
);

module.exports = router;
