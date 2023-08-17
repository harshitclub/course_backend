const express = require("express");
const {
  addCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getUserCourses,
} = require("../controllers/courseControllers");
const { isLogin, isAdmin } = require("../middlewares/isLogin");
const courseRouter = express.Router();

courseRouter.post("/add", isLogin, addCourse);
courseRouter.get("/:id", getCourse);
courseRouter.put("/update/:id", updateCourse);
courseRouter.delete("/:id", deleteCourse);
courseRouter.get("/user/:id", isAdmin, getUserCourses);

module.exports = { courseRouter };
