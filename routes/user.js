const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { redirectIfLoggedIn } = require('../middleware.js');

const usersController=require('../controllers/users.js');



router.route('/signup')
.get(usersController.renderSignupForm)
.post(wrapAsync(usersController.signup));




router.route('/login')
.get(usersController.renderLoginForm)
.post(redirectIfLoggedIn, passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}),usersController.login);





// Logout Route
router.get('/logout',usersController.logout);


    
     

module.exports = router;