const express = require("express");
const Router = express.Router();
// const auth = require("../../authentication/token");

const {
  loginUser,
  registerUser,
} = require("../../controllers/users.controller");

Router.post("/", loginUser);
Router.post("/register", registerUser);
module.exports = Router;
