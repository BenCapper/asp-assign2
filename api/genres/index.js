import express from 'express';
import Genre from './genreModel';
import asyncHandler from 'express-async-handler';
import { getGenres, getTvGenres } from '../tmdb-api';

const router = express.Router(); 

// Get all genres
router.get('/', async (req, res) => {
    const genres = await Genre.find();
    res.status(200).json(genres);
});

router.get('/movie', asyncHandler(async (req, res) => {
    const movieGenres = await getGenres();
    res.status(200).json(movieGenres);
}));

router.get('/tv', asyncHandler(async (req, res) => {
    const tvGenres = await getTvGenres();
    res.status(200).json(tvGenres);
  }));

export default router;