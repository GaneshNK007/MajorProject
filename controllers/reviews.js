const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview= async (req, res) => {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();//important to save the review first by await
    await listing.save();
    
    req.flash("success","New review added!");
    res.redirect(`/listings/${listingId}`);
};


module.exports.deleteReview=  async (req, res,next) => {
    const { id: listingId, reviewId } = req.params;
    await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted!");
    res.redirect(`/listings/${listingId}`);
};