const bcrypt = require('bcrypt');
const userdetail = require('../models/users');
const cloudinary = require('cloudinary').v2;
const path = require('path');
require('../passport-config'); // Ensure passport configuration is loaded

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDNAME || "",
    api_key: process.env.IMAGEAPIKEY || "",
    api_secret: process.env.IMAGEAPISECRET || ""
});

let filenama = "23"; // To store the uploaded filename

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
        // Upload the image to Cloudinary
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

            // Check required fields
            if (!name || !email || !password || !password2) {
                errors.push({ msg: 'Please fill all the fields' });
            }
            // Check passwords match
            if (password != password2) {
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
                // Validation passed
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
                                req.flash('success_msg', 'This is a success messgg');
                                res.render("mrslogin", { error: errors });
                            })
                            .catch(() => {
                                res.status(400).send("Unfortunately user was not saved");
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
        successRedirect: '/',
        failureRedirect: '/mrslogin',
        failureFlash: true
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
