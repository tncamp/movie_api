const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');

const movies = Models.movie;
const users = Models.user;
const directors = Models.director;
const genres = Models.genre;

//mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.connect( process.env.Connection_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});


app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));

const cors = require('cors');
app.use(cors());
const { check, validationResult } = require('express-validator');
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

//get list of all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//get movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  movies.findOne({ Title: req.params.Title})
  .then((movie) => {
    res.json(movie);
  })
    .catch((err) => {
      console.error(err);
    });
  });

//get list of directors
app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
  directors.find()
  .then((directors) => {
    res.status(201).json(directors);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get director by name
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  directors.findOne({ Name: req.params.Name })
  .then((director) => {
    res.json(director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get list of genres
app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
  genres.find()
  .then((genre) => {
    res.status(201).json(genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get genre by name
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  genres.findOne({ Name: req.params.Name })
  .then ((genre) => {
    res.json(genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//allow users to register
app.post('/users' ,
[
  check('Username', 'Username is required').isLength({min: 3}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email is not valid').isEmail()
], (req, res) => {
// checks the validation object for errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = users.hashPassword(req.body.Password);
  users.findOne({ Username: req.body.Username})
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists!');
      } else {
        users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.findOne({ Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//allow users to update info
app.put('/users/:Username' ,
[
  check('Username', 'Username is required').isLength({min: 3}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email is not valid').isEmail()
], (req, res) => {
// checks the validation object for errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = users.hashPassword(req.body.Password);
  users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    },
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/favorites/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params._id }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//allow users to remove movie from favorites
app.delete('/users/:Username/favorites/:_id', passport.authenticate('jwt', { session: false }),  (req, res) => {
  users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params._id }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//allow users to deregister
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
    if(!user) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.params.Username + ' was removed');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Uh oh, something went wrong!');
});

//listens for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Your app is listening on Port ' + port);
});
