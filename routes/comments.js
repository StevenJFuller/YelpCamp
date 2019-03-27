const express = require(`express`);
const Campground = require(`../models/campground`);
const Comment = require(`../models/comment`);

const router = express.Router({ mergeParams: true });

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`/login`);
};

// New comment form
router.get(`/new`, isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
    .then(campground => res.render(`comments/new`, { campground }))
    .catch(err => console.error(err));
});

// Post new comment
router.post(`/`, isLoggedIn, (req, res) => {
  const { text, author } = req.body;
  const newComment = { text, author };
  Comment.create(newComment)
    .then(comment => {
      Campground.findById(req.params.id)
        .then(async campground => {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          await comment.save(); // needs await or error occurs where username does not show immediately
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${req.params.id}`);
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
});

module.exports = router;
