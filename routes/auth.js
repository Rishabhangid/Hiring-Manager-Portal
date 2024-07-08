const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const bcrypt = require('bcrypt');
const jsonweb = require("jsonwebtoken");
const cookieParser = require("cookie-parser");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the directory where files should be uploaded
  },
  filename: (req, file, cb) => {
    // Keep the original filename with a timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");

router.use(cookieParser());

router.get("/home", (req, res) => {
  res.send("Hello from the server!");
});

router.get("/getdata", async (req, res) => {
  try {
    const alldata = await User.find();
    if (!alldata) {
      console.log("!alldata error")
      res.status(400).json({ error: "!alldata error" })
    }

    res.send(alldata);
    console.log("data sent alll")
    // res.status(400).json({error:"data sent alll"})


  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "catch error." })
  }
})

router.post("/loginn", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    console.log("Empty data fields.");
    return res.status(422).json({ error: "Empty data fields." });
  }

  try {
    const check = await Admin.findOne({ email: email });
    if (!check) {
      console.log("Email address not valid.");
      return res.status(422).json({ error: "Email address not valid." });
    }

    console.log("Email exists.");


    const isMatch = await Admin.findOne({ password: check.password });
    if (isMatch) {
      console.log("Logged in");

      const token = await check.generateToken();
      console.log(token);
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: "/",
        sameSite: "strict",
      });

      return res.status(200).json({ message: "Logged in" });
    } else {
      console.log("Can't log in");
      return res.status(422).json({ error: "Invalid credentials" });
    }

  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: "Error in catch." });
  }
});

router.get("/applicants",(req, res) => {
  // res.cookie("fakeapi",token);
  console.log("wlcm to admin page pge");
  res.send(req.rootUser);

});

router.get("/logout",(req, res) => {
  // res.cookie("fakeapi",token);
  console.log("Loggeedd Out");
  res.clearCookie("jwtoken", {path:"/"}); // the path should be same as we set at the time of defining cookie in login route.
  res.status(200).send("User Logout");

});


router.post("/uploadd", upload.single("resume"), async (req, res) => {
  console.log("reachable");
  const { name, email, number, branch, appliedfor } = req.body;
  const file = req.file;

  console.log("reachable2");
  console.log(req.body);
  console.log(req.file);

  if (!name || !email || !number || !branch || !appliedfor || !file) {
    return res.status(400).json({ error: "Empty data fields or no file uploaded." });
  }

  try {
    const user = new User({
      name: name,
      email: email,
      number: number,
      branch: branch,
      appliedfor: appliedfor,
      resume: file.originalname,
      resumePath: file.path, // Store the file path
    });

    const savedUser = await user.save();
    if (!savedUser) {
      console.log("Error in saving data in db");
      return res.status(500).json({ error: "Failed to save user in DB" });
    }

    res.status(200).json({ message: "Data stored in DB" });
    console.log("data stored in database. ");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error in saving data in database" });
  }
});

module.exports = router;
