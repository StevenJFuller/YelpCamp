const passport = require(`passport`);
const express = require(`express`);
const User = require(`../models/user`);

const router = express.Router();

// Root route
router.get(`/`, (req, res) => {
  res.render(`landing.ejs`);
});

router.get(`/register`, (req, res) => {
  res.render(`register`);
});

// Register user
router.post(`/register`, (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password)
    .then(() => {
      passport.authenticate(`local`)(req, res, () => {
        res.redirect(`/campgrounds`);
      });
    })
    .catch(err => {
      console.error(err);
      return res.render(`register`);
    });
});

router.get(`/login`, (req, res) => {
  res.render(`login`);
});

// Log in
router.post(
  `/login`,
  passport.authenticate(`local`, {
    successRedirect: `/campgrounds`,
    failureRedirect: `/login`,
  })
);

// Log out
router.get(`/logout`, (req, res) => {
  req.logout();
  res.redirect(`/campgrounds`);
});

module.exports = router;
