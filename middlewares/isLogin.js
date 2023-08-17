const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("Not Authorize, Please Login");
    }

    // verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // get user id from token
    const user = await User.findById(verified.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    next();
  } catch (error) {
    res.status(400);
    throw new Error("Not Authorize, Please Login!");
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not Authorize, Please Login");
    }
    // verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // get user id from token
    const user = await User.findById(verified.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (!user.admin) {
      res.status(400).json({ message: "Admin Only" });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: "Something Went Wrong!" });
  }
};

module.exports = { isLogin, isAdmin };
