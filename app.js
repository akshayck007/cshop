const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const seedDB = require("./seed");
const methodOverride = require("method-override");
app.use(express.urlencoded({ extended: true }));
const flash = require("connect-flash");
const session = require("express-session");
const reviewRoute = require("./routes/review");
const productRoute = require("./routes/product");
const authRoute = require("./routes/auth");
const cartRoute = require("./routes/cart");
const productApiRoute = require("./routes/api/productapi");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User");

const sessionConfig = {
  secret: "catcowpose",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxage: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(methodOverride("_method"));
app.use(productRoute);
app.use(reviewRoute);
app.use(authRoute);
app.use(productApiRoute);
app.use(cartRoute);

const dbUrl = process.env.MONGO_URL;
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

// seedDB();

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(process.env.PORT, () => {
  console.log("listening");
});
