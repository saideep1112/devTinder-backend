const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    mobileNo: {
      type: Number,
    },
    photoUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/21/21104.png",
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwt = async function () {
  user = this;
  const token = await jwt.sign({ _id: user._id }, "DevTinder#450");
  return token;
};

userSchema.methods.matchPassword = async function (passwordInputbyUser) {
  user = this;
  const passwordHash = user.password;
  const isPasswordMatched = await bcrypt.compare(
    passwordInputbyUser,
    passwordHash
  );
  return isPasswordMatched;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
