const User = require("../models/user.js")

module.exports.renderSignUpForm = (req, res) => {
    res.render("./user/signup.ejs")
}

module.exports.signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username })
        let regUser = await User.register(newUser, password)
        req.login(regUser, (err) => {
            if (err)
                next(err)
            req.flash("success", "welcome to wonderlad!");
            res.redirect("/listings")
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("./user/login.ejs")
}

module.exports.login = async (req, res) => {
    req.flash("success", "welcome back to wonderland")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logOut((err) => {
        if (err) {
            next(err)
        }
        req.flash("success", "you are logged out!")
        res.redirect("/listings")
    });
}