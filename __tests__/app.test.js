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

describe("GET /api/topics", () => {
  describe("Successful usage", () => {
    test("should return status 200", () => {
      return request(app).get("/api/topics").expect(200);
    });
    test("should return an array of topics from test data", () => {
      return request(app)
        .get("/api/topics")
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body).toHaveLength(3);
        });
    });
    test("returned array should contain topic objects, each of which with 'slug' and 'description' properties", () => {
      return request(app)
        .get("/api/topics")
        .then(({ body }) => {
          body.forEach((topic) => {
            // tests that each array element is an object
            expect(typeof topic).toBe("object");
            expect(topic !== null).toBe(true);
            expect(!Array.isArray(topic)).toBe(true);
            // tests that each object has two key/value pairs
            expect(Object.keys(topic).length).toBe(2);
            // tests that each object has desired keys and value input types
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
