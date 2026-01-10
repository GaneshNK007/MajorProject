const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose').default;

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    }
});

userSchema.plugin(passportLocalMongoose);//adds username and password fields to the schema

const User=mongoose.model('User',userSchema);//creation of model
module.exports=User;//exporting the model
// so that it can be used in other files