const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.userId;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //check status coming in params is valid
      const acceptedStatus = ["intrested", "ignored"];
      if (!acceptedStatus.includes(status)) {
        throw new Error("status is not valid");
      }

      //check if toUserId coming in params is valid userId
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("toUser is not valid");
      }

      ///check if any previous connection exists between to and from userId
      const connectionExists = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (connectionExists) {
        throw new Error("connection already exists between this two users");
      }

      //creating new connection request and putting it to DB
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: "connection request sent to " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUserId = req.userId;

      //check status in api is valid
      const acceptedStatus = ["accepted", "rejected"];
      if (!acceptedStatus.includes(status)) {
        throw new Error("status is not valid");
      }

      //status should be intrested in connectionRequest and toUserId should be loggedin userId
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        status: "intrested",
        toUserId: loggedInUserId,
      });

      if (!connectionRequest) {
        throw new Error("connection request is not valid");
      }

      connectionRequest.status = status;
      connectionRequest.save();
      res.json({
        message: `connection request ${status}`,
        data: connectionRequest,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = requestRouter;
