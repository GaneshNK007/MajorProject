const express= require('express');
const app = express();
const mongoose= require('mongoose');
const Listing= require('./models/listing'); // Import the Listing model
const path= require('path');
const ejs = require('ejs');
const methodOverride = require('method-override');
const ejsMate=require('ejs-mate');
const wrapAsync=require('./utils/wrapAsync.js');
const Expresserror=require('./utils/Expresserror.js');
const { listingSchema , reviewSchema } = require('./schema.js'); // Import the Joi schema
const Review = require('./models/review'); // Import the Review model

const listingRoutes = require('./routers/listing');

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(methodOverride('_method')); // Middleware to support PUT and DELETE methods in forms
app.engine('ejs',ejsMate);


main()
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err)=>{console.log(err);});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}



// Middleware for validating review data
const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
            throw new Expresserror(400,error.details[0].message);
        }
        else{
            next();
        }
}



app.get('/',(req,res)=>{
    res.send("Hello World");
});



// Use the listing routes
app.use("/listings", listingRoutes);




//Review Route
//POST ROUTE
app.post("/listings/:id/reviews", validateReview, wrapAsync( async (req, res) => {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();//important to save the review first by await
    await listing.save();
    // console.log("New Review Added:", newReview);
    // res.send("Review added successfully");
    res.redirect(`/listings/${listingId}`);
}));


//DELETE REVIEW ROUTE
app.delete("/listings/:id/reviews/:reviewId", wrapAsync( async (req, res,next) => {
    const { id: listingId, reviewId } = req.params;
    await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${listingId}`);
}));














//404 route handler
app.use((req, res, next) => {
    next(new Expresserror("Page Not Found", 404));
});



//error handling middleware
app.use((err,req,res,next)=>{
    let{statusCode,message}=err;
    // res.status(statusCode || 500).send(message || "Something went wrong");
    res.render("error.ejs",{statusCode,message});
})

app.listen(8080,(req,res)=>{
    console.log("Server is running on port 8080");
})