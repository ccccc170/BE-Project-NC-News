const express = require("express");
const app = express();
app.use(express.json());
const { getTopics } = require("./controllers/topics.controllers");

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "The route does not exist" });
});

module.exports = app;
