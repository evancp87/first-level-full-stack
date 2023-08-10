const express = require("express");
const app = express();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const checkToken = require("../middleware/authentication/token");
// const limiter = require("../middleware/rate-limiter");
const cors = require("cors");
require("dotenv").config();
app.use(helmet());
app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: false,
    resave: false,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(function myLogger(req, res, next) {
  console.log("logged");
  next();
});
// app.use(limiter);

app.use("/games", require("../routes/games/games"));
app.use("/cart", checkToken, require("../routes/cart/cart"));
app.use("/wishlists", checkToken, require("../routes/wishlist/wishlist"));
app.use("/users", require("../routes/users/users"));

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
