import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Tv from "../../../../api/tv/tvModel";
import api from "../../../../index";
import tvs from "../../../../seedData/tv";
 
const expect = chai.expect;
let db;
let token;
 
describe("Tv endpoint", () => {
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
    try {
      await Tv.deleteMany();
      await Tv.collection.insertMany(tvs);
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/tv", () => {
    describe("when the user is not authenticated", () => {
      it("should return an empty json object", () => {
        return request(api)
          .get(`/api/tv`)
          .set("Accept", "application/json")
          .expect({})
      });
    });
  });
  describe("GET /api/tv/:id", () => {
    describe("when the user is not authenticated", () => {
      it("should return an empty json object", () => {
        return request(api)
          .get(`/api/movies/${tvs[0].id}`)
          .set("Accept", "application/json")
          .expect({})
      });
    });
  });
  describe("GET /api/tv/:id/similar", () => {
    describe("when the user is not authenticated", () => {
      it("should return an empty json object", () => {
        return request(api)
          .get(`/api/movies/${tvs[0].id}/similar`)
          .set("Accept", "application/json")
          .expect({})
      });
    });
  });
  describe("GET /api/tv/:id/images", () => {
    describe("when the user is not authenticated", () => {
      it("should return an empty json object", () => {
        return request(api)
          .get(`/api/tv/${tvs[0].id}/images`)
          .set("Accept", "application/json")
          .expect({})
      });
    });
  });
  describe("GET /api/tv/:id/reviews", () => {
    describe("when the user is not authenticated", () => {
      it("should return an empty json object", () => {
        return request(api)
          .get(`/api/tv/${tvs[0].id}/reviews`)
          .set("Accept", "application/json")
          .expect({})
      });
    });
  });
  describe("GET /api/tv/:id/season/:sid", () => {
    describe("when the user is not authenticated", () => {
      it("should return an empty json object", () => {
        return request(api)
          .get(`/api/tv/${tvs[0].id}/season/1`)
          .set("Accept", "application/json")
          .expect({})
      });
    });
  });
  describe("GET /api/tv/tmdb/top", () => {
    describe("when the user is not authenticated", () => {
      it("should return an empty json object", () => {
        return request(api)
          .get(`/api/tv/tmdb/top`)
          .set("Accept", "application/json")
          .expect({})
      });
    });
  });
  describe("GET /api/tv/tmdb/trending", () => {
    describe("when the user is not authenticated", () => {
      it("should return an empty json object", () => {
        return request(api)
          .get(`/api/tv/tmdb/trending`)
          .set("Accept", "application/json")
          .expect({})
      });
    });
  });
 
 
 
  beforeEach(async () => {
    try {
      await Tv.deleteMany();
      await Tv.collection.insertMany(tvs);
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
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
  describe("GET /api/tv ", () => {
    it("should return 20 tv series and a status 200", (done) => {
      request(api)
        .get("/api/tv")
        .set("Accept", "application/json")
        .set({ "Authorization": `Bearer ${token}` })
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(20);
          done();
        });
    });
  });
 
  describe("GET /api/tv/:id", () => {
    describe("when the id is valid", () => {
      it("should return the matching tv series", () => {
        return request(api)
          .get(`/api/tv/111837`)
          .set("Accept", "application/json")
          .set({ "Authorization": `Bearer ${token}` })
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("name", "Willow");
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get(`/api/tv/0`)
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
 
  describe("GET /api/tv/:id/season/:sid", () => {
    describe("when the id is valid", () => {
      it("should return a tv season with an array of 8 episodes", () => {
        return request(api)
          .get(`/api/tv/111837/season/1`)
          .set("Accept", "application/json")
          .set({ "Authorization": `Bearer ${token}` })
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.episodes.length).to.equal(8);
          });
      });
    });
    describe("when the tv id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get(`/api/tv/0/season/1`)
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
    describe("when the season id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get(`/api/tv/111837/season/999999`)
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

  describe("GET /api/tv/:id/images", () => {
    describe("when the id is valid", () => {
      it("should return an array of tv series images", () => {
        return request(api)
          .get(`/api/tv/111837/images`)
          .set("Accept", "application/json")
          .set({ "Authorization": `Bearer ${token}` })
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.posters.length).to.equal(26);
            expect(res.body.posters).to.be.a("array");
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get(`/api/tv/0/images`)
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
 
  describe("GET /api/tv/:id/reviews", () => {
    describe("when the id is valid", () => {
      it("should return an array of tv series reviews", () => {
        return request(api)
          .get(`/api/tv/94997/reviews`)
          .set("Accept", "application/json")
          .set({ "Authorization": `Bearer ${token}` })
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.results.length).to.equal(1);
            expect(res.body.results).to.be.a("array");
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get(`/api/tv/0/reviews`)
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
 
  describe("GET /api/tv/tmdb/top", () => {
    describe("when the id is valid", () => {
      it("should return an array of upcoming tv series", () => {
        return request(api)
          .get(`/api/tv/tmdb/top`)
          .set("Accept", "application/json")
          .set({ "Authorization": `Bearer ${token}` })
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.results.length).to.equal(20);
            expect(res.body.results).to.be.a("array");
          });
      });
    });
  });
 
  describe("GET /api/tv/tmdb/trending", () => {
      it("should return an array of trending tv series", () => {
        return request(api)
          .get(`/api/tv/tmdb/trending`)
          .set("Accept", "application/json")
          .set({ "Authorization": `Bearer ${token}` })
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.results.length).to.equal(20);
            expect(res.body.results).to.be.a("array");
          });
      });
    });
  });
 
