const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  let allUsers;
  try {
    allUsers = await User.find();
    return res.status(200).json({ allUsers });
  } catch (error) {
    return console.log(error.message);
  }
};

const signUp = async (req, res) => {
  const { name, email, password, admin } = await req.body;
  try {
    if (!name && !email && !password) {
      return res.status(400).json({ message: "All Fields are required!" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email Already In Use || Login Instead!" });
    }
    const saltRounds = 2;

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      try {
        const user = new User({
          name,
          email,
          password: hash,
          admin,
          courses: [],
        });

        await user.save();

        return res.status(201).json({ user });
      } catch (error) {
        console.log(error.message);
      }
    });
  } catch (error) {
    return console.log(error.message);
  }
};

const login = async (req, res) => {
  const { email, password } = await req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Email not registered || Signup Instead" });
    }

    bcrypt.compare(
      password,
      existingUser.password,
      function async(err, result) {
        if (result == true) {
          const setCookie = async () => {
            const tokenData = {
              id: existingUser._id,
              name: existingUser.name,
              email: existingUser.email,
              admin: existingUser.admin,
            };

            const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
              expiresIn: "1d",
            });
            res.cookie("token", token, {
              expires: new Date(Date.now() + 9000000),
              httpOnly: true,
            });
            return res.status(200).json({ message: "Login Success!" });
          };

          setCookie();
        } else {
          return res.status(400).json({ message: "Invalid Credentials!" });
        }
      }
    );
  } catch (error) {
    return console.log(error.message);
  }
};

module.exports = { getAllUsers, signUp, login };
