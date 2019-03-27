// Dependencies
const express = require(`express`);
const bodyParser = require(`body-parser`);
const mongoose = require(`mongoose`);
const passport = require(`passport`);
const LocalStrategy = require(`passport-local`);
const campgroundRoutes = require(`./routes/campgrounds`);
const commentRoutes = require(`./routes/comments`);
const indexRoutes = require(`./routes/index`);

const seedDB = require(`./seeds`);

// Models
const User = require(`./models/user`);

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
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use(`/campgrounds`, campgroundRoutes);
app.use(`/campgrounds/:id/comments`, commentRoutes);
app.use(`/`, indexRoutes);
app.set(`view engine`, `ejs`);

// Seed the database
// seedDB();

app.listen(3000, () => {
  console.log(`App listening on port 3000`);
});
