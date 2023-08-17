const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  courses: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      require: true,
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
