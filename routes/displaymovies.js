const express = require('express');
const router = express.Router();
const upload = require('../utils/multerConfig'); // Multer config moved to utils
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
router.get('/addmovie', getAddMoviePage);
router.post('/', upload.single('image'), addMovie);
router.get('/show', getMovies);
router.post('/viewmovie', viewMovie);
router.post('/search', searchMovies);
router.post('/searchtags', searchTags);
router.post('/show', getMovies);
router.get('/choose', getChoosePage);

module.exports = router;
