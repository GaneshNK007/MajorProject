const express=require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync=require('../utils/wrapAsync.js');
const Expresserror=require('../utils/Expresserror.js');
const { reviewSchema } = require('../schema.js'); // Import the Joi schema
const Listing= require('../models/listing'); // Import the Listing model
const Review = require('../models/review'); // Import the Review model
const { isLoggedIn, validateReview, isAuthor } = require('../middleware.js');

const reviewsController=require('../controllers/reviews.js');


//Review Route
//POST ROUTE
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewsController.createReview));



//DELETE REVIEW ROUTE
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewsController.deleteReview));


module.exports=router;


