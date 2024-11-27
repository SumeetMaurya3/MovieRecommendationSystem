const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const userdetail = require('./../models/users')
const passport = require('passport')
const cloudinary = require('cloudinary').v2
const path = require('path')
const multer = require('multer')
var filenama = "23"
var imageurl = ''
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
    cloud_name: process.eventNames.CLOUDNAME || "",
    api_key: process.env.IMAGEAPIKEY || "",
    api_secret: process.env.IMAGEAPISECRET || ""
  });



require('./../passport-config')
router.get('/mrslogin', (req, res)=>{
    res.render("mrslogin")
})
router.get('/adminlogin', (req, res)=>{
    res.render("adminlogin")
})

router.get('/mrssignup', (req, res)=>{
    res.render("mrssignup")
})
router.get('/logout', (req, res, next)=>{
    req.logout( err => {
        if(err) { return next(err) }
        req.flash('success_msg', "this")
        // res.redirect()
        res.render("choose")
    });
})
 router.post("/mrssignup",upload.single('image'),  (req, res) => {
     try{
     cloudinary.uploader.upload(`tmp/${filenama}`,async (err,result)=>{      
        // imageurl = result.url
        const hashpassword = await bcrypt.hash(req.body.password, 10);
        const myData = new userdetail({
                name: req.body.name,
                email: req.body.email,
                image: result.url,
                password: hashpassword,
            });
            // myData
            // .save()
            // .then(() => {
            //     console.log("done")
            //   try{
            //   // errors.push({msg: 'User registered, You can now login'});
            //   req.flash('success_msg', 'This is a succy messgg');
            //   }
            //   catch(er){
            //       console.log(er)
            //   }
            // })
            var errors=[]
            const {name, email, password, password2} = (req.body)
            // check required fields
            if(!name || !email || !password || !password2 ){
                errors.push({msg: 'Please fill all the fields'})
            }
            // Check passwords match
            if(password != password2){
            errors.push({msg: 'password donot match'})
            }
            if(password.length <6){
                errors.push({msg:'password must be greater than 6 char'})
            }
            const error = Object.values(errors);
            if(errors.length > 0){
                // var errors = res.json(errors)
                // res.send(error)
                // res.render('mrssignup', {errors})
                res.render("mrssignup", {
                    error,
                    name,
                    email,
                    password,
                    password2
                })
            }
            else{
                // Validation passed 
                userdetail.findOne({email: email})
                .then(user=>{
                    if(user){
                        errors.push({msg: 'Email is already registered'});
                        const error = Object.values(errors);
                            res.render("mrssignup", {
                                error,
                                name,
                                email,
                                password,
                                password2
                            })
                        }
                        else{
            
                            myData
                              .save()
                              .then(() => {
                                try{
                                // errors.push({msg: 'User registered, You can now login'});
                                const error = Object.values(errors);
                                req.flash('success_msg', 'This is a succy messgg');
                                res.render("mrslogin", {error})
                                }
                                catch(er){
                                    console.log(er)
                                }
                              })
                              .catch(() => {
                                res.status(400).send("Unfortunately user was not saved");
                              });
                        } 
                    })
            }
    })
}
catch(err){
    res.render('mrssignup')
    console.log(err)
}
   });

router.post('/mrslogin', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/mrslogin',
        failureFlash: true
    })(req, res, next)
  })
module.exports = router