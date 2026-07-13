const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveUrl } = require("../middlewares.js");
const userController = require("../controllers/user.js");
const { route } = require("./listing.js");

router
    .route("/signup")
    .get( userController.renderSignUpForm)
    .post( wrapAsync(userController.signUp));

router
    .route("/login") 
    .get(userController.renderloginForm)
    .post( saveUrl,
    passport.authenticate("local",{failureRedirect: "/login",failureFlash: true}),
    wrapAsync(userController.login));

router.get("/logout", userController.logout);

module.exports = router;
