const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");


module.exports.index = async(req , res) =>{
    let bookings = await Booking.find({
        user:req.user._id
    }).populate("listing");
    res.render("bookings/index.ejs" , {bookings});
}

module.exports.requests = async(req , res) => {
    let listings = await Listing.find({owner:req.user._id});
    let listingIds = listings.map((listing) => listing._id);
    let bookings = await Booking.find({
        listing: {$in: listingIds}
    }).populate("listing").populate("user");
    res.render("bookings/requests.ejs" , {bookings});
}

module.exports.accept = async(req , res) => {
    let {id} = req.params;
    let booking = await Booking.findById(id);
    booking.status = "accepted";
    await booking.save();
    res.redirect("/bookings/requests");
}
module.exports.reject = async(req , res) => {
    let {id} = req.params;
    let booking = await Booking.findById(id);
    booking.status = "rejected";
    await booking.save();
    res.redirect("/bookings/requests");
}