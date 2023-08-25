const { restaurants } = require("../data/restaurants");

const getAllRestaurants = (req, res) => {
  res.status(200).json(restaurants);
};

const pageNotFoundHandler = (req, res) => {
  res.status(404).json({ err: "Page Not Found in the server" });
};

module.exports = { getAllRestaurants, pageNotFoundHandler };
