const Movie = require('../models/moviedetail');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDNAME || "",
  api_key: process.env.IMAGEAPIKEY || "",
  api_secret: process.env.IMAGEAPISECRET || ""
});

const arrayoftags = [
  "Action", "Adventure", "Biographical", "Comedy", "Crime", "Drama", "Family",
  "Horror", "Romance", "Satire", "Science Fiction", "Super Hero", "Thriller", "War"
];

let filenama = "23"; // Variable to store the filename of the uploaded file

// Controller for Home Page
const getHomePage = (req, res) => {
  Movie.find({}, (err, movies) => {
    res.render("index", {
      moviesList: movies,
      user: req.user,
    });
  }).sort({ rating: -1 });
};

// Controller for Add Movie Page
const getAddMoviePage = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/addMovies.html"));
};

// Controller for Adding a Movie
const addMovie = (req, res) => {
  cloudinary.uploader.upload(`tmp/${filenama}`, (err, result) => {
    let tagdata = req.body.tags;
    const tagarray = tagdata.split(",");

    const myData = new Movie({
      name: req.body.name,
      date: req.body.date,
      rating: req.body.rating,
      description: req.body.description,
      image: result.url,
      tags: tagarray,
      link: req.body.Youtube_Link,
    });

    myData
      .save()
      .then(() => {
        res.send("The movie has been added");
      })
      .catch(() => {
        res.status(400).send("Unfortunately movie was not saved");
      });
  });
};

// Controller for Showing Movies
const getMovies = (req, res) => {
  Movie.find({}, (err, movies) => {
    let tagname = req.body.something;
    res.render("index2", {
      moviesList: movies,
      user: req.user,
      searchedthing: tagname,
      taglist: arrayoftags,
    });
  }).sort({ rating: -1 });
};

// Controller for Viewing a Movie
const viewMovie = async (req, res) => {
  let movietrailer = req.body.movie_id;
  let moviesomething = req.body.tag_id;

  let data = await Movie.find({
    "$or": [
      { "name": { $regex: movietrailer, '$options': 'i' } },
    ]
  }).sort({ rating: -1 });

  let otherdata = await Movie.find({
    "$or": [
      { "tags": { $regex: moviesomething, '$options': 'i' } },
    ]
  });

  res.render("viewmovie", {
    moviesList: data,
    user: req.user,
    otherlist: otherdata,
  });
};

// Controller for Searching Movies
const searchMovies = async (req, res) => {
  let thingname = req.body.searchbutton;
  let tagname = req.body.something;

  let data = await Movie.find({
    "$or": [
      { "tags": { $regex: thingname, '$options': 'i' } },
      { "name": { $regex: thingname, '$options': 'i' } },
    ]
  });

  res.render("search", {
    moviesList: data,
    user: req.user,
    searchedthing: tagname,
    searchedtext: thingname,
    taglist: arrayoftags,
  });
};

// Controller for Searching Tags
const searchTags = async (req, res) => {
  let tagname = req.body.something;

  let data = await Movie.find({
    "$or": [
      { "tags": { $regex: tagname, '$options': 'i' } },
    ]
  }).sort({ rating: -1 });

  res.render("searchtags", {
    moviesList: data,
    user: req.user,
    searchedthing: tagname,
    taglist: arrayoftags,
  });
};

// Controller for "Choose" Page
const getChoosePage = (req, res) => {
  res.render("choose");
};

module.exports = {
  getHomePage,
  getAddMoviePage,
  addMovie,
  getMovies,
  viewMovie,
  searchMovies,
  searchTags,
  getChoosePage,
};
