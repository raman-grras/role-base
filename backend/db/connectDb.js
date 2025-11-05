const mongoose = require("mongoose")



function connectDB(){
    try {
        mongoose.connect('mongodb://127.0.0.1:27017/Task1')
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error)
        res.status(500).json({ error });
        // process.exit(1);
    }
}

module.exports = connectDB