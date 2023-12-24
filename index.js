if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
const express = require("express"),
    app = express(),
    port = 2901


const methodOverride = require('method-override')
app.use(methodOverride('_method'))

const mongoose = require("mongoose")
const mongoose_url = process.env.ATLAS_DB
const listingsRoute = require("./routes/listings.js")
const reviewsRoute = require("./routes/reviews.js")
const userRoute = require("./routes/user.js")
const flash = require("connect-flash")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const expressError = require("./utilities/expressError.js")
ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

const path = require("path");
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

connectDb = async () => {
    await mongoose.connect(mongoose_url)
        .then(res => {
            console.log("connected to Db")
        })
        .catch(err => {
            console.log(err)
        })
}
connectDb()

const store = MongoStore.create({
    mongoUrl: mongoose_url,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 7 * 24 * 3600
})

store.on("err", () => {
    console.log("error in mongoDb session store", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.get("/", (req, res) => {
    res.redirect("/listings")
})

app.use("/listings", listingsRoute)

app.use("/listings/:id/review", reviewsRoute)

app.use("/", userRoute)

app.all("*", (req, res, next) => {
    throw new expressError(404, "page not found")
})

app.use((err, req, res, next) => {
    let { status = 500, message = "somthing went wornge" } = err
    res.status(status).render("Error.ejs", { message, err })
})

app.listen(port, () => {
    console.log(port);
})