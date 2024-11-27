const express = require('express');
const router = express.Router();
const upload = require('../utils/multerConfig.js'); // Multer config moved to utils
const isAdmin = require('../utils/isAdmin.js'); // Import the isAdmin middleware
const {
  getHomePage,
  getAddMoviePage,
  addMovie,
  getMovies,
  viewMovie,
  searchMovies,
  searchTags,
  getChoosePage
} = require('../controllers/displaymovie.controllers.js'); // Importing controller functions

// Routes
router.get('/', getHomePage);
router.get('/addmovie', isAdmin, getAddMoviePage); // middleware to check if user is admin
router.post('/', upload.single('image'), addMovie);
router.get('/show', getMovies);
router.post('/viewmovie', viewMovie);
router.post('/search', searchMovies);
router.post('/searchtags', searchTags);
router.post('/show', getMovies);
router.get('/choose', getChoosePage);

module.exports = router;
