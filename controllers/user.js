const User = require("../models/user.js");

module.exports.signUp =  async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username, });
        let registerdUser = await User.register(newUser, password);
        req.login(registerdUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

};

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.renderloginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
        req.flash("success", "Welcome back to Wanderlust");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return (next);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");

    })
};