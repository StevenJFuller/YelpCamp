// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const seedDB = require('./seeds');

// Models
const Campground = require('./models/campground');

// Config
const app = express();
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
});
app.use(bodyParser.urlencoded({ extended: false }));

seedDB();

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
  Campground.findById(req.params.id).populate('comments').exec()
    .then(campground => res.render('show.ejs', { campground }))
    .catch(err => console.error(err));
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
