const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use("/uploads",express.static("uploads"))
dotenv.config({ path: "./config.env" });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

require("./db/connection");
app.use(require("./routes/auth"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Started at Port No: ${PORT}`);
});  
