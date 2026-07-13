const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middlewares.js");
const reviewController = require("../controllers/review.js");


// Post Review Route
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));


// Delete Review Route
router.delete("/:reviewId", isLoggedIn , isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;