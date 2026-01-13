const express = require('express');
const router = express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const Expresserror=require('../utils/Expresserror.js');
const Listing= require('../models/listing'); // Import the Listing model
const { isLoggedIn, isOwner,validateListing } = require('../middleware.js');



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
    // console.log(listingId);
    const listing=await Listing.findById(listingId).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("show.ejs",{listing});
}));



// Create a new listing
router.post("/",isLoggedIn,validateListing,wrapAsync(async (req, res,next) => {
        const newListing=new Listing(req.body.listing);
        newListing.owner=req.user._id;
        await newListing.save();
        req.flash("success","New listing created!");
        res.redirect("/listings");  
})
);

//Edit route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    res.render("edit.ejs", { listing });
}));

// Update a listing
router.put("/:id",isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new Expresserror(400,"Invalid Listing Data");
    }
        const listingId = req.params.id;
        await Listing.findByIdAndUpdate(listingId, {...req.body.listing}, { new: true });
        req.flash("success","listing updated!");
        res.redirect(`/listings/${listingId}`);
}));

// Delete a listing
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const listingId = req.params.id;
    let deletedListing= await Listing.findByIdAndDelete(listingId);
    // console.log("Deleted Listing:", deletedListing);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
}));

module.exports = router;