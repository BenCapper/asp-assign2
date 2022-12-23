import userModel from '../api/users/userModel';
import genreModel from '../api/genres/genreModel';
import movieModel from '../api/movies/movieModel';
import tvModel from '../api/tv/tvModel';
import movies from './movies.js';
import tv from './tv.js';
import users from './users';
import genres from './genres';
import dotenv from 'dotenv';

dotenv.config();


// deletes all genre documents in collection and inserts test data
async function loadGenres() {
    console.log('load genre Data');
    try {
      await genreModel.deleteMany();
      await genreModel.collection.insertMany(genres);
      console.info(`${genres.length} genres were successfully stored.`);
    } catch (err) {
      console.error(`failed to Load genre Data: ${err}`);
    }
  }

// deletes all user documents in collection and inserts test data
async function loadUsers() {
    console.log('load user Data');
    try {
      await userModel.deleteMany();
      await users.forEach(user => userModel.create(user));
      console.info(`${users.length} users were successfully stored.`);
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  }

// deletes all movies documents in collection and inserts test data
export async function loadMovies() {
    console.log('load movie data');
    console.log(movies.length);
    try {
      await movieModel.deleteMany();
      await movieModel.collection.insertMany(movies);
      console.info(`${movies.length} Movies were successfully stored.`);
    } catch (err) {
      console.error(`failed to Load movie Data: ${err}`);
    }
  }

export async function loadTv() {
  console.log('load tv data');
  console.log(tv.length);
  try {
    await tvModel.deleteMany();
    await tvModel.collection.insertMany(tv);
    console.info(`${tv.length} Tv were successfully stored.`);
  } catch (err) {
    console.error(`failed to Load tv Data: ${err}`);
  }
}

if (process.env.SEED_DB) {
  loadUsers();
  loadGenres();
  loadMovies();
  loadTv();
}