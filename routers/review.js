const express=require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync=require('../utils/wrapAsync.js');
const Expresserror=require('../utils/Expresserror.js');
const { reviewSchema } = require('../schema.js'); // Import the Joi schema
const Listing= require('../models/listing'); // Import the Listing model
const Review = require('../models/review'); // Import the Review model
const { isLoggedIn, validateReview, isAuthor } = require('../middleware.js');



//Review Route
//POST ROUTE
router.post("/",isLoggedIn, validateReview, wrapAsync( async (req, res) => {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();//important to save the review first by await
    await listing.save();
    // console.log("New Review Added:", newReview);
    // res.send("Review added successfully");
    req.flash("success","New review added!");
    res.redirect(`/listings/${listingId}`);
}));


//DELETE REVIEW ROUTE
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync( async (req, res,next) => {
    const { id: listingId, reviewId } = req.params;
    await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted!");
    res.redirect(`/listings/${listingId}`);
}));


module.exports=router;


