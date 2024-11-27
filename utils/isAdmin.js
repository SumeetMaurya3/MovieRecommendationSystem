
module.exports = function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next(); // User is authenticated and has the 'admin' role
    } else {
      return res.status(403).send('Access denied'); // or redirect to a different page
    }
  };
  