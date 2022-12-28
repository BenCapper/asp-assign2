# Assignment 2 - Agile Software Practice.
 
Name: Ben Capper 20088114
 
## API endpoints.
 
+ GET api/company/:id (Auth) - Get a specific production company.
 
+ GET api/search/company/:query - Get companies matching the query.
+ GET api/search/person/:query - Get all people matching the query.
 
+ GET api/genres - Get all genres.
+ GET api/genres/movie - Get all movie genres.
+ GET api/genres/tv - Get all tv genres.
 
+ GET api/users - Get all users.
+ GET api/users/:userName/favourites/movies - Get a users favourite movies.
+ GET api/users/:userName/favourites/tv - Get a users favourite tv series.
+ POST api/users?action=register - Register a user.
+ POST api/users?action=authenticate - Authenticate a user.
+ POST api/users/:userName/favourites/movies - Add a movie to a users favourites.
+ POST api/users/:userName/favourites/movies/delete - Remove a movie from a users favourites.
+ POST api/users/:userName/favourites/tv - Add a tv series to a users favourites.
+ POST api/users/:userName/favourites/tv/delete - Remove a tv series from a users favourites.
 
+ GET api/movies (Auth) - Get all movies.
+ GET api/movies/:id (Auth) - Get a specific movie.
+ GET api/movies/:id/similar (Auth) - Get an array of similar movies to a specific movie.
+ GET api/movies/:id/images (Auth) - Get an array of movie images.
+ GET api/movies/:id/reviews (Auth) - Get an array of movie reviews.
+ GET api/movies/tmdb/upcoming (Auth) - Get an array of upcoming movies.
+ GET api/movies/tmdb/trending (Auth) - Get an array of trending movies.
 
+ GET api/tv (Auth) - Get all tv.
+ GET api/tv/:id (Auth) - Get a specific tv series.
+ GET api/tv/:id/season/:sid (Auth) - Get a specified season of a specific tv series.
+ GET api/tv/:id/images (Auth) - Get an array of tv series images.
+ GET api/tv/:id/reviews (Auth) - Get an array of tv series reviews.
+ GET api/tv/tmdb/top (Auth) - Get an array of top rated tv series.
+ GET api/tv/tmdb/trending (Auth) - Get an array of trending tv series.
 
 
## Test cases.
 
~~~
  Users endpoint
    GET /api/users
database connected to movies on ac-7etqwn6-shard-00-00.tqinupi.mongodb.net
      √ should return the 2 users and a status 200
    POST /api/users
      For a register action
        when the payload is correct
          √ should return a 201 status and the confirmation message (209ms)
        when the payload is incorrect
          √ should return a 401 status and the confirmation message
      For an authenticate action
        when the payload is correct
          √ should return a 200 status and a generated token (195ms)
        when the password is incorrect
          √ should return a 401 status and a fail message (220ms)
    POST /api/users/:userName/favourites/movies
      when the payload is correct
        √ should add a movie id to a users favourite movies (49ms)
      when the payload is a duplicate
        √ should return duplicate favourite movie error
    POST /api/users/:userName/favourites/movies/delete
      when the payload is correct
        √ should delete a movie id from favourite movies (48ms)
    GET /api/users/:userName/favourites/movies
      √ should return an array of favourite movie ids
    POST /api/users/:userName/favourites/tv
      when the payload is correct
        √ should add a tv id to a users favourite tv
      when the payload is a duplicate
        √ should return duplicate favourite tv error
    POST /api/users/:userName/favourites/tv/delete
      when the payload is correct
        √ should delete a tv id from favourite tv
    GET /api/users/:userName/favourites/tv
      √ should return an array of favourite tv ids
 
  Movies endpoint
    GET /api/movies
      when the user is not authenticated
        √ should return an empty json object
    GET /api/movies/:id
      when the user is not authenticated
        √ should return an empty json object
    GET /api/movies/:id/similar
      when the user is not authenticated
        √ should return an empty json object
    GET /api/movies/:id/images
      when the user is not authenticated
        √ should return an empty json object
    GET /api/movies/:id/reviews
      when the user is not authenticated
        √ should return an empty json object
    GET /api/movies/tmdb/upcoming
      when the user is not authenticated
        √ should return an empty json object
    GET /api/movies/tmdb/trending
      when the user is not authenticated
        √ should return an empty json object
    GET /api/movies
      √ should return 20 movies and a status 200 (46ms)
    GET /api/movies/:id
      when the id is valid
        √ should return the matching movie (85ms)
      when the id is invalid
        √ should return the NOT found message (138ms)
    GET /api/movies/:id/similar
      when the id is valid
        √ should return an array of 20 similar movies (64ms)
      when the id is invalid
        √ should return the NOT found message (147ms)
    GET /api/movies/:id/images
      when the id is valid
        √ should return an array of movie images (59ms)
      when the id is invalid
        √ should return the NOT found message (132ms)
    GET /api/movies/:id/reviews
      when the id is valid
        √ should return an array of movie reviews (86ms)
      when the id is invalid
        √ should return the NOT found message (146ms)
    GET /api/movies/tmdb/upcoming
      when the id is valid
        √ should return an array of upcoming movies (155ms)
    GET /api/movies/tmdb/trending
      √ should return an array of trending movies (60ms)
 
  Tv endpoint
    GET /api/tv
      when the user is not authenticated
        √ should return an empty json object
    GET /api/tv/:id
      when the user is not authenticated
        √ should return an empty json object
    GET /api/tv/:id/similar
      when the user is not authenticated
        √ should return an empty json object
    GET /api/tv/:id/images
      when the user is not authenticated
        √ should return an empty json object
    GET /api/tv/:id/reviews
      when the user is not authenticated
        √ should return an empty json object
    GET /api/tv/:id/season/:sid
      when the user is not authenticated
        √ should return an empty json object
    GET /api/tv/tmdb/top
      when the user is not authenticated
        √ should return an empty json object
    GET /api/tv/tmdb/trending
      when the user is not authenticated
        √ should return an empty json object
    GET /api/tv
      √ should return 20 tv series and a status 200 (57ms)
    GET /api/tv/:id
      when the id is valid
        √ should return the matching tv series (59ms)
      when the id is invalid
        √ should return the NOT found message (136ms)
    GET /api/tv/:id/season/:sid
      when the id is valid
        √ should return a tv season with an array of 8 episodes (58ms)
      when the tv id is invalid
        √ should return the NOT found message (53ms)
      when the season id is invalid
        √ should return the NOT found message (150ms)
    GET /api/tv/:id/images
      when the id is valid
        √ should return an array of tv series images (93ms)
      when the id is invalid
        √ should return the NOT found message (137ms)
    GET /api/tv/:id/reviews
      when the id is valid
        √ should return an array of tv series reviews (56ms)
      when the id is invalid
        √ should return the NOT found message (137ms)
    GET /api/tv/tmdb/top
      when the id is valid
        √ should return an array of upcoming tv series (57ms)
    GET /api/tv/tmdb/trending
      √ should return an array of trending tv series (64ms)
 
  Search endpoint
    GET /api/search/company/:query
      when the query has results
        √ should return an array of companies (50ms)
      when the query has no results
        √ should return an empty object (44ms)
    GET /api/search/person/:query
      when the query has results
        √ should return an array of people (136ms)
      when the query has no results
        √ should return an empty object (132ms)
 
  Company endpoint
    GET /api/company/:id
      when the id is valid
        √ should return a company object (169ms)
      when the id is invalid
        √ should return a 404 error message (141ms)
 
  Genres endpoint
    GET /api/genres
      √ should return an array of 4 genres
    GET /api/genres/movie
      √ should return an array of movie genres
    GET /api/genres/tv
      √ should return an array of tv genres
 
 
  60 passing (34s)
 
