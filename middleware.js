const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "you must be logged in first")
        return res.redirect("/login");
    }
    next()
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!res.locals.currUser._id.equals(listing.owner._id)) {
        req.flash("error", "you are not the owner of this listing")
        return res.redirect(`/listings/${id}/show`)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { r_id, id } = req.params;
    let review = await Review.findById(r_id);
    if (!res.locals.currUser._id.equals(review.author._id)) {
        req.flash("error", "you are not the author of this review")
        return res.redirect(`/listings/${id}/show`)
    }
    next()
}