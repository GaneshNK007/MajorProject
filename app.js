const express= require('express');
const app = express();
const mongoose= require('mongoose');
const Listing= require('./models/listing'); // Import the Listing model
const path= require('path');
const ejs = require('ejs');
const methodOverride = require('method-override');
const ejsMate=require('ejs-mate');

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

app.get('/',(req,res)=>{
    res.send("Hello World");
});

//index route to render the listings page
app.get("/listings", async (req,res)=>{
   const allListings=await  Listing.find({});
   res.render("index.ejs",{allListings});
   
});

// Create a new listing
app.get("/listings/new", (req, res) => {
    res.render("new.ejs");
});


//show route
app.get("/listings/:id", async (req,res)=>{
    const listingId=req.params.id;
    const listing=await Listing.findById(listingId);
    if(!listing){
        return res.status(404).send("Listing not found");
    }
    res.render("show.ejs",{listing});
});

app.post("/listings", async (req, res) => {
    // let{ title, description, price, location, country } = req.body;
    const newListing=new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
});

//Edit route
app.get("/listings/:id/edit", async (req, res) => {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("edit.ejs", { listing });
});

// Update a listing
app.put("/listings/:id", async (req, res) => {
        const listingId = req.params.id;
        await Listing.findByIdAndUpdate(listingId, {...req.body.listing}, { new: true });
        res.redirect(`/listings/${listingId}`);
});

// Delete a listing
app.delete("/listings/:id", async (req, res) => {
    const listingId = req.params.id;
    let deletedListing= await Listing.findByIdAndDelete(listingId);
    console.log("Deleted Listing:", deletedListing);
    res.redirect("/listings");
});




// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title: "My area",
//         description: "Beside Big Mountains",
//         price: 100,
//         location: "jammu and kashmir",
//         country: "India"
//     });

//    await sampleListing.save();
//     // .then((result)=>{
//     //     res.send(result);
//     // })
//     // .catch((err)=>{
//     //     res.send(err);
//     // });
//     console.log("sample was saved")
//     res.send("Listing created successfully");


// });

app.listen(8080,(req,res)=>{
    console.log("Server is running on port 8080");
})