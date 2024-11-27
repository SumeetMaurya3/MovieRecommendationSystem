const express = require('express');
const router = express.Router();
const passport = require('passport');
const upload = require('../utils/multerConfig.js');
const {
    getMrsLogin,
    getAdminLogin,
    getMrsSignup,
    logout,
    postMrsSignup,
    postMrsLogin
} = require('../controllers/user.controllers.js'); // Importing controller functions

// Routes
router.get('/mrslogin', getMrsLogin);
router.get('/adminlogin', getAdminLogin);
router.get('/mrssignup', getMrsSignup);
router.get('/logout', logout);
router.post('/mrssignup', upload.single('image'), postMrsSignup);
router.post('/mrslogin', postMrsLogin);

module.exports = router;
