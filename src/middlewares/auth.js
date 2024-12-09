const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("please login again");
    }
    const decodedToken = jwt.verify(token, "DevTinder#450");
    if (!decodedToken) {
      throw new Error("token is invalid please login again");
    }
    req.userId = decodedToken._id;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
