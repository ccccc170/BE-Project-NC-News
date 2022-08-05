const db = require("../db/connection");

exports.selectArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT (comments.article_id) ::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id;`
    )
    .then(({ rows: articles }) => {
      return articles;
    });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT (comments.article_id) ::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [article_id]
    )
    .then((response) => {
      const { rows: row } = response;
      if (row.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found!" });
      }
      const [article] = row;
      return article;
    });
};

exports.updateArticleById = (article_id, editVotesBy) => {
  if (!editVotesBy) {
    return Promise.reject({
      status: 400,
      msg: "unable to update: information missing!",
    });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + ${editVotesBy} WHERE article_id = $1 RETURNING *;`,
      [article_id]
    )
    .then((response) => {
      const { rows: row } = response;
      if (row.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article not found!",
        });
      }
      const [article] = row;
      return article;
    });
};
