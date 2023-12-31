const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const { authenticateToken } = require("./middleware");
const {
  getAllRestaurants,
  pageNotFoundHandler,
} = require("./handlers/restaurantsHandler");
const {
  signupHandler,
  loginHandler,
  logoutHandler,
} = require("./handlers/authHandlers");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

app.get("/api/ping", authenticateToken, (req, res) => {
  res.json({ msg: "Pong" });
});

app.get("/api/live", (req, res) => {
  res.send(true);
});

app.get("/api/restaurants", getAllRestaurants);

app.post("/api/signup", signupHandler);

app.post("/api/login", loginHandler);

app.delete("/api/logout", authenticateToken, logoutHandler);

app.all("/api/*", pageNotFoundHandler);

app.listen(PORT, () => console.log("Listening on Port", PORT));
