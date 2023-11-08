const mongoose = require('mongoose')


const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connected to mongoDB");
  } catch (error) {
    console.log('error conecting to mongo');
  }
}

module.exports = connectDB