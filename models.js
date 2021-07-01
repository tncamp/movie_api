const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  ImagePath: String,
  Featured: Boolean
});


let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movies' }]
});

let directorSchema = mongoose.Schema({
  Name: {type: String, required: true},
  Bio: {type: String, required: true},
  Born: Date,
  Died: Date
});

let genreSchema = mongoose.Schema({
  Name: { type: String, required: true},
  Description: { type: String, required: true}
});


let movie = mongoose.model('movie', movieSchema);
let user = mongoose.model('user', userSchema);
let director = mongoose.model('director', directorSchema);
let genre = mongoose.model('genre', genreSchema);

module.exports.movie = movie;
module.exports.user = user;
module.exports.director = director;
module.exports.genre = genre;
