const mongoose = require("mongoose");
let dbconnection = async () => {
    await mongoose.connect(`${process.env.DBURl}`).then(()=>{
        console.log("db connect")
    }).catch((err)=>{
        console.log("error occur in db connection ", err)
    })
}
module.exports = dbconnection;