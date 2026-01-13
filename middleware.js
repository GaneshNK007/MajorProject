const Listing=require("./models/listing");
const { listingSchema,reviewSchema } = require('./schema.js'); // Import the Joi schema
const Expresserror=require('./utils/Expresserror.js');
const passport=require('passport');
const Review=require("./models/review");
const user = require("./models/user");



module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash("error","You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.redirectIfLoggedIn=(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo=req.session.returnTo;
    }
    next();
};

module.exports.isOwner=async (req,res,next)=>{
    const listingId=req.params.id;
     let listing =await Listing.findById(listingId);
        // Check if the logged-in user is the owner of the listing-Authorization
        if(!listing.owner.equals(req.user._id)){
            req.flash("error","You don't have permission to edit this listing");
            return res.redirect(`/listings/${listingId}`);
        }
    next();
};

// Middleware for validating listing data
module.exports.validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
            throw new Expresserror(400,error.details[0].message);
        }
        else{
            next();
        }
};

// Middleware for validating review data
module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
            throw new Expresserror(400,error.details[0].message);
        }
        else{
            next();
        }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;   // id = listingId

    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    // Authorization check
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
