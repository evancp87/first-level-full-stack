const express = require("express");
const router = express.Router();
const { getGamesList, getGame } = require("../../controllers/games/games");

router.get("/", getGamesList);
router.get("/:slug", getGame);

module.exports = router;
