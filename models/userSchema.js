const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  appliedfor: {
    type: String,
    required: true
  },
  resume: {
    type: String,
    required: true
  },
  resumePath: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("candidatesapplied", userSchema);
module.exports = User;
