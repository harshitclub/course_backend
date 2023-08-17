const express = require("express");
const userRouter = express.Router();
const {
  getAllUsers,
  signUp,
  login,
} = require("../controllers/userControllers");

userRouter.post("/signup", signUp);
userRouter.post("/login", login);

module.exports = { userRouter };
