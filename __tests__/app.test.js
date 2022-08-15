const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/index");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("general errors", () => {
  test("should respond with a 404 Not Found error if the route provided does not exist", () => {
    return request(app)
      .get("/notARoute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("The route does not exist");
      });
  });
});

describe("GET /api/topics", () => {
  describe("Successful usage", () => {
    test("Status 200: should respond with an array of topic objects, each of which with 'slug' and 'description' properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body).toHaveLength(3);
          body.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
  });
});

describe("GET /api/users", () => {
  describe("Successful usage", () => {
    test("Status 200: should respond with an array of user objects, each of which with 'username', 'name' and 'avatar_url' properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body).toHaveLength(4);
          body.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });
});

describe("GET /api/articles", () => {
  describe("Successful usage", () => {
    test("Status 200: should respond with an array of article objects, each of which with 'author', 'title', 'article_id', 'topic', 'created_at', 'votes' and 'comment_count' properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body).toHaveLength(12);
          body.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test("Status 200: default sort by and sort order of response should be by date descending", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("Status 200: articles in response should be filtered by topic value if specified within the query, returining only articles witht that topic value", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveLength(1);
          body.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                topic: "cats",
              })
            );
          });
        });
    });
    test("Status 200: should respond with an empty array if query specifies a topic that no articles present in the database correspond to", () => {
      return request(app)
        .get("/api/articles?topic=dogs")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveLength(0);
        });
    });
    test("Status 200: response should be sorted by by specified column as per the query passed in", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("title", {
            descending: true,
            coerce: true,
          });
        });
    });
    test("Status 200: response order should by ascedning if specified within the query", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("created_at", {
            ascending: true,
            coerce: true,
          });
        });
    });
    test("Status 200: response order should by descending if specified within the query", () => {
      return request(app)
        .get("/api/articles?order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("created_at", {
            descending: true,
            coerce: true,
          });
        });
    });
    test("Status 200: response articles should be filtered by topic, sorted by specified column and ordered by specified order when all three query options are used in the same query", () => {
      return request(app)
        .get("/api/articles?topic=cats&sort_by=votes&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("votes", {
            ascending: true,
            coerce: true,
          });
          expect(body).toHaveLength(1);
          body.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                topic: "cats",
              })
            );
          });
        });
    });
  });
  describe("errors", () => {
    test("Status 400: should respond with appropriate error message when passed an invalid sort query", () => {
      return request(app)
        .get("/api/articles?sort_by=height")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid sort query!");
        });
    });
    test("Status 400: should respond with appropriate error message when passed an invalid order query", () => {
      return request(app)
        .get("/api/articles?order=sideways")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid order query!");
        });
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  describe("Successful usage", () => {
    test("Status 200: should respond with an article object with 'author', 'title', 'article_id', 'body', 'topic', 'created_at' and 'votes' properties corresponding to the passed in article id", () => {
      const articleId = 1;
      return request(app)
        .get(`/api/articles/${articleId}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              article_id: articleId,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: expect.any(String),
              votes: 100,
            })
          );
        });
    });
    test("response object should also include a comment count which is the total count of all comments associated with the passed in article id", () => {
      const articleId = 1;
      return request(app)
        .get(`/api/articles/${articleId}`)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              comment_count: 11,
            })
          );
        });
    });
  });
  describe("errors", () => {
    test("GET:404 responds with an appropriate error message when given a valid but non-existent id", () => {
      const articleId = 99999;
      return request(app)
        .get(`/api/articles/${articleId}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found!");
        });
    });
    test("GET:400 responds with an appropriate error message when given an invalid id", () => {
      return request(app)
        .get("/api/articles/not-an-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request: invalid id!");
        });
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  describe("Successful usage", () => {
    test("Status 200: should respond with an array of comments objects, each of which with 'comment_id', 'votes', 'created_at', 'author' and 'body' properties corresponding to the passed in article id when comments are associated with that id", () => {
      const articleId = 1;
      return request(app)
        .get(`/api/articles/${articleId}/comments`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body).toHaveLength(11);
          body.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                body: expect.any(String),
              })
            );
          });
        });
    });
    test("Status 200: should return an empty array when the passed in a valid article id that has no comments associated with it", () => {
      const articleId = 2;
      return request(app)
        .get(`/api/articles/${articleId}/comments`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body).toHaveLength(0);
        });
    });
  });
  describe("errors", () => {
    test("GET:404 responds with an appropriate error message when given a valid but non-existent id", () => {
      const articleId = 99999;
      return request(app)
        .get(`/api/articles/${articleId}/comments`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found!");
        });
    });
    test("GET:400 responds with an appropriate error message when given an invalid id", () => {
      return request(app)
        .get("/api/articles/not-an-id/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request: invalid id!");
        });
    });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  describe("Successful usage", () => {
    test("PATCH: 200 should take an article id and an object indicating an amount to increment the corresponding article's 'vote' property by, increment the property by this amount in the database and respond with the updated article object", () => {
      const articleId = 1;
      const articleUpdate = { inc_votes: 1 };
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(articleUpdate)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              article_id: articleId,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: expect.any(String),
              votes: 101,
            })
          );
        });
    });
    test("PATCH: 200 should take an article id and an object indicating an amount to increment the corresponding article's 'vote' property by, decrement the property by this amount in the database and respond with the updated article object", () => {
      const articleId = 1;
      const articleUpdate = { inc_votes: -100 };
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(articleUpdate)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              article_id: articleId,
              votes: 0,
            })
          );
        });
    });
  });
  describe("errors", () => {
    test("PATCH: 404 responds with an appropriate error message when given a valid update object and a valid but non-existent id", () => {
      const articleId = 99999;
      const articleUpdate = { inc_votes: 1 };
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(articleUpdate)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found!");
        });
    });
    test("PATCH: 400 responds with an appropriate error message when given a valid update object and an invalid id", () => {
      const articleUpdate = { inc_votes: 1 };
      return request(app)
        .get("/api/articles/not-an-id")
        .send(articleUpdate)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request: invalid id!");
        });
    });
    test("PATCH: 400 responds with an appropriate error message when passed a valid id but an object which does does not include the required data in the correct format to specify a value to increment or decrement the 'vote' property by", () => {
      const articleId = 1;
      const articleUpdate = {};
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(articleUpdate)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("unable to update: information missing!");
        });
    });
    test("PATCH: 400 responds with an appropriate error message when passed a valid id but an object which is in the correct format but includes an incorrect data type to specify a value to increment or decrement the 'vote' property by", () => {
      const articleId = 1;
      const articleUpdate = { inc_votes: "one" };
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(articleUpdate)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("unable to update: incorrect data type!");
        });
    });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  describe("successful usage", () => {
    test("Status 201: Should take an article id and comment object with 'username' and 'body' properties, add the comment to the database and return the posted comment", () => {
      const articleId = 1;
      const inputComment = {
        username: "butter_bridge",
        body: "This is a comment!",
      };
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(inputComment)
        .expect(201)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              article_id: articleId,
              author: inputComment.username,
              body: inputComment.body,
              created_at: expect.any(String),
              votes: 0,
            })
          );
        });
    });
  });
  describe("errors", () => {
    test("POST: 404 responds with an appropriate error message when given a valid comment object and a valid but non-existent id", () => {
      const articleId = 99999;
      const inputComment = {
        username: "butter_bridge",
        body: "This is a comment!",
      };
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(inputComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("endpoint not found, unable to find user!");
        });
    });
    test("POST: 400 responds with an appropriate error message when given a valid comment object and an invalid id", () => {
      const inputComment = {
        username: "butter_bridge",
        body: "This is a comment!",
      };
      return request(app)
        .post("/api/articles/not-an-id/comments")
        .send(inputComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request: invalid id!");
        });
    });
    test("POST: 400 responds with an appropriate error message when passed a valid id but an object which does does not include the required data in the correct format to be able to add a comment to the database", () => {
      const articleId = 1;
      const inputComment = {};
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(inputComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "unable to post: information missing or incorrect data type!"
          );
        });
    });
    test("POST: 400 responds with an appropriate error message when passed a valid id and an object which is in the correct format but includes an incorrect data type to be able to add the comment to the database", () => {
      const articleId = 1;
      const inputComment = {
        username: "butter_bridge",
        body: null,
      };
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(inputComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "unable to post: information missing or incorrect data type!"
          );
        });
    });
    test("POST: 400 responds with an appropriate error message when passed a valid id but an object which has a username property value not present in the users database", () => {
      const articleId = 1;
      const inputComment = {
        username: "usrername1",
        body: "This is a comment!",
      };
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(inputComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("endpoint not found, unable to find user!");
        });
    });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  describe("successful usage", () => {
    const commentId = 1;
    test("DELETE 204: should delete the comment specified by the passed in id from the database", () => {
      return request(app).delete(`/api/comments/${commentId}`).expect(204);
    });
  });
  describe("errors", () => {
    test("DELETE 404: should respond with an appropriate error message when passed a valid but non-existant id", () => {
      return request(app)
        .delete("/api/comments/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("comment not found!");
        });
    });
    test("DELETE 400: should respond with an appropriate error message when passed an invalid id", () => {
      return request(app)
        .delete("/api/comments/not-an-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request: invalid id!");
        });
    });
  });
});
