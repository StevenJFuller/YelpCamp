const express = require(`express`);
const Campground = require(`../models/campground`);

const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`/login`);
};

// Show all campgrounds
router.get(`/`, (req, res) => {
  Campground.find({})
    .then(campgrounds => res.render(`campgrounds/index`, { campgrounds }))
    .catch(err => console.error(err));
});

// New campground form
router.get(`/new`, isLoggedIn, (req, res) => {
  res.render(`campgrounds/new`);
});

// Add new campground
router.post(`/`, isLoggedIn, (req, res) => {
  const { name, image, description } = req.body;
  const { id, username } = req.user;
  const author = { id, username };
  const newCampground = { name, image, description, author };
  Campground.create(newCampground)
    .then(() => res.redirect(`/campgrounds`))
    .catch(err => console.error(err));
});

// Show specific campground
router.get(`/:id`, (req, res) => {
  Campground.findById(req.params.id)
    .populate(`comments`)
    .exec()
    .then(campground => res.render(`campgrounds/show`, { campground }))
    .catch(err => console.error(err));
});

module.exports = router;
