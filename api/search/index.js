import express from 'express';
import asyncHandler from 'express-async-handler';
import { searchCompany, searchPerson } from '../tmdb-api';

const router = express.Router(); 

router.get('/company/:query', asyncHandler(async (req, res) => {
    const query = req.params.query;
    const companies = await searchCompany(query);
    res.status(200).json(companies);
}));

router.get('/person/:query', asyncHandler(async (req, res) => {
    const query = req.params.query;
    const people = await searchPerson(query);
    res.status(200).json(people);
}));


export default router;