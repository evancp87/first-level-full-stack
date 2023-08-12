const express = require("express");
const router = express.Router();
const {
  getWishlist,
  getWishlists,
  createWishlist,
  deleteWishlist,
  updateWishlist,
  addGamesToWishlist,
  deleteGamesFromWishlist,
} = require("../../controllers/wishlist.controller");

router.delete("/delete", deleteGamesFromWishlist);
router.get("/", getWishlists);
router.get("/:id", getWishlist);
router.patch("/:id/:userId", updateWishlist);
router.delete("/:id", deleteWishlist);
router.post("/", createWishlist);
router.post("/add/", addGamesToWishlist);
// router.delete("/delete", deleteGamesFromWishlist);

module.exports = router;
