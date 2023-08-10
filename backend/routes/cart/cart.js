const express = require("express");
const Router = express.Router();
const {
  getCartItems,
  addToCart,
  clearCart,
  removeFromCart,
  incrementItemQuantity,
  createCart,
} = require("../../controllers/cart.controller");

Router.get("/", getCartItems);
Router.post("/", createCart);
Router.post("/add", addToCart);
Router.delete("/", clearCart);
Router.delete("/remove", removeFromCart);
Router.patch("/cartId", incrementItemQuantity);

module.exports = Router;
