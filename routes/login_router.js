const router = require('express').Router();
const passport = require('passport');
const links = require('../links');

const getLoginPage = (req, res) => {
  res.render('login-page', { links });
};

const postLoginPage = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log('Invalid email or password'); // Log the failed login
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      if (user.membership_status === 'active') {
        console.log('User is already active');
        return res.redirect('/');
      } else {
        console.log('Login successful for user:', user.email); // Log the successful login
        return res.redirect('/secret-word');
      }
    });
  })(req, res, next);
};

router.get('/login', getLoginPage);
router.post('/login', postLoginPage);

module.exports = {
  getLoginPage,
  postLoginPage
};