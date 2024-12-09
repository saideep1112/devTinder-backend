const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignup } = require("../utils/validate");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignup(req);
    const { emailId, password, firstName, lastName } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      emailId,
      password: hashPassword,
      firstName,
      lastName,
    });
    await user.save();
    res.json({ message: "data saved to database" });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("wrong credentials");
    }

    const isPasswordMatched = await user.matchPassword(password);

    if (isPasswordMatched) {
      const token = await user.getJwt();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
      });
      res.json({ message: "login success", info: user });
    } else {
      throw new Error("wrong credentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  const { token } = req.cookies;
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send({ message: "logged out successsfully" });
});

module.exports = authRouter;
