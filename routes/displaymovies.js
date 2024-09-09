const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const Movie = require('./../models/moviedetail');
const { model } = require('mongoose');
const cloudinary = require('cloudinary').v2
const path = require('path')
const multer = require('multer')
var filenama = "23"
var imageurl = ''
var arrayoftags = ["Action", "Adventure", "Biographical", "Comedy", "Crime", "Drama", "Family", "Horror", "Romance", "Satire", "Science Fiction", "Super Hero", "Thriller", "War"]
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'tmp')
    }, 
    filename: (req, file, cb)=>{
        // console.log(file)
        filenama = Date.now() + path.extname(file.originalname)
        cb(null, filenama)
    }
})
const upload = multer({storage: storage})
// Configuration 
cloudinary.config({
  cloud_name: "dfupidk7h",
  api_key: "249623316637434",
  api_secret: "0pBwehWpWGETvVtDsVNdxorW51Y"
});


// sendFile will go here
router.get("/", (req, res) => {
    Movie.find({}, function (err, movies) {
      res.render("index", {
        moviesList: movies,
        user: req.user,
      });
    }).sort({ rating: -1 });
  });
  
  router.get("/addmovie", (req, res) => {
    res.sendFile(path.join(__dirname, "public/addMovies.html"));
  });
  
  router.post("/", upload.single('image'),(req, res) => {
    cloudinary.uploader.upload(`tmp/${filenama}`, (err,result)=>{   
    let tagdata = req.body.tags
    const tagarray = tagdata.split(",");
    // console.log(result)
    var myData = new Movie({
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
    })
  });
  
  router.get("/show", (req, res) => {
    Movie.find({}, function (err, movies) {
        let tagname = req.body.something
      res.render("index2", {
        moviesList: movies,
        user: req.user,
        searchedthing: tagname,
        taglist: arrayoftags
      });
    }).sort({ rating: -1 });
  });
  router.post("/viewmovie", async (req, res) =>{
    let movietrailer = req.body.movie_id
    let moviesomething = req.body.tag_id
    let data = await Movie.find(
      {
        "$or":[
          {"name": {$regex: movietrailer, '$options' : 'i'}},
        ]
      }
    
      ).sort({ rating: -1 });
      console.log(movietrailer)
      console.log(moviesomething)
      let otherdata = await Movie.find(
        {
          "$or":[
            {"tags": {$regex: moviesomething, '$options' : 'i'}},
          ]
        })
      res.render("viewmovie", {
        moviesList: data,
        user: req.user,
        otherlist: otherdata
      });
  })
  router.post("/search", async (req, res) => {
      let thingname = req.body.searchbutton
      let tagname = req.body.something
      let data = await Movie.find(
        {
          "$or":[
            {"tags": {$regex: thingname, '$options' : 'i'}},
            {"name": {$regex: thingname, '$options' : 'i'}}
          ]
        }
        )
        res.render("search", {
          moviesList: data,
          user: req.user,
          searchedthing: tagname,
          searchedtext: thingname,
          taglist: arrayoftags,
        });
  });
  
  router.post("/searchtags", async (req, res) => {
    let tagname = req.body.something
    let data = await Movie.find(
      {
        "$or":[
          {"tags": {$regex: tagname, '$options' : 'i'}},
        ]
      }
      ).sort({ rating: -1 });
      res.render("searchtags", {
        moviesList: data,
        user: req.user,
        searchedthing: tagname,
        taglist: arrayoftags
      });
  });
  
  router.post("/show", (req, res) => {
    Movie.find({}, function (err, movies) {
      res.render("index2", {
        moviesList: movies,
        taglist: arrayoftags
      });
    }).sort({ rating: -1 });
  });
  
  router.get("/choose",(req, res)=>{
    res.render("choose")
  })

module.exports = router