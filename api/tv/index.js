import uniqid from 'uniqid';
import express from 'express';
import tvModel from './tvModel';
import asyncHandler from 'express-async-handler';
import { getTvReviews, getTopTv, getTrendingTv, getTv, getTvImages, getTvSeason } from '../tmdb-api';

const router = express.Router(); 

router.get('/', asyncHandler(async (req, res) => {
    const tv = await tvModel.find();
    res.status(200).json(tv);
}));


// Get tv details
router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const tv = await getTv(id);
    if (tv) {
        res.status(200).json(tv);
    } else {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
}));


router.get('/tmdb/top', asyncHandler( async(req, res) => {
     const topTv = await getTopTv();
     res.status(200).json(topTv);
}));

router.get('/tmdb/trending', asyncHandler( async(req, res) => {
    const trendingTv = await getTrendingTv();
    res.status(200).json(trendingTv);
}));

router.get('/:id/images', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const images = await getTvImages(id);
    if (images) {
        res.status(200).json(images);
    } else {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
}));

router.get('/:id/reviews', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const review = await getTvReviews(id);
    if (review) {
        res.status(200).json(review);
    } else {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
}));

router.get('/:id/season/:sid', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const sid = parseInt(req.params.sid);
    const season = await getTvSeason(id, sid);
    if (season) {
        res.status(200).json(season);
    } else {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
}));


export default router;