const express = require('express');
const router = express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const Expresserror=require('../utils/Expresserror.js');
const Listing= require('../models/listing'); // Import the Listing model
const { isLoggedIn, isOwner,validateListing } = require('../middleware.js');
const multer  = require('multer');
const {storage}= require('../cloudConfig.js');
const upload = multer({storage});


const listingsController=require('../controllers/listings.js');


router.route("/")
.get(wrapAsync(listingsController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingsController.createListing));

// Create a new listing
router.get("/new", isLoggedIn, listingsController.renderNewForm);



// Show, Update, and Delete routes
router.route("/:id")
.get(wrapAsync(listingsController.showListing))
.put(isLoggedIn, isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingsController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingsController.deleteListing));




//Edit route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingsController.renderEditForm));



module.exports = router;