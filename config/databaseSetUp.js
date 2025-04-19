const mongoose = require('mongoose');

let dbconnection =  mongoose.connect(process.env.DBURL)
.then(() => console.log('DB connected'))
.catch((err) => console.error('DB connection error:', err));


module.exports = dbconnection;