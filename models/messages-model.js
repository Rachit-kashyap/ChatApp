const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    sender:String,
    reciver:String
});


const Message = mongoose.model("Message",messageSchema);

module.exports = Message;