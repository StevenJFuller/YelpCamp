const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
  {
    name: "Cloud's Rest",
    image: 'https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore, quod atque?',
  },
  {
    name: 'Desert Mesa',
    image: 'https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore, quod atque?',
  },
  {
    name: 'Canyon Floor',
    image: 'https://farm4.staticflickr.com/3492/3823130660_0509aa841f.jpg',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore, quod atque?',
  },
];

const seedDB = () => {
  // Remove campgrounds
  Campground.remove({})
    .then(() => {
      console.log('Removed campgrounds.');
      data.map(seed => {
        Campground.create(seed)
          .then(campground => {
            console.log('Campground created.');
            Comment.create({
              text: 'This place is great, but I wish there was internet.',
              author: 'Homer',
            })
              .then(comment => {
                campground.comments.push(comment);
                campground.save();
                console.log('Created new comment.');
              })
              .catch(err => console.error(err));
          })
          .catch(err => console.error(err));
      });
    })
    .catch(err => console.error(err));
};

module.exports = seedDB;
