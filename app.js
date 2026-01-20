if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

// require('dotenv').config();
// console.log(process.env.SECRET_KEY);

const express= require('express');
const app = express();
const mongoose= require('mongoose');
const path= require('path');
const methodOverride = require('method-override');
const ejsMate=require('ejs-mate');
const Expresserror=require('./utils/Expresserror.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');



const listingRoutes = require('./routes/listing');
const reviewRoutes = require('./routes/review');
const userRoutes=require('./routes/user');



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

const sessionOptions={
    secret:'mySecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly:true
    }
};


// app.get('/',(req,res)=>{
//     res.send("Hello World");
// });



app.use(session(sessionOptions));
app.use(flash());

// Passport.js configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// Use the local strategy for authentication
passport.serializeUser(User.serializeUser());// Serialize user instances to the session
passport.deserializeUser(User.deserializeUser());// End of Passport.js configuration

// Flash middleware to set local variables for flash messages
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    console.log(res.locals.success);
    next();
});


// app.get('/demouser',async (req,res)=>{
//     let fakeUser=new User({username:'demoUser',email:'student@gmail.com'});
//     let user= await User.register(fakeUser,'demopassword');
//     await user.save();
//     res.send(user);
// });



// Use the listing routes
app.use("/listings", listingRoutes);

// Use the review routes
app.use("/listings/:id/reviews", reviewRoutes);

// Use the user routes
app.use("/", userRoutes);

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