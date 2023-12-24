const Listing = require("../models/listing.js")
const Review = require("../models/review.js")

module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    let listing = await Listing.findById(id);
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    req.flash("success", "New Review is created!");
    res.redirect(`/listings/${id}/show`)
}

module.exports.deleteReview = async (req, res) => {
    let { id, r_id } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: r_id } });
    await Review.findByIdAndDelete(r_id)
    req.flash("success", "Review is deleted!");
    res.redirect(`/listings/${id}/show`)
}