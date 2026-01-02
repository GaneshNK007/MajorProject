const joi=require('joi');

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