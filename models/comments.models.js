const { response } = require("../app");
const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comment_id, author, created_at, votes, body 
            FROM comments
            WHERE article_id = $1;`,
      [article_id]
    )
    .then((response) => {
      const { rows: comments } = response;
      if (comments.length === 0) {
        return db
          .query(
            `SELECT * FROM articles
          WHERE articles.article_id = $1`,
            [article_id]
          )
          .then((response) => {
            const { rows: articles } = response;
            if (articles.length === 0) {
              return Promise.reject({ status: 404, msg: "article not found!" });
            }
            return comments;
          });
      }
      return comments;
    });
};

exports.addComment = (article_id, comment) => {
  const { username, body } = comment;
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
      [article_id, username, body]
    )
    .then(({ rows: [comment] }) => {
      return comment;
    });
};
