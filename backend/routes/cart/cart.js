const express = require("express");
const Router = express.Router();
const {
  getCartItems,
  addToCart,
  clearCart,
  removeFromCart,
} = require("../../controllers/cart.controller");

Router.get("/", getCartItems);
Router.post("/add", addToCart);
Router.delete("/", clearCart);
Router.delete("/remove", removeFromCart);

module.exports = Router;
