const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const REQUIRED_FIELDS = "firstName lastName age gender skills photoUrl about";

userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.userId;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "intrested",
    }).populate("fromUserId", REQUIRED_FIELDS);

    const data = connectionRequests.map((doc) => doc.fromUserId);

    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.userId;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUserId, status: "accepted" },
        { fromUserId: loggedInUserId, status: "accepted" },
      ],
    })
      .populate("toUserId", REQUIRED_FIELDS)
      .populate("fromUserId", REQUIRED_FIELDS);

    const data = connectionRequests.map((doc) =>
      doc.toUserId._id.toString() === loggedInUserId
        ? doc.fromUserId
        : doc.toUserId
    );
    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const loggedInUserId = req.userId;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    }).select("fromUserId toUserId");

    const noFeedData = new Set();
    connectionRequests.forEach((c) => {
      noFeedData.add(c.fromUserId);
      noFeedData.add(c.toUserId);
    });

    const userFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(noFeedData) } },
        { _id: { $ne: loggedInUserId } },
      ],
    })
      .select(REQUIRED_FIELDS)
      .skip(skip)
      .limit(limit);

    res.json({ data: userFeed });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
