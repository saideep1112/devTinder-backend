const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/request");
const userRouter = require("./routers/user");

var corsOptions = {
  origin: "http://localhost:5173/",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("successfully conected to database");
    app.listen(3000, () => {
      console.log("the server is listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
