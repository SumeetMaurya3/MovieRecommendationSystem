const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import JWT library
const User = require('./models/users'); // Import the User model

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: 'That email is not registered' });
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              // Generate JWT Token
              const payload = { id: user.id, email: user.email }; // Customize payload as needed
              const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1h', // Token validity (1 hour)
              });

              // Return user and token
              return done(null, { user, token });
            } else {
              return done(null, false, { message: 'Password incorrect' });
            }
          });
        })
        .catch((err) => {
          return done(err);
        });
    })
  );

  // Serialize user
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
