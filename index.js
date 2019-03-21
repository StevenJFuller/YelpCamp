// Dependencies
const express = require(`express`);
const bodyParser = require(`body-parser`);
const mongoose = require(`mongoose`);
const passport = require(`passport`);
const LocalStrategy = require(`passport-local`);
const seedDB = require(`./seeds`);

// Models
const Campground = require(`./models/campground`);
const Comment = require(`./models/comment`);
const User = require(`./models/user`);

// Config
const app = express();
mongoose.connect(`mongodb://localhost:27017/yelp_camp`, {
  useNewUrlParser: true,
});
app.use(bodyParser.urlencoded({ extended: false }));
app.set(`view engine`, `ejs`);

seedDB();

app.get(`/`, (req, res) => {
  res.render(`landing.ejs`);
});

app.get(`/campgrounds`, (req, res) => {
  Campground.find({})
    .then(campgrounds => res.render(`campgrounds/index`, { campgrounds }))
    .catch(err => console.error(err));
});

app.post(`/campgrounds`, (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const { description } = req.body;
  const newCampground = { name, image, description };
  Campground.create(newCampground)
    .then(() => res.redirect(`/campgrounds`))
    .catch(err => console.error(err));
});

app.get(`/campgrounds/new`, (req, res) => {
  res.render(`campgrounds/new`);
});

app.get(`/campgrounds/:id`, (req, res) => {
  Campground.findById(req.params.id)
    .populate(`comments`)
    .exec()
    .then(campground => res.render(`campgrounds/show`, { campground }))
    .catch(err => console.error(err));
});

// Comments routes

app.get(`/campgrounds/:id/comments/new`, (req, res) => {
  Campground.findById(req.params.id)
    .then(campground => res.render(`comments/new`, { campground }))
    .catch(err => console.error(err));
});

app.post(`/campgrounds/:id/comments`, (req, res) => {
  const { text, author } = req.body;
  const newComment = { text, author };
  Comment.create(newComment)
    .then(comment => {
      Campground.findById(req.params.id)
        .then(campground => {
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${req.params.id}`);
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
});

app.listen(3000, () => {
  console.log(`App listening on port 3000`);
});
