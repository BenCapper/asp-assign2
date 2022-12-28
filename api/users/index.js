import express from 'express';
import User from './userModel';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import movieModel from '../movies/movieModel';

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

router.post('/:userName/favourites/movies', asyncHandler(async (req, res) => {
    const id = req.body.id;
    const userName = req.params.userName;
    const user = await User.findByUserName(userName);
    if (!user.favouriteMovies.includes(id)) {
        await user.favouriteMovies.push(id);
        await user.save(); 
        res.status(201).json(user); 
    }
    else{
      res.status(401).json({code: 401,msg: "Already in favourites."})
    }     
  }));

router.post('/:userName/favourites/movies/delete', asyncHandler(async (req, res) => {
  const id = req.body.id;
  const userName = req.params.userName;
  const user = await User.findByUserName(userName);
  const movie = await movieModel.findByMovieDBId(id);
  const index =  await user.favouriteMovies.indexOf(movie);
  await user.favouriteMovies.splice(index , 1);
  await user.save(); 
  res.status(201).json(user); 
}));


router.get('/:userName/favourites/movies', asyncHandler( async (req, res) => {
  const userName = req.params.userName;
  const user = await User.findByUserName(userName).populate('favouriteMovies');
  res.status(200).json(user.favouriteMovies);
}));

router.post('/:userName/favourites/tv', asyncHandler(async (req, res) => {
  const id = req.body.id;
  const userName = req.params.userName;
  const user = await User.findByUserName(userName);
  if (!user.favouriteTv.includes(id)) {
      await user.favouriteTv.push(id);
      await user.save(); 
      res.status(201).json(user); 
  }
  else{
    res.status(401).json({code: 401,msg: "Already in favourites."})
  } 
}));

router.post('/:userName/favourites/tv/delete', asyncHandler(async (req, res) => {
  const id = req.body.id;
  const userName = req.params.userName;
  const user = await User.findByUserName(userName);
  const index = user.favouriteTv.indexOf(id);
  await user.favouriteTv.splice(index,1);
  await user.save(); 
  res.status(201).json(user); 
}));

router.get('/:userName/favourites/tv', asyncHandler( async (req, res) => {
const userName = req.params.userName;
const user = await User.findByUserName(userName).populate('favouriteTv');
res.status(200).json(user.favouriteTv);
}));

export default router;