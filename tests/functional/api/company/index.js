import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Movie from "../../../../api/movies/movieModel";
import api from "../../../../index";
import movies from "../../../../seedData/movies";
 
const expect = chai.expect;
let db;
let token;
 
describe("Company endpoint", () => {
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
 
  beforeEach(async () => {
    await request(api).post("/api/users?action=register").send({
      username: "user2",
      password: "Test2#",
    });
    let res = await request(api).post("/api/users?action=authenticate").send({
      username: "user2",
      password: "Test2#",
    });
    token = res.body.token.substring(7);
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/company/:id", () => {
    describe("when the id is valid", () => {
      it("should return a company object", () => {
        return request(api)
          .get(`/api/company/1314`)
          .set("Accept", "application/json")
          .set({ "Authorization": `Bearer ${token}` })
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("id", 1314);
            expect(res.body).to.have.property("name", "Hammer Film Productions");
            expect(res.body).to.have.property("origin_country", "GB");
          });
      });
    });
    describe("when the id is invalid", () => {
        it("should return a 404 error message", () => {
          return request(api)
            .get(`/api/company/zzzzz`)
            .set("Accept", "application/json")
            .set({ "Authorization": `Bearer ${token}` })
            .expect("Content-Type", /json/)
            .expect(404)
            .expect({
              status_code: 404,
              message: 'The resource you requested could not be found.',
            })
        });
      });
  });
});