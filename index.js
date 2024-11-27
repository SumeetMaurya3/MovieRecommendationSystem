// Import required modules and dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cors = require("cors");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const multer = require("multer");
const fileUpload = require("express-fileupload");
require("dotenv/config");
require("./passport-config")(passport); // Passport configuration

// Initialize the app and set the port
const app = express();
const port = process.env.PORT || 42069;

// Database connection function
async function main() {
  try {
    await mongoose.connect(process.env.MONGOURI, { useNewUrlParser: true });
    console.log("Database connected...");
    console.log("Server started at http://localhost:" + port);
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

// Static file path setup
const staticPath = path.join(__dirname, "public");
console.log("Serving static files from:", staticPath);

// Configure session middleware
app.use(
  session({
    secret: "secret", // Use a strong, unique secret in production
    resave: true,
    saveUninitialized: true,
  })
);

// Passport.js middleware for authentication
app.use(passport.initialize());
app.use(passport.session());

// Connect flash middleware for flash messages
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for handling CORS
app.use(cors());

// Set view engine to EJS
app.set("view engine", "ejs");

// Serve static files
app.use(express.static(staticPath));

// File upload setup with express-fileupload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "./tmp"), // Temporary directory for uploaded files
  })
);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Destination folder for uploads
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now()); // Generate unique filename
  },
});
const upload = multer({ storage: storage });

// Route setup
app.use("/", require("./routes/users")); // User-related routes
app.use("/", require("./routes/displaymovies")); // Movie display routes

// Start the server and connect to the database
main();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
