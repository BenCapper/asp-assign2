import express from 'express';
import User from './userModel';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import movieModel from '../movies/movieModel';
import tvModel from '../tv/tvModel';

const router = express.Router(); // eslint-disable-line

let regex = new RegExp("^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$");
let regex2 = new RegExp("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{5,15}$"); //5-15 Chars - 1 digit, 1 Upper, 1 Lower, 1 Special

// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// Register OR authenticate a user
router.post('/',asyncHandler( async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      res.status(401).json({success: false, msg: 'Please pass username and password.'});
      return next();
    }
    if (regex2.test(req.body.password)) {
        res.status(401).json({success: false, msg: 'BadPassword'});
        return next();
    }
    if (req.query.action === 'register') {
      await User.create(req.body);
      res.status(201).json({code: 201, msg: 'Successful created new user.'});
    } else {
      const user = await User.findByUserName(req.body.username);
        if (!user) return res.status(401).json({ code: 401, msg: 'Authentication failed. User not found.' });
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (isMatch && !err) {
            // if user is found and password matches, create a token
            const token = jwt.sign(user.username, process.env.SECRET);
            // return the information including token as JSON
            res.status(200).json({success: true, token: 'BEARER ' + token});
          } else {
            res.status(401).json({code: 401,msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
  }));

// Update a user
router.put('/:id', async (req, res) => {
  if (req.body._id) delete req.body._id;
  const result = await User.updateOne({
      _id: req.params.id,
  }, req.body);
  if (result.matchedCount) {
      res.status(200).json({ code:200, msg: 'User Updated Sucessfully' });
  } else {
      res.status(404).json({ code: 404, msg: 'Unable to Update User' });
  }
});


router.post('/:userName/favourites/movies', asyncHandler(async (req, res) => {
    const newFavourite = req.body.id;
    const userName = req.params.userName;
    const movie = await movieModel.findByMovieDBId(newFavourite);
    const user = await User.findByUserName(userName);
    !user.favouriteMovies.includes(movie._id) ? await user.favouriteMovies.push(movie._id) : 
        res.status(401).json({code: 401,msg: movie})
    await user.save(); 
    res.status(201).json(user); 
  }));

router.post('/:userName/favourites/movies/delete', asyncHandler(async (req, res) => {
  const newFavourite = req.body.id;
  const userName = req.params.userName;
  const user = await User.findByUserName(userName);
  const movie = await movieModel.findByMovieDBId(newFavourite);
  const index =  await user.favouriteMovies.indexOf(movie);
  await user.favouriteMovies.splice(index-1 , 1);
  await user.save(); 
  res.status(201).json(user); 
}));


router.get('/:userName/favourites/movies', asyncHandler( async (req, res) => {
  const userName = req.params.userName;
  const user = await User.findByUserName(userName).populate('favouriteMovies');
  res.status(200).json(user.favouriteMovies);
}));

router.post('/:userName/favourites/tv', asyncHandler(async (req, res) => {
  const newFavourite = req.body.id;
  const userName = req.params.userName;
  const tv = await tvModel.findByTvDBId(newFavourite);
  const user = await User.findByUserName(userName);
  !user.favouriteTv.includes(tv._id) ? await user.favouriteTv.push(tv._id) : 
      res.status(401).json({code: 401,msg: 'Already in Favourite Tv'})
  await user.save(); 
  res.status(201).json(user); 
}));

router.post('/:userName/favourites/tv/delete', asyncHandler(async (req, res) => {
  const newFavourite = req.body.id;
  const userName = req.params.userName;
  const user = await User.findByUserName(userName);
  const index = user.favouriteTv.indexOf(newFavourite);
  await user.favouriteTv.splice(index-1,1);
  await user.save(); 
  res.status(201).json(user); 
}));

router.get('/:userName/favourites/tv', asyncHandler( async (req, res) => {
const userName = req.params.userName;
const user = await User.findByUserName(userName).populate('favouriteTv');
res.status(200).json(user.favouriteTv);
}));

export default router;