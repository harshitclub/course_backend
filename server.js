const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const { userRouter } = require("./routes/userRoutes");
const { courseRouter } = require("./routes/courseRoutes");

const PORT = process.env.PORT || 4001;
const MONGODB_URL = process.env.MONGODB_URI;
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
mongoose
  .connect(MONGODB_URL)
  .then(
    app.listen(PORT, () => {
      console.log(`Server Running At ${PORT}`);
    })
  )
  .then(console.log("Database Connected!"));
