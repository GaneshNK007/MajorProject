const mongoose = require('mongoose');
const initData= require('./data.js');//importing data
const Listing = require('../models/listing.js'); // Import the Listing model

main()
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err)=>{console.log(err);});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
    try {
        // Clear existing listings
        await Listing.deleteMany({});
        initData.data=initData.data.map((obj)=> ({
            ...obj,
            owner: new mongoose.Types.ObjectId("6961ef34e3e2f48a7256661d"), // Assign a new ObjectId as owner
        }));

        // Insert initial data
        await Listing.insertMany(initData.data);
        console.log("Database initialized with sample data.");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};

initDB();