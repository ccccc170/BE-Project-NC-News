const endpoints = require("../endpoints.json");

exports.getAllApi = (req, res) => {
  res.send(endpoints);
};
