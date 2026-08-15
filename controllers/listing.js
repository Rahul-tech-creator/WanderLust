const Listing = require("../models/listing.js");
const ExpressError = require("../utils/expressErrors.js"); 
const Booking = require("../models/booking.js");

module.exports.index = async (req, res) => {
    let search = req.query.search?.trim() ;
    let {category}=  req.query;
    if(req.query.owned !== undefined){
        let allListings = await Listing.find({owner:req.user._id});
        if(allListings.length){
            return res.render("listings/index.ejs" , {allListings});
        }
        else{
            req.flash("error" , "You dont have any listing. Please create one");
            return res.redirect("/listings");
        }
        
    }
    
    if(category) {
        let allListings = await Listing.find({category :category});
        if(allListings.length){
            return  res.render("listings/index.ejs" , {allListings});
        }
        else{
            req.flash("error" , "We dont have any listings with this category. Please try another!");
            return res.redirect("/listings");
        }
       
    }

    if(search){
         let allListings = await Listing.find({
             $or: [
        { location:{
            $regex: search,
            $options: "i",
        } },
        { country: {
            $regex: search,
            $options: "i",
        } },
        { title:{
            $regex: search,
            $options: "i",
        } },
                 ]
         });
         if(allListings.length){
            return  res.render("listings/index.ejs" ,  { allListings });
         }
        else{
            req.flash("error" , "No such listings!");
            return res.redirect("/listings");
        }
         
    }
    let allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate(
            {
                path: "reviews",
                populate: { path: "author" }
            })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Your Listing doesnot exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });


};

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    if(req.file){
        newListing.image = {url: req.file.path , filename : req.file.filename };
    }
    
     await newListing.save();

    req.flash("success", "New Listing Created");
    res.redirect("/listings");

};

module.exports.renderEditFrom = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Your Listing does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250,c_scale");
    res.render("listings/edit.ejs", { listing , originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if( typeof req.file != "undefined" ){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    }
    req.flash("success", " Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted");
    res.redirect("/listings");
};

module.exports.renderNewBooking = async(req , res , next) => {
    let {id} = req.params;
    let listing = await  Listing.findById(id);
    if(listing){
        return res.render("bookings/new.ejs" , {listing});

    }
    else{
        next(new ExpressError(404 , "Listing not found"));
    }
}

module.exports.postNewBooking = async(req , res , next) => {
    
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(listing){

    let {checkIn , checkOut , guests} = req.body.booking;
    let inDate = new Date(checkIn);
    let outDate = new Date(checkOut);
   if(outDate > inDate){
    let nights = (outDate - inDate) / 86400000 ;
        let totalPrice = (listing.price * nights );
        const booking =  await  Booking.insertOne({checkIn:inDate ,checkOut: outDate ,guests:guests, price:totalPrice ,user:req.user._id , listing:listing.id} );
        req.flash("success" , "Booking req sent");
        return res.redirect("/listings");
   }
   else{
        req.flash("error" , "Invalid in and out date please check");
        return res.redirect("/listings/" + id + "/book");
   }
}
else{
     next( new ExpressError(404 , "Listing not found"));
}


}