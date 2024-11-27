const bcrypt = require('bcrypt');
const userdetail = require('../models/users.js');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const passport = require('passport');
const jwt = require('jsonwebtoken'); // Import JWT library
require('../passport-config'); // Ensure passport configuration is loaded

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDNAME || "",
    api_key: process.env.IMAGEAPIKEY || "",
    api_secret: process.env.IMAGEAPISECRET || ""
});

// Controller for rendering MRS login page
const getMrsLogin = (req, res) => {
    res.render("mrslogin");
};

// Controller for rendering Admin login page
const getAdminLogin = (req, res) => {
    res.render("adminlogin");
};

// Controller for rendering MRS signup page
const getMrsSignup = (req, res) => {
    res.render("mrssignup");
};

// Controller for logging out
const logout = (req, res, next) => {
    req.logout(err => {
        if (err) { return next(err); }
        req.flash('success_msg', "this");
        res.render("choose");
    });
};

// Controller for handling MRS signup
const postMrsSignup = async (req, res) => {
    try {
        // Image upload logic to Cloudinary
        cloudinary.uploader.upload(`tmp/${filenama}`, async (err, result) => {
            const hashpassword = await bcrypt.hash(req.body.password, 10);
            const myData = new userdetail({
                name: req.body.name,
                email: req.body.email,
                image: result.url,
                password: hashpassword,
            });

            let errors = [];
            const { name, email, password, password2 } = req.body;

            // Validate required fields
            if (!name || !email || !password || !password2) {
                errors.push({ msg: 'Please fill all the fields' });
            }

            // Check passwords match
            if (password !== password2) {
                errors.push({ msg: 'Passwords do not match' });
            }

            if (password.length < 6) {
                errors.push({ msg: 'Password must be greater than 6 characters' });
            }

            if (errors.length > 0) {
                res.render("mrssignup", {
                    error: errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                // Check if email is already registered
                userdetail.findOne({ email: email }).then(user => {
                    if (user) {
                        errors.push({ msg: 'Email is already registered' });
                        res.render("mrssignup", {
                            error: errors,
                            name,
                            email,
                            password,
                            password2
                        });
                    } else {
                        myData.save()
                            .then(() => {
                                req.flash('success_msg', 'Signup successful!');
                                res.render("mrslogin");
                            })
                            .catch(() => {
                                res.status(400).send("Error saving user");
                            });
                    }
                });
            }
        });
    } catch (err) {
        res.render('mrssignup');
        console.log(err);
    }
};

// Controller for handling MRS login
const postMrsLogin = (req, res, next) => {
    passport.authenticate('local', { 
        failureRedirect: '/mrslogin',
        failureFlash: true
    }, (err, data, info) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (!data) {
            return res.status(401).json({ message: info.message }); // Handle failed login
        }

        // If login is successful, return the user data and JWT token
        const { user, token } = data;
        res.status(200).json({
            message: 'Login successful',
            user: user,
            token: token, // Send the JWT token to the client
            
        });
        res.redirect('/');
    })(req, res, next);
};

module.exports = {
    getMrsLogin,
    getAdminLogin,
    getMrsSignup,
    logout,
    postMrsSignup,
    postMrsLogin
};
