const mongoose = require("mongoose");
const Schema = mongoose.Schema ; 

const bookingSchema = new Schema({
    checkIn:{
        type:Date,
        required:true,
    },
    checkOut:{
        type:Date,
        required:true,
    },
    guests:{
        type:Number,
        required:true,
    },
   price:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        default:"pending",
        enum:[
            "pending",
            "accepted",
            "rejected",
        ],
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    listing:{
        type:Schema.Types.ObjectId,
        ref:"Listing",
    }
    
})

const Booking = mongoose.model("Booking" , bookingSchema);
module.exports = Booking;