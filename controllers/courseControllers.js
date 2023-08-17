const Course = require("../models/courseSchema");
const User = require("../models/userSchema");
const mongoose = require("mongoose");

const getAllCourses = async (req, res) => {
  let courses;
  try {
    courses = await Course.find();
    return res.status(200).json({ courses });
  } catch (error) {
    console.log(error.message);
  }
};

const addCourse = async (req, res) => {
  const { title, description, user } = await req.body;
  try {
    if (!title && !description) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    let existingUser;
    try {
      existingUser = await User.findById(user);
    } catch (error) {
      return console.log(error.message);
    }
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "Unable to find the user by this id" });
    }

    const course = new Course({
      title,
      description,
      user,
    });

    try {
      const session = await mongoose.startSession();
      session.startTransaction();
      await course.save({ session });
      existingUser.courses.push(course);
      await existingUser.save({ session });
      await session.commitTransaction();
    } catch (error) {
      return console.log(error);
    }
    return res.status(201).json(course);
  } catch (error) {
    return console.log(error.message);
  }
};

const getCourse = async (req, res) => {
  const courseId = await req.params.id;
  try {
    const course = await Course.findById({ _id: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res.status(200).json({ course });
  } catch (error) {
    return console.log(error.message);
  }
};

const updateCourse = async (req, res) => {
  const courseId = await req.params.id;
  const { title, description } = req.body;
  try {
    const updateCourse = await Course.findByIdAndUpdate(courseId, {
      title,
      description,
    });
    if (!updateCourse) {
      return res.status(400).json({ message: "Unable to update the blog" });
    }

    return res.status(200).json({ updateCourse });
  } catch (error) {
    return console.log(error.message);
  }
};

const deleteCourse = async (req, res) => {
  const courseId = await req.params.id;
  let course;
  try {
    course = await Course.findByIdAndDelete({ _id: courseId }).populate("user");
    await course.user.courses.pull(course);
    await course.user.save();
    if (!course) {
      return res.status(400).json({ message: "somthing went wrong!" });
    }
  } catch (error) {
    return console.log(error.message);
  }
  return res.status(200).json({ message: "Course Deleted`" });
};

const getUserCourses = async (req, res) => {
  const userId = req.params.id;
  let userCourses;
  try {
    userCourses = await User.findById(userId).populate("courses");
    if (!userCourses) {
      return res.status(404).json({ message: "No Courses Found!" });
    }
    return res.status(200).json({ courses: userCourses.courses });
  } catch (error) {
    return res.status(400).json({ messag: "Something Went Wrong" });
  }
};

module.exports = {
  getAllCourses,
  addCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getUserCourses,
};
