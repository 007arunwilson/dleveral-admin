var mongoose=require("mongoose")
module.exports = mongoose.model("User", {
    name : String,
    email : String,
    userType : String,
    password : String,
    emailv : String,
    verifytoken : String,
    date : String,
    aboutme : String,
    headline : String,
    location :String,
    timezone : String,
    isEnabled:Boolean
})