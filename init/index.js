const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderland";

mongoose_url = "mongodb://127.0.0.1:27017/wonderland"
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

closeDb = async () => {
  await mongoose.connection.close()
    .catch(err => {
      console.log(err)
    })
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "6586698e3169cb0ea538cb78" }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
  closeDb()
};

initDB();
