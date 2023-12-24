const express = require("express")
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../utilities/wrapAsync.js")
const { isLoggedIn, isReviewAuthor } = require("../middleware.js")

const reviewController = require("../controllers/reviews.js")

//create review
router.post("/", isLoggedIn, wrapAsync(reviewController.createReview))

//delete review
router.get("/:r_id/delete", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview))

module.exports = router