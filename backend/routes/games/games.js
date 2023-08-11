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

router.get("/dates", getGamesByDate);
router.get("/wishlist", getGameOnWishList);
router.get("/platforms", getPlatforms);
router.get("/", getGamesList);
router.get("/genres", getGenres);
router.get("/screenshots/:game_pk", getScreenshots);
router.get("/:slug", getGameDetail);
router.get("/trailers/:slug", getGameTrailers);

module.exports = router;
