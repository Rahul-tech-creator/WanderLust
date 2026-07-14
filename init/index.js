if(process.env.NODE_ENV != "production"){
    require("dotenv").config({path:"../.env"});
}

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

// let Mongo_url = "mongodb://127.0.0.1:27017/wanderlust"
const dbUrl =process.env.ATLASDB_URL;

main()
.then( () => {
    console.log("Connected to Db");
}).catch((err) => {
    console.log(err);
})


async function main() {
    await mongoose.connect(dbUrl);
}



const initDb = async () => {
    await Listing.deleteMany({});
    const user = await User.findOne({username: "Rahul"});
    initData.data = initData.data.map((obj) =>( {...obj , owner: user._id}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDb();
