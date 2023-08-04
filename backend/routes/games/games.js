const express = require("express");
const router = express.Router();
const {
  getGamesList,
  getGenres,
  getGameOnWishList,
  getPlatforms,
  getScreenshots,
  getGameDetail,
  getGameTrailers,
  getGamesByDate,
} = require("../../controllers/games.controller");

router.get("/platforms", getPlatforms);
router.get("/", getGamesList);
router.get("/genres", getGenres);
router.get("/screenshots/:game_pk", getScreenshots);
router.get("/:slug", getGameDetail);
router.get("/trailers/:slug", getGameTrailers);
router.get("/wishlist/", getGameOnWishList);
router.get("/dates", getGamesByDate);

module.exports = router;
