const express = require("express");
const app = express();
app.use(express.json());
const { getTopics } = require("./controllers/topics.controllers");

app.get("/api/topics", getTopics);

module.exports = app;
