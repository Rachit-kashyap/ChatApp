const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        default : "SuperMan"
    },
   phoneNumber:{
    type:Number,
    required:true,

   },
   socketId:{
    type:String,
    
   },
   avatar:{
    type:String,
    default:"https://www.meme-arsenal.com/memes/b6a18f0ffd345b22cd219ef0e73ea5fe.jpg"
   },
   contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    
  ],
   messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    
  ],

 

   isActive:{
    type:Boolean,
    default:false
   }
});


const User = mongoose.model("User",userSchema);

module.exports = User;