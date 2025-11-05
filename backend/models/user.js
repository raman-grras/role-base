const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true,
        unique: true
    },
    mobileNo:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum: ["admin", "manager", "user"],
        default: "user"
    }
    
},{timestamps:true})

module.exports = mongoose.model("Users", userSchema )