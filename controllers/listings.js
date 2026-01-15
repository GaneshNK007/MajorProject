const Listing=require("../models/listing");


module.exports.index=async (req,res)=>{
   const allListings=await  Listing.find({});
   res.render("index.ejs",{allListings});
   
};

module.exports.renderNewForm=(req,res)=>{
    res.render("new.ejs");
};


module.exports.showListing=async (req,res)=>{
    const listingId=req.params.id;
    const listing=await Listing.findById(listingId).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }

    res.render("show.ejs",{listing});
};

module.exports.createListing=async (req, res,next) => {
        let url = req.file.path;
        let filename = req.file.filename;
        // console.log(url, filename);
        const newListing=new Listing(req.body.listing);
        newListing.owner=req.user._id;
        newListing.image={url,filename};
        await newListing.save();
        req.flash("success","New listing created!");
        res.redirect("/listings");  
};


module.exports.renderEditForm=async (req, res) => {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    res.render("edit.ejs", { listing });
};


module.exports.updateListing=async (req, res) => {
    if(!req.body.listing){
        throw new Expresserror(400,"Invalid Listing Data");
    }
        const listingId = req.params.id;
        await Listing.findByIdAndUpdate(listingId, {...req.body.listing}, { new: true });
        req.flash("success","listing updated!");
        res.redirect(`/listings/${listingId}`);
};


module.exports.deleteListing=async (req, res) => {
    const listingId = req.params.id;
    let deletedListing= await Listing.findByIdAndDelete(listingId);
    // console.log("Deleted Listing:", deletedListing);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
};