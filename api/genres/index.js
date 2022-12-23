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

// Update a genre
router.put('/:id', async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await Genre.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({ code:200, msg: 'Genre Updated Sucessfully' });
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to Update Genre' });
    }
  });

router.get('/movie', asyncHandler(async (req, res) => {
  const movieGenres = await getGenres();
  if (movieGenres) {
      res.status(200).json(movieGenres);
  } else {
      res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
  }
}));

router.get('/tv', asyncHandler(async (req, res) => {
    const tvGenres = await getTvGenres();
    if (tvGenres) {
        res.status(200).json(tvGenres);
    } else {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
  }));

export default router;