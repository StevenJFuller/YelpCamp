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

// Middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`/login`);
};

// Config
const app = express();
mongoose.connect(`mongodb://localhost:27017/yelp_camp`, {
  useNewUrlParser: true,
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  require(`express-session`)({
    secret: `Murphy is a silly doggo`,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set(`view engine`, `ejs`);

seedDB();

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Routes
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

app.get(`/campgrounds/new`, isLoggedIn, (req, res) => {
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
app.get(`/campgrounds/:id/comments/new`, isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
    .then(campground => res.render(`comments/new`, { campground }))
    .catch(err => console.error(err));
});

app.post(`/campgrounds/:id/comments`, isLoggedIn, (req, res) => {
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

// Auth routes
app.get(`/register`, (req, res) => {
  res.render(`register`);
});

app.post(`/register`, (req, res) => {
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

app.get(`/login`, (req, res) => {
  res.render(`login`);
});

app.post(
  `/login`,
  passport.authenticate(`local`, {
    successRedirect: `/campgrounds`,
    failureRedirect: `/login`,
  })
);

app.get(`/logout`, (req, res) => {
  req.logout();
  res.redirect(`/campgrounds`);
});

app.listen(3000, () => {
  console.log(`App listening on port 3000`);
});
