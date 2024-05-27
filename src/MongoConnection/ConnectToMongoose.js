const mongoose = require("mongoose");


const connectToMongoose =  async ()=>{
    try {
      await  mongoose.connect(process.env.MONGODB_URL);
      console.log("Connected to mongoDb successfully")
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToMongoose;