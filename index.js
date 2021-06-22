const express = require('express');
      morgan = require('morgan');
      bodyParser = require('body-parser');

const app = express();
app.use(morgan('common'));
app.use(bodyParser.json());

let movies = [
  {
    title : 'Joker',
    director : 'Todd Phillips',
    genres : 'Psychological Thriller'
  },

  {
    title : 'The Shawshank Redemption',
    director : 'Frank Darabont',
    genres : 'Drama'
  },

  {
    title : 'Spirited Away',
    director : 'Hayao Miyazaki',
    genres : 'Anime'
  },

  {
    title : 'Kingsman: The Secret Service',
    director : 'Matthew Vaughn',
    genres : 'Action'
  },

  {
    title : 'The Shining',
    director : 'Stanley Kubrick',
    genres : 'Horror'
  },

  {
    title : 'Blow',
    director : 'Ted Demme',
    genres : 'Drama'
  },

  {
    title : 'Step Brothers',
    director : 'Adam McKay',
    genres : 'Comedy'
  },

  {
    title : 'Bridesmaids',
    director : 'Paul Feig',
    genres : 'Comedy'
  },

  {
    title : 'Butterfly Effect',
    director : 'Eric Bress',
    genres : 'Psychological Thriller'
  },

  {
    title : 'Saving Private Ryan',
    director : 'Steven Spielberg',
    genres : 'Action'

  }
];

let directors = [
  {
    name : 'Todd Phillips',
    bio : 'Todd Phillips is a film director, producer, screenwriter, and actor.',
    born : 'December 20, 1970'

  },

  {
    name : 'Frank Darabont',
    bio : 'Frank Darabont is a Hungarian-American producer, film director, and screenwriter.',
    born : 'January 28, 1959'
  },

  {
    name : 'Hayao Miyazaki',
    bio : 'Hayao Miyazaki is a Japanese author, animator, producer, director, screenwriter and artist.',
    born : 'January 5, 1941'
  },

  {
    name : 'Matthew Vaughn',
    bio : 'Matthew Vaughn is a film producer and director',
    born : 'March 7, 1971'
  },

  {
    name : 'Stanley Kubrick',
    bio : 'Stanley Kubrick was an American screenwriter, director, producer, and photographer',
    born : 'July 26, 1928',
    death : 'March 7, 1999'
  },

  {
    name : 'Ted Demme',
    bio : 'Edward "Ted" Demme was an American actor, director, and producer',
    born : 'October 26, 1963',
    death : 'January 13, 2002'
  },

  {
    name : 'Adam McKay',
    bio : 'Adam McKay is a comedian, screenwriter, director and producer',
    born : 'April 17, 1968'
  },

  {
    name : 'Paul Feig',
    bio : 'Paul Feig is an American filmmaker and actor',
    born : 'September 17, 1962'
  },

  {
    name : 'Eric Bress',
    bio : 'Eric Bress is screenwriter, director, producer, and actor.',
    born : 'January 1, 1953'
  },
  {
    name : 'Steven Spielberg',
    bio : 'Steven Spielberg is a famous American film director, screenwriter, and producer.',
    born : 'December 18, 1946'
  }
];

let genres = [
  {
    category: 'Psychological Thriller',
    description: 'A psycholocial thriller blends elements of drama, mystery, and paranoia. It can often have a sense of a "dissolving sense of reality".'
  },

  {
    category: 'Drama',
    description: 'A drama relies on the relationships and emotions of realistic characters. '
  },

  {
    category: 'Anime',
    description: 'Anime is a genre involving hand-drawn and computer animations originating in Japan. '
  },

  {
    category: 'Horror',
    description: 'A horror is a genre whose purpose is to instill fear, dread, and terror in the viewer.'
  },

  {
    category: 'Comedy',
    description: 'A comedy is intended to be amusing, humorous, and induce laughter.'
  },

  {
    category: 'Action',
    description: 'An action film typically includes violence, physical feats, and fighting.'
  }
];

app.use(express.static('public'));

//GET requests
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

//get list of all movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

//get movie by title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movies) => {
    return movies.title === req.params.title
  }));
})

//get list of directors
app.get('/directors', (req, res) => {
  res.json(directors);
});

//get director by name
app.get('/directors/:name', (req, res) => {
  res.json(directors.find((directors) => {
    return directors.name === req.params.name
  }));
})

//get list of genres
app.get('/genres', (req, res) => {
  res.json(genres)
});

//allow new users to register
app.post('/users/:user/registration' , (req, res) => {
  res.send('User successfully created!')
});

//allow users to deregister
app.delete('/users/:user/update' , (req, res) => {
  res.send('User was successfully removed!')
});

//allow users to update username
app.put('/users/:user/update' , (req, res) => {
  res.send('Username was successfully changed')
});

//allow users to add movie to favorites
app.post('/users/:user/favorites' , (req, res) => {
  res.send('Added to favorites')
});

//allow users to remove movie from favorites
app.delete('/users/:user/favorites' , (req , res) => {
  res.send('Removed from favorites')
});

//Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Uh oh, something went wrong!');
});

//listens for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
