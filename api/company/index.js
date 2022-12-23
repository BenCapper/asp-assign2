import express from 'express';
import asyncHandler from 'express-async-handler';
import { getCompany } from '../tmdb-api';

const router = express.Router(); 

router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const company = await getCompany(id);
    if (company) {
        res.status(200).json(company);
    } else {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
}));


export default router;