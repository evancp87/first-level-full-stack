const express = require("express");
const app = express();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
// const session = require("express-session");
const checkToken = require("../middleware/authentication/token");
const limiter = require("../middleware/rate-limiter");
const cors = require("cors");
const asyncMySQL = require("../database/connection");
require("dotenv").config();
app.use(helmet());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use((req, res, next) => {
  req.asyncMySQL = asyncMySQL;
  next();
});

// const corsOrigin = process.env.NODE_ENV === "production"
//   ? process.env.PRODUCTION_ORIGIN || "https://first-level-staging.onrender.com"
//   : process.env.DEVELOPMENT_ORIGIN;

  app.use(
  cors({ origin: "*" })
);

app.use(function myLogger(req, res, next) {
  console.log("logged");
  next();
});
app.use(limiter);

// server routes
app.use("/games", require("../routes/games/games"));
app.use("/cart", checkToken, require("../routes/cart/cart"));
app.use("/wishlists", checkToken, require("../routes/wishlist/wishlist"));
app.use("/users", require("../routes/users/users"));

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