--------------------------|---------|----------|---------|---------|--------------------------------------------------------
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------|---------|----------|---------|---------|--------------------------------------------------------
All files                 |   86.45 |    81.39 |   86.08 |   86.65 |
 assignment2              |   90.32 |        0 |      50 |   90.32 |
  index.js                |   90.32 |        0 |      50 |   90.32 | 19-22
 assignment2/api          |   83.33 |    70.58 |   80.39 |   83.33 |
  tmdb-api.js             |   83.33 |    70.58 |   80.39 |   83.33 | 8,13,22,27,36,41,50,55,119-125,133-139,219,224,233,238
 assignment2/api/company  |     100 |      100 |     100 |     100 |
  index.js                |     100 |      100 |     100 |     100 |
 assignment2/api/genres   |   84.61 |       50 |     100 |   81.81 |
  genreModel.js           |     100 |      100 |     100 |     100 |
  index.js                |   82.35 |       50 |     100 |   77.77 | 15-16,20-21
 assignment2/api/movies   |     100 |      100 |     100 |     100 |
  index.js                |     100 |      100 |     100 |     100 |
  movieModel.js           |     100 |      100 |     100 |     100 |
 assignment2/api/search   |     100 |      100 |     100 |     100 |
  index.js                |     100 |      100 |     100 |     100 |
 assignment2/api/tv       |   98.97 |      100 |   96.55 |   98.36 |
  index.js                |     100 |      100 |     100 |     100 |
  tvModel.js              |   85.71 |      100 |       0 |   83.33 | 25
 assignment2/api/users    |   97.51 |    94.59 |     100 |    96.9 |
  index.js                |   99.26 |    98.43 |     100 |     100 | 28
  userModel.js            |      88 |       70 |     100 |    87.5 | 21,32,36
 assignment2/authenticate |   95.83 |    83.33 |     100 |   94.73 |
  index.js                |   95.83 |    83.33 |     100 |   94.73 | 19
 assignment2/db           |   81.81 |      100 |   33.33 |   81.81 |
  index.js                |   81.81 |      100 |   33.33 |   81.81 | 11,14
 assignment2/seedData     |   28.04 |     3.84 |       0 |   36.53 |
  genres.js               |     100 |      100 |     100 |     100 |
  index.js                |   15.71 |     3.84 |       0 |      25 | 15-61,64-67
  movies.js               |     100 |      100 |     100 |     100 |
  tv.js                   |     100 |      100 |     100 |     100 |
  users.js                |     100 |      100 |     100 |     100 |
--------------------------|---------|----------|---------|---------|--------------------------------------------------------
 
~~~
 
 
## Independent Learning (if relevant)
 
I attempted installing Istanbul and uploading the coverage report. The package is installed and working as seen above, although does not show reports on the web.
