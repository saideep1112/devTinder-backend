const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");

const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfile } = require("../utils/validate");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("some fields are not editable");
    }

    const loggedInUser = await User.findById(req.userId);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    //check old password is matching
    const user = await User.findById(req.userId);
    const isPasswordMatching = await user.matchPassword(oldPassword);
    if (!isPasswordMatching) {
      throw new Error("Invalid old password");
    }
    //check new password is strong
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("New password is not strong");
    }
    //encrypt the new password
    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashNewPassword;
    //save to the database
    user.save();
    res.send("your has been updated successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
