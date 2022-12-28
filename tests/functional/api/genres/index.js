import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Movie from "../../../../api/movies/movieModel";
import api from "../../../../index";
import movies from "../../../../seedData/movies";
 
const expect = chai.expect;
let db;
let token;
 
describe("Genres endpoint", () => {
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
  describe("GET /api/genres ", () => {
    it("should return an array of 4 genres", () => {
      request(api)
        .get("/api/genres")
        .set("Accept", "application/json")
        .set({ "Authorization": `Bearer ${token}` })
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(4);
        });
    });
  });
  describe("GET /api/genres/movie ", () => {
    it("should return an array of movie genres", () => {
      request(api)
        .get("/api/genres/movie")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.genres).to.be.a("array");
          expect(res.body.genres.length).to.equal(19);
        });
    });
});
  describe("GET /api/genres/tv ", () => {
    it("should return an array of tv genres", () => {
      request(api)
        .get("/api/genres/tv")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.genres).to.be.a("array");
          expect(res.body.genres.length).to.equal(19);
        });
    });
});
});