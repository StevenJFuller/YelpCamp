const mongoose = require(`mongoose`);

const { Schema } = mongoose;

const campgroundSchema = new Schema({
  name: String,
  image: String,
  description: String,
  author: {
    id: {
      type: Schema.Types.ObjectId,
      ref: `User`,
    },
    username: String,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: `Comment`,
    },
  ],
});

module.exports = mongoose.model(`Campground`, campgroundSchema);
