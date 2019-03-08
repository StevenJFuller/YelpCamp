const express = require('express');

const app = express();

const campgrounds = [
  {
    name: 'Dark Bushy Place',
    image:
      'https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104490f1c870a6eeb6bb_340.jpg',
  },
  {
    name: 'Mountain View',
    image:
      'https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104490f1c870a6eeb6bb_340.jpg',
  },
  {
    name: 'Fun Forest',
    image: 'https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg',
  },
];

app.get('/', (req, res) => {
  res.render('index.ejs', { campgrounds });
});

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds.ejs', { campgrounds });
});

app.post('/campgrounds', (req, res) => {
  const { name } = req.query;
  const { image } = req.query;
  campgrounds.push({
    name,
    image,
  });
  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
  res.render('newCampground.ejs');
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
