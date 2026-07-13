const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

let Mongo_url = "mongodb://127.0.0.1:27017/wanderlust"

main()
.then( () => {
    console.log("Connected to Db");
}).catch((err) => {
    console.log(err);
})


async function main() {
    await mongoose.connect(Mongo_url);
}

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>( {...obj , owner:"6a5472023d3e2ae91b4b9991"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDb();
