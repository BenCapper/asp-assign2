import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Movie from "../../../../api/movies/movieModel";
import api from "../../../../index";
import movies from "../../../../seedData/movies";
 
const expect = chai.expect;
let db;
let token;
 
describe("Movies endpoint", () => {
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
      await Movie.deleteMany();
      await Movie.collection.insertMany(movies);
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/movies", () => {
    describe("when the user is not authenticated", () => {
      it("should return an empty json object", () => {
        return request(api)
          .get(`/api/movies`)
          .set("Accept", "application/json")
          .expect({})
      });
    });
  });
  describe("GET /api/movies/:id", () => {
    describe("when the user is not authenticated", () => {
      it("should return an empty json object", () => {
        return request(api)
          .get(`/api/movies/${movies[0].id}`)
          .set("Accept", "application/json")
          .expect({})
      });
    });
  });
  describe("GET /api/movies/:id/similar", () => {
    describe("when the user is not authenticated", () => {
      it("should return an empty json object", () => {
        return request(api)
          .get(`/api/movies/${movies[0].id}/similar`)
          .set("Accept", "application/json")
          .expect({})
      });
    });
  });
  describe("GET /api/movies/:id/images", () => {
    describe("when the user is not authenticated", () => {
      it("should return an empty json object", () => {
        return request(api)
          .get(`/api/movies/${movies[0].id}/images`)
          .set("Accept", "application/json")
          .expect({})
      });
    });
  });
  describe("GET /api/movies/:id/reviews", () => {
    describe("when the user is not authenticated", () => {
      it("should return an empty json object", () => {
        return request(api)
          .get(`/api/movies/${movies[0].id}/reviews`)
          .set("Accept", "application/json")
          .expect({})
      });
    });
  });
  describe("GET /api/movies/tmdb/upcoming", () => {
    describe("when the user is not authenticated", () => {
      it("should return an empty json object", () => {
        return request(api)
          .get(`/api/movies/tmdb/upcoming`)
          .set("Accept", "application/json")
          .expect({})
      });
    });
  });
  describe("GET /api/movies/tmdb/trending", () => {
    describe("when the user is not authenticated", () => {
      it("should return an empty json object", () => {
        return request(api)
          .get(`/api/movies/tmdb/trending`)
          .set("Accept", "application/json")
          .expect({})
      });
    });
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
      await Movie.deleteMany();
      await Movie.collection.insertMany(movies);
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
  describe("GET /api/movies ", () => {
    it("should return 20 movies and a status 200", (done) => {
      request(api)
        .get("/api/movies")
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
 
  describe("GET /api/movies/:id", () => {
    describe("when the id is valid", () => {
      it("should return the matching movie", () => {
        return request(api)
          .get(`/api/movies/${movies[0].id}`)
          .set("Accept", "application/json")
          .set({ "Authorization": `Bearer ${token}` })
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("title", movies[0].title);
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get(`/api/movies/0`)
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
 
  describe("GET /api/movies/:id/similar", () => {
    describe("when the id is valid", () => {
      it("should return an array of 20 similar movies", () => {
        return request(api)
          .get(`/api/movies/${movies[0].id}/similar`)
          .set("Accept", "application/json")
          .set({ "Authorization": `Bearer ${token}` })
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.results).to.be.a("array");
            expect(res.body.results.length).to.equal(20);
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get(`/api/movies/0/similar`)
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

  describe("GET /api/movies/:id/images", () => {
    describe("when the id is valid", () => {
      it("should return an array of movie images", () => {
        return request(api)
          .get(`/api/movies/${movies[2].id}/images`)
          .set("Accept", "application/json")
          .set({ "Authorization": `Bearer ${token}` })
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.posters.length).to.equal(178);
            expect(res.body.posters).to.be.a("array");
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get(`/api/movies/0/images`)
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
 
  describe("GET /api/movies/:id/reviews", () => {
    describe("when the id is valid", () => {
      it("should return an array of movie reviews", () => {
        return request(api)
          .get(`/api/movies/${movies[2].id}/reviews`)
          .set("Accept", "application/json")
          .set({ "Authorization": `Bearer ${token}` })
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.results.length).to.equal(15);
            expect(res.body.results).to.be.a("array");
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get(`/api/movies/0/reviews`)
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
 
  describe("GET /api/movies/tmdb/upcoming", () => {
    describe("when the id is valid", () => {
      it("should return an array of upcoming movies", () => {
        return request(api)
          .get(`/api/movies/tmdb/upcoming`)
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
 
  describe("GET /api/movies/tmdb/trending", () => {
      it("should return an array of trending movies", () => {
        return request(api)
          .get(`/api/movies/tmdb/trending`)
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
 
