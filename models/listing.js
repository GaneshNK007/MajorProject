const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require('./review');

const listingSchema=new Schema({
    title:  { 
          type: String,
          
         },
    description: 
    {
         type: String,
         
    },
    image: {
         type: String,
         fileName: String, // this is to ensure that the image is a valid file name
         url: String, // this is to ensure that the image is a valid URL
         default: "https://unsplash.com/photos/nighttime-road-with-stars-shining-above-GRgfv49Nf-M", //default image link
         set: (v) => v === "" ? "https://unsplash.com/photos/nighttime-road-with-stars-shining-above-GRgfv49Nf-M" : v, //if image is not provided, set a default link
         // this is a setter function that sets a default link if no image is provided
    },
    price: {
         type: Number,
         
    },
    location: {
         type: String,
         
    },
    country: {
         type: String,
         
    },

    reviews:[
     {
          type:Schema.Types.ObjectId,
          ref:"Review",
     }
    ]
});


listingSchema.post('findOneAndDelete', async (listing)=>{
    if(listing){
        await mongoose.model('Review').deleteMany({
               _id:{ $in: listing.reviews }
        })
    }
});


const Listing=mongoose.model('Listing',listingSchema);//creation of model
module.exports=Listing;//exporting the model
// so that it can be used in other files