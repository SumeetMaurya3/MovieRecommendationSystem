const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 42069;
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // This is of no use it is depricated
const ejs = require("ejs");
const { kStringMaxLength } = require("buffer");
const cors = require("cors");
const bcrypt = require("bcrypt");
const initializepassport = require("./passport-config")
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
var fs = require("fs");
require("dotenv/config");
const fileUpload = require('express-fileupload')


require('./passport-config')(passport)

// setting up multer starts
var multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },

  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });
// setting up mutler ends

main().catch((err) => console.log(err));

const staticpath = path.join(__dirname, "public");
console.log(path.join(__dirname, "public"));

// connect flash
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
// passport middleware
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(express.static(staticpath));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.set("view engine", "ejs");
app.use('/', require('./routes/users'))
app.use('/', require('./routes/displaymovies'))
app.use(fileUpload({
  useTempFiles:true,
  tempFileDir: path.join(__dirname, "./tmp"),
}))
// In older versions of express, we had to use:

// app.use(express.bodyparser());
// because body-parser was a middleware between node and express. Now we have to use it like:
// app.use(bodyParser.urlencoded({ extended: false })); app.use(bodyParser.json()); since body parser has been depreciated.
// These are used to parse the json object.

// session 

//global variables
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
})

app.listen(port);
async function main() {
  try{
  await mongoose.connect(process.env.MONGOURI, {useNewUrlParser: true});
  console.log("database connected....")
  console.log("Server started at http://localhost:" + port);
  }
  catch(err){
    console.log(err)
  }
  // await mongoose.connect('mongodb+srv://SumeetMaurya:SumeetMaurya@cluster0.u9zel39.mongodb.net/?retryWrites=true&w=majority');
}