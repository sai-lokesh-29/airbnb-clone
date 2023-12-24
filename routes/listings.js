const express = require("express")
const router = express.Router()
const wrapAsync = require("../utilities/wrapAsync.js")
const { isLoggedIn, isOwner } = require("../middleware.js")

const listingController = require("../controllers/listings.js")

// for uploading image
const multer = require('multer')
const { cloudinary, storage } = require("../cloudConfig.js")
const upload = multer({ storage })


// index route
router.get("/", wrapAsync(listingController.index))

// new route
router.get("/new", isLoggedIn, wrapAsync(listingController.addNewListing))

//create route  
router.post("/create", isLoggedIn,
    upload.single('image'),
    wrapAsync(listingController.createNewListing))

// show route
router.get("/:id/show",
    wrapAsync(listingController.showListing))

//edit route
router.get("/:id/edit", isLoggedIn, isOwner,
    wrapAsync(listingController.editListing))

//update route
router.post("/:id/update"/*, validateSchema*/, isLoggedIn, upload.single('image'),
    isOwner, wrapAsync(listingController.updateListing))

//delete route
router.get("/:id/delete", isLoggedIn, isOwner,
    wrapAsync(listingController.deleteListing))

module.exports = router