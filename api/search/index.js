import express from 'express';
import asyncHandler from 'express-async-handler';
import { searchCompany, searchPerson } from '../tmdb-api';

const router = express.Router(); 

router.get('/company/:query', asyncHandler(async (req, res) => {
    const query = req.params.query;
    const companies = await searchCompany(query);
    if (companies) {
        res.status(200).json(companies);
    } else {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
}));

router.get('/person/:query', asyncHandler(async (req, res) => {
    const query = req.params.query;
    const people = await searchPerson(query);
    if (people) {
        res.status(200).json(people);
    } else {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
}));


export default router;