const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const { generateAccessToken } = require("../utils/index");

const users = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../data/users.json"), "utf8")
);
const blockedTokens = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../data/blockedTokens.json"), "utf8")
);

const signupHandler = async (req, res) => {
  const { username, password, email } = req.body;
  const user = users.find((user) => user.username === username);
  if (user) {
    return res.status(403).json({ err: "User Already Exists" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    // fs.writeFileSync(
    //   path.resolve(__dirname, "../data/users.json"),
    //   JSON.stringify(users, null, 2),
    //   "utf8"
    // );
    return res.status(201).json({ username, email });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const loginHandler = async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(401).json({ err: "Username Not Found" });
  }

  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const accessToken = generateAccessToken(user);
      return res.status(200).json({ accessToken });
    }
    return res.status(401).json({ err: "Wrong credentials" });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const logoutHandler = (req, res) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];
  fs.writeFileSync(
    path.resolve(__dirname, "../data/blockedTokens.json"),
    JSON.stringify([...blockedTokens, accessToken])
  );
  res.status(204).json({ msg: "You're now logged out." });
};

module.exports = { signupHandler, loginHandler, logoutHandler };
