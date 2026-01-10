const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');


router.get('/register', (req, res) => {
    res.render("./users/signup.ejs");
});

router.post('/register', wrapAsync(async (req, res, next) => {
    try{
        let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash('success', 'Welcome to the Wanderlust!');
    res.redirect('/listings');
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));


router.get('/login', (req, res) => {
    res.render("./users/login.ejs");
});


router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}),
 async(req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/listings';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});


    
     

module.exports = router;