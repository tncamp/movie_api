const express = require('express');
morgan = require('morgan');
const app = express();
app.use(morgan('common'));

let topMovies = [
  {
    title: 'Joker (2019)',
    director: 'Todd Phillips'
  },
  {
    title: 'The Shawshank Redemption (1994)',
    director: 'Frank Darabont'
  },
  {
    title: 'Spirited Away (2001)',
    director: 'Hayao Miyazaki'
  },
  {
    title: 'Kingsman: The Secret Service (2014)',
    director: 'Matthew Vaughn'
  },
  {
    title: 'The Shining (1980)',
    director: 'Stanley Kubrick'
  },
  {
    title: 'Blow (2001)',
    director: 'Ted Demme'
  },
  {
    title: 'Step Brothers (2008)',
    director: 'Adam McKay'
  },
  {
    title: 'Bridesmaids (2011)',
    director: 'Paul Feig'
  },
  {
    title: 'Butterfly Effect (2004)',
    director: 'Eric Bress'
  },
  {
    title: 'Saving Private Ryan (1998)',
    director: 'Steven Spielberg'
  }
];

app.use(express.static('public'));

//GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix Application!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
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
