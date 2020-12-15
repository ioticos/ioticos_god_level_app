const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//models import
import User from "../models/user.js";

//POST -> req.body
//GET -> req.query

//AUTH
router.post("/register", async (req, res) => {
  try {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const encryptedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      name: name,
      email: email,
      password: encryptedPassword
    };

    var user = await User.create(newUser);

    console.log(user);

    const toSend = {
      status: "success"
    };

    res.status(200).json(toSend);

  } catch (error) {
      
      console.log("ERROR - REGISTER ENDPOINT")
      console.log(error);

      const toSend = {
        status: "error",
        error: error
      };

      res.status(500).json(toSend);

  }
});

router.post("/login", (req, res) => {});

router.get("/new-user", async (req, res) => {
  try {
    const user = await User.create({
      name: "Benjamin",
      email: "a@b.com",
      password: "121212"
    });
    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "fail" });
  }
});

module.exports = router;
