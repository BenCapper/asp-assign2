import './db';
import './seedData';
import session from 'express-session';
import passport from './authenticate';
import dotenv from 'dotenv';
import express from 'express';
import moviesRouter from './api/movies';
import tvRouter from './api/tv';
import searchRouter from './api/search';
import companyRouter from './api/company';
import genresRouter from './api/genres';
import usersRouter from './api/users';

dotenv.config();

const errHandler = (err, req, res, next) => {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }
  res.status(500).send(`Error Caught. Here's the details: ${err.stack} `);
};

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use(passport.initialize());

app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);
app.use('/api/tv', passport.authenticate('jwt', {session: false}), tvRouter);
app.use('/api/company', passport.authenticate('jwt', {session: false}), companyRouter);
app.use('/api/search',  searchRouter);
app.use('/api/genres', genresRouter);
app.use('/api/users', usersRouter);

app.use(errHandler);

let server = app.listen(port, () => {
  console.info(`Server running at ${port}`);
});

module.exports = server