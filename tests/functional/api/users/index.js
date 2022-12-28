import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import User from "../../../../api/users/userModel";
import api from "../../../../index";

const expect = chai.expect;
let db;
let user1token;
let id;

describe("Users endpoint", () => {
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
      await User.deleteMany();
      // Register two users
      await request(api).post("/api/users?action=register").send({
        username: "user1",
        password: "Test1#",
        favouriteMovies: [],
        favouriteTv: []
      });
      await request(api).post("/api/users?action=register").send({
        username: "user2",
        password: "Test2#",
        favouriteMovies: [555604],
        favouriteTv: [119051]
      });
    } catch (err) {
      console.error(`failed to Load user test Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close();
  });
  describe("GET /api/users ", () => {
    it("should return the 2 users and a status 200", (done) => {
      request(api)
        .get("/api/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          id = res.body[0]._id;
          expect(res.body).to.be.a("array");
          done();
        });
    });
  });

  describe("POST /api/users ", () => {
    describe("For a register action", () => {
      describe("when the payload is correct", () => {
        it("should return a 201 status and the confirmation message", () => {
          return request(api)
            .post("/api/users?action=register")
            .send({
              username: "user3",
              password: "Test3#",
            })
            .expect(201)
            .expect({ msg: "Successful created new user.", code: 201 });
        });
        after(() => {
          return request(api)
            .get("/api/users")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
              expect(res.body.length).to.equal(3);
              const result = res.body.map((user) => user.username);
              expect(result).to.have.members(["user1", "user2", "user3"]);
            });
        });
      });
      describe("when the payload is incorrect", () => {
        it("should return a 401 status and the confirmation message", () => {
          return request(api)
            .post("/api/users?action=register")
            .send({
              username: "user1",
            })
            .expect(401)
            .expect({success: false, msg: 'Please pass username and password.'});
        });
        after(() => {
          return request(api)
            .get("/api/users")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
              expect(res.body.length).to.equal(2);
              const result = res.body.map((user) => user.username);
              expect(result).to.have.members(["user1", "user2"]);
            });
        });
      });
    });
    describe("For an authenticate action", () => {
      describe("when the payload is correct", () => {
        it("should return a 200 status and a generated token", () => {
          return request(api)
            .post("/api/users?action=authenticate")
            .send({
              username: "user1",
              password: "Test1#",
            })
            .expect(200)
            .then((res) => {
              expect(res.body.success).to.be.true;
              expect(res.body.token).to.not.be.undefined;
              user1token = res.body.token.substring(7);
            });
        });
      });
      describe("when the password is incorrect", () => {
        it("should return a 401 status and a fail message", () => {
          return request(api)
            .post("/api/users?action=authenticate")
            .send({
              username: "user1",
              password: "Testy#",
            })
            .expect(401)
            .expect({code: 401,msg: 'Authentication failed. Wrong password.'});
        });
      });
    });
  });

  describe("POST /api/users/:userName/favourites/movies", () => {
    describe("when the payload is correct", () => {
      it("should add a movie id to a users favourite movies", () => {
        return request(api)
          .post("/api/users/user1/favourites/movies")
          .send({id:76600})
          .expect(201)
          .then((res) => {
            expect(res.body.favouriteMovies).to.have.members([76600]);
            expect(res.body.favouriteMovies.length).to.equal(1);
          });
      });
    });
    describe("when the payload is a duplicate", () => {
      it("should return duplicate favourite movie error", () => {
        return request(api)
          .post("/api/users/user2/favourites/movies")
          .send({id:555604})
          .expect(401)
          .expect({code: 401,msg: "Already in favourites."})
      });
    });
  });
  

describe("POST /api/users/:userName/favourites/movies/delete", () => {
  describe("when the payload is correct", () => {
    it("should delete a movie id from favourite movies", () => {
      return request(api)
        .post("/api/users/user2/favourites/movies/delete")
        .send({id:555604})
        .expect(201)
        .then((res) => {
          expect(res.body.favouriteMovies).to.have.members([]);
          expect(res.body.favouriteMovies.length).to.equal(0);
        });
    });
  });
});

describe("GET /api/users/:userName/favourites/movies", () => {
  it("should return an array of favourite movie ids", () => {
    return request(api)
      .get("/api/users/user2/favourites/movies")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).to.have.members([555604]);
        expect(res.body.length).to.equal(1);
      });
  });
});


describe("POST /api/users/:userName/favourites/tv", () => {
  describe("when the payload is correct", () => {
    it("should add a tv id to a users favourite tv", () => {
      return request(api)
        .post("/api/users/user1/favourites/tv")
        .send({id:211128})
        .expect(201)
        .then((res) => {
          expect(res.body.favouriteTv).to.have.members([211128]);
          expect(res.body.favouriteTv.length).to.equal(1);
        });
    });
  });
  describe("when the payload is a duplicate", () => {
    it("should return duplicate favourite tv error", () => {
      return request(api)
        .post("/api/users/user2/favourites/tv")
        .send({id:119051})
        .expect(401)
        .expect({code: 401,msg: "Already in favourites."})
    });
  });
});


describe("POST /api/users/:userName/favourites/tv/delete", () => {
describe("when the payload is correct", () => {
  it("should delete a tv id from favourite tv", () => {
    return request(api)
      .post("/api/users/user2/favourites/tv/delete")
      .send({id:119051})
      .expect(201)
      .then((res) => {
        expect(res.body.favouriteTv).to.have.members([]);
        expect(res.body.favouriteTv.length).to.equal(0);
      });
  });
});
});

describe("GET /api/users/:userName/favourites/tv", () => {
it("should return an array of favourite tv ids", () => {
  return request(api)
    .get("/api/users/user2/favourites/tv")
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .then((res) => {
      expect(res.body).to.have.members([119051]);
      expect(res.body.length).to.equal(1);
    });
});
});


});