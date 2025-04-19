const mongoose = require('mongoose');

mongoose.connect(process.env.DBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('DB connected'))
.catch((err) => console.error('DB connection error:', err));


module.exports = dbconnection;