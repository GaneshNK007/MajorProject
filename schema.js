const joi=require('joi');

//server side validation schema using joi

// Define the validation schema for a listing
module.exports.listingSchema=joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        image: joi.string().uri().optional().allow(''),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        country: joi.string().required()
    }).required()
});

// Define the validation schema for a review
module.exports.reviewSchema=joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required()
    }).required()
});