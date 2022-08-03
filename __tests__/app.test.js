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
  test("should return a 404 Not Found error if the route provided does not exist", () => {
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
    test("Status 200: should return an array of topic objects, each of which with 'slug' and 'description' properties", () => {
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

describe("GET /api/articles/:article_id", () => {
  describe("Successful usage", () => {
    test("Status 200: should return an article object with 'author', 'title', 'article_id', 'body', 'topic', 'created_at' and 'votes' properties", () => {
      const articleId = 1;
      return request(app)
        .get(`/api/articles/${articleId}`)
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
              votes: 100,
            })
          );
        });
    });
  });
  describe("errors", () => {
    test("GET:404 sends an appropriate and error message when given a valid but non-existent id", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found!");
        });
    });
    test("GET:400 sends an appropriate and error message when given an invalid id", () => {
      return request(app)
        .get("/api/articles/not-an-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid request!");
        });
    });
  });
});
