import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import api from "../../../../index";
 
const expect = chai.expect;
let db;
let token;
 
describe("Search endpoint", () => {
  before(() => {
    mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });
 
  after(async () => {
    try {
      await db.dropDatabase();
    } catch (error) {
      console.log(error);
    }
  });
 

  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/search/company/:query", () => {
    describe("when the query has results", () => {
      it("should return an array of companies", () => {
        return request(api)
          .get(`/api/search/company/sand`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.results).to.be.a("array");
            expect(res.body.results.length).to.equal(20);
          });
      });
    });
    describe("when the query has no results", () => {
        it("should return an empty object", () => {
          return request(api)
            .get(`/api/search/company/^`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({
                "page": 1,
                "results": [],
                "total_pages": 1,
                "total_results": 0,
            });
        });
      });
  });
  describe("GET /api/search/person/:query", () => {
    describe("when the query has results", () => {
      it("should return an array of people", () => {
        return request(api)
          .get(`/api/search/person/sand`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.results).to.be.a("array");
            expect(res.body.results.length).to.equal(20);
          });
      });
    });
    describe("when the query has no results", () => {
        it("should return an empty object", () => {
          return request(api)
            .get(`/api/search/person/^`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({
                "page": 1,
                "results": [],
                "total_pages": 0,
                "total_results": 0,
            });
        });
      });
  });
});