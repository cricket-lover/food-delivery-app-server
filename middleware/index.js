const fs = require("fs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const path = require("path");

const blockedTokens = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../data/blockedTokens.json"), "utf8")
);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ err: "Unauthorized" });
  }
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err || blockedTokens.includes(accessToken)) {
      return res.status(403).json({ err: "Access token is not valid" });
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
