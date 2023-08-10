const express = require("express");
const Router = express.Router();
// const auth = require("../../authentication/token");

const {
  loginUser,
  registerUser,
  logout,
} = require("../../controllers/users.controller");

Router.post("/login", loginUser);
Router.post("/register", registerUser);
Router.post("/logout", logout);
module.exports = Router;
