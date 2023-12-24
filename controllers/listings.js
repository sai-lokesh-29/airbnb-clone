const Listing = require("../models/listing.js")


function capitalizeWords(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

module.exports.index = async (req, res) => {
    let search = req.query.search;
    if (search)
        var listings = await Listing.find({ country: capitalizeWords(search) });
    else
        var listings = await Listing.find({});
    res.render("./listings/index.ejs", { listings })
}

module.exports.addNewListing = (req, res) => {
    res.render("./listings/new.ejs")
}

module.exports.createNewListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    req.body.owner = req.user._id;
    req.body.country = capitalizeWords(req.body.country)
    req.body.image = { url, filename }
    let newListing = new Listing(req.body)
    await newListing.save();
    req.flash("success", "New Listing is created!");
    res.redirect("/listings")
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "No listings found with that ID.");
        res.redirect('/listings')
    }
    res.render("./listings/show.ejs", { listing })
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "No listings found with that ID.");
        res.redirect('/listings')
    }
    res.render("./listings/edit.ejs", { listing })
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        req.body.image = { url, filename }
    }
    await Listing.findByIdAndUpdate(id, req.body);
    req.flash("success", "Listing is updated!");
    res.redirect(`/listings/${id}/show`)
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is deleated!");
    res.redirect("/listings")
}