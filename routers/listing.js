const express = require('express');
const router = express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const Expresserror=require('../utils/Expresserror.js');
const { listingSchema } = require('../schema.js'); // Import the Joi schema
const Listing= require('../models/listing'); // Import the Listing model
const { isLoggedIn } = require('../middleware.js');


// Middleware for validating listing data
const validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
            throw new Expresserror(400,error.details[0].message);
        }
        else{
            next();
        }
}



//index route to render the listings page
router.get("/",  wrapAsync(async (req,res)=>{
   const allListings=await  Listing.find({});
   res.render("index.ejs",{allListings});
   
}));

// Create a new listing
router.get("/new", isLoggedIn, (req, res) => {
    res.render("new.ejs");
});


//show route
router.get("/:id",  wrapAsync(async (req,res)=>{
    const listingId=req.params.id;
    const listing=await Listing.findById(listingId).populate('reviews');
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    res.render("show.ejs",{listing});
}));



// Create a new listing
router.post("/",validateListing,isLoggedIn,wrapAsync(async (req, res,next) => {
        const newListing=new Listing(req.body.listing);
        await newListing.save();
        req.flash("success","New listing created!");
        res.redirect("/listings");  
})
);

//Edit route
router.get("/:id/edit",isLoggedIn,  wrapAsync(async (req, res) => {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    res.render("edit.ejs", { listing });
}));

// Update a listing
router.put("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new Expresserror(400,"Invalid Listing Data");
    }
        const listingId = req.params.id;
        await Listing.findByIdAndUpdate(listingId, {...req.body.listing}, { new: true });
        req.flash("success","listing updated!");
        res.redirect(`/listings/${listingId}`);
}));

// Delete a listing
router.delete("/:id",isLoggedIn,wrapAsync(async (req, res) => {
    const listingId = req.params.id;
    let deletedListing= await Listing.findByIdAndDelete(listingId);
    // console.log("Deleted Listing:", deletedListing);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
}));

module.exports = router;