import express from 'express';
import movieModel from './movieModel';
import asyncHandler from 'express-async-handler';
import { getUpcomingMovies, getTrendingMovies, getMovie, getSimilarMovies, getMovieImages, getMovieReviews } from '../tmdb-api';
 
const router = express.Router();
 
router.get('/', asyncHandler(async (req, res) => {
    const movies = await movieModel.find();
    res.status(200).json(movies);
}));
 
 
// Get movie details
router.get('/:id', asyncHandler(async (req, res) => {
    let movie;
    const id = parseInt(req.params.id);
    try {
        movie = await getMovie(id);
    }
    catch {
        movie = undefined;
    }
    if (movie !== undefined) {
        res.status(200).json(movie);
    } else {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
}));
 
router.get('/tmdb/upcoming', asyncHandler( async(req, res) => {
    const upcomingMovies = await getUpcomingMovies();
    res.status(200).json(upcomingMovies);
  }));
 
router.get('/tmdb/trending', asyncHandler( async(req, res) => {
    const trendingMovies = await getTrendingMovies();
    res.status(200).json(trendingMovies);
}));
 
router.get('/:id/similar', asyncHandler(async (req, res) => {
    let similar;
    const id = parseInt(req.params.id);
    try {
        similar = await getSimilarMovies(id);
    }
    catch{
        similar = undefined
    }
    if (similar !== undefined) {
        res.status(200).json(similar);
    } else {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
}));
 
router.get('/:id/images', asyncHandler(async (req, res) => {
    let images;
    const id = parseInt(req.params.id);
    try{
        images = await getMovieImages(id);
    }
    catch{
        images = undefined;
    }
    if (images !== undefined) {
        res.status(200).json(images);
    } else {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
}));
 
router.get('/:id/reviews', asyncHandler(async (req, res) => {
    let review;
    const id = parseInt(req.params.id);
    try {
        review = await getMovieReviews(id);
    }
    catch {
        review = undefined;
    }
    if (review !== undefined) {
        res.status(200).json(review);
    } else {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
}));
 
 
 
export default router;