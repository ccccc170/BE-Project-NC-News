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
            expect(typeof topic).toBe("object");
            expect(topic !== null).toBe(true);
            expect(!Array.isArray(topic)).toBe(true);
            expect(Object.keys(topic).length).toBe(2);
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
    test("Status 200: should return an array of user objects, each of which with 'username', 'name' and 'avatar_url' properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body).toHaveLength(4);
          body.forEach((user) => {
            expect(typeof user).toBe("object");
            expect(user !== null).toBe(true);
            expect(!Array.isArray(user)).toBe(true);
            expect(Object.keys(user).length).toBe(3);
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
            expect(typeof user).toBe("object");
            expect(user !== null).toBe(true);
            expect(!Array.isArray(user)).toBe(true);
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
          expect(typeof body).toBe("object");
          expect(body !== null).toBe(true);
          expect(!Array.isArray(body)).toBe(true);
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
    test("Status 200: should respond with an array of comments objects, each of which with 'comment_id', 'votes', 'created_at', 'author' and 'body' properties corresponding to the passed in article id", () => {
      const articleId = 1;
      return request(app)
        .get(`/api/articles/${articleId}/comments`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body).toHaveLength(11);
          body.forEach((user) => {
            expect(typeof user).toBe("object");
            expect(user !== null).toBe(true);
            expect(!Array.isArray(user)).toBe(true);
            expect(user).toEqual(
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
          expect(typeof body).toBe("object");
          expect(body !== null).toBe(true);
          expect(!Array.isArray(body)).toBe(true);
          expect(Object.keys(body).length).toBe(7);
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
    test("PATCH: 400 responds with an appropriate error message when passed an object which does does not include the required data in the correct format to specify a value to increment or decrement the 'vote' property by", () => {
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
    test("PATCH: 400 responds with an appropriate error message when passed an object which is in the correct format but includes an incorrect data type to specify a value to increment or decrement the 'vote' property by", () => {
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
