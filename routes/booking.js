const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing, isBookingOwner } = require("../middlewares.js");
const bookingController = require("../controllers/booking.js");

router.get("/" ,isLoggedIn, wrapAsync(bookingController.index));

router.get("/requests", isLoggedIn , wrapAsync(bookingController.requests))
router.post("/:id/accept", isLoggedIn, isBookingOwner , wrapAsync(bookingController.accept));
router.post("/:id/reject", isLoggedIn, isBookingOwner , wrapAsync(bookingController.reject));

module.exports=router;