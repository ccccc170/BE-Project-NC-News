const express = require("express");
const app = express();
app.use(express.json());
const { getAllApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("./controllers/articles.controllers");
const { getUsers } = require("./controllers/users.controllers");
const {
  getCommentsByArticleId,
  postComment,
  deleteComment,
} = require("./controllers/comments.controllers");

app.get("/api", getAllApi);

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getUsers);
app.patch("/api/articles/:article_id", patchArticleById);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteComment);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request: invalid id!" });
  }
  if (err.code === "23502") {
    res.status(400).send({
      msg: "unable to post: information missing or incorrect data type!",
    });
  }
  if (err.code === "23503") {
    res.status(404).send({ msg: "endpoint not found, unable to find user!" });
  }
  if (err.code === "42703") {
    res.status(400).send({ msg: "unable to update: incorrect data type!" });
  }
  res.status(err.status).send({ msg: err.msg });
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "The route does not exist" });
});

module.exports = app;
