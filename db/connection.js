const mongoose = require("mongoose");
const DB = process.env.DATABASE;

mongoose.connect(DB).then( ()=> console.log("Database is sucesfully connected with backend.") ).catch( err => console.log(err))