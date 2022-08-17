const {
  selectArticles,
  selectArticleById,
  updateArticleById,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  queryObj = req.query;
  selectArticles(queryObj)
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes: editVotesBy } = req.body;
  updateArticleById(article_id, editVotesBy)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};
