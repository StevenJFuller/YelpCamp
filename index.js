const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
});

app.use(bodyParser.urlencoded({ extended: false }));

const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

const Campground = mongoose.model('campground', campgroundSchema);

// Campground.create({
//   name: 'Fun Forest',
//   image: 'https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg',
//   description: 'This forest is full of fun!',
// })
//   .then(campground => console.log('Campground created:', campground.name))
//   .catch(err => console.error('Error:', err));

app.get('/', (req, res) => {
  res.render('landing.ejs');
});

app.get('/campgrounds', (req, res) => {
  Campground.find({})
    .then(campgrounds => res.render('index.ejs', { campgrounds }))
    .catch(err => console.error(err));
});

app.post('/campgrounds', (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const { description } = req.body;
  const newCampground = { name, image, description };
  Campground.create(newCampground)
    .then(() => res.redirect('/campgrounds'))
    .catch(err => console.error(err));
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new.ejs');
});

app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id)
    .then(campground => res.render('show.ejs', { campground }))
    .catch(err => console.error(err));
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
