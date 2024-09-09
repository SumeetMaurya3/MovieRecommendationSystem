const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
    name: String,
    date: String,
    rating: String,
    description: String,
    tags: {type: [String],required: true},
    image: String,
    link: String,
  });
  const Movie = mongoose.model("Movie", MovieSchema);

  module.exports = Movie