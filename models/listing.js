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
         url: String,
         filename: String
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
    ],

    owner: {
         type: Schema.Types.ObjectId,
         ref: 'User'
     //     required: true
    },
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