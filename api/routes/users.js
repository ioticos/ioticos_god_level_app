const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { checkAuth } = require("../middlewares/authentication.js");

//models import
import User from "../models/user.js";
import EmqxAuthRule from "../models/emqx_auth.js";

//POST -> req.body
//GET -> req.query


//******************
//**** A P I *******
//****************** 

//LOGIN
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  var user = await User.findOne({ email: email });

  //if no email
  if (!user) {
    const toSend = {
      status: "error",
      error: "Invalid Credentials"
    };
    return res.status(401).json(toSend);
  }

  //if email and email ok
  if (bcrypt.compareSync(password, user.password)) {
    user.set("password", undefined, { strict: false });

    const token = jwt.sign({ userData: user }, "securePasswordHere", {
      expiresIn: 60 * 60 * 24 * 30
    });

    const toSend = {
      status: "success",
      token: token,
      userData: user
    };

    return res.json(toSend);
  } else {
    const toSend = {
      status: "error",
      error: "Invalid Credentials"
    };
    return res.status(401).json(toSend);
  }
});

//REGISTER
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
    console.log("ERROR - REGISTER ENDPOINT");
    console.log(error);

    const toSend = {
      status: "error",
      error: error
    };

    console.log(toSend);

    return res.status(500).json(toSend);
  }
});

//GET MQTT WEB CREDENTIALS
router.post("/getmqttcredentials", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;

    const credentials = await getWebUserMqttCredentials(userId);

    const toSend = {
      status: "success",
      username: credentials.username,
      password: credentials.password
    };

    res.json(toSend);

    setTimeout(() => {
      getWebUserMqttCredentials(userId);
    }, 5000);

    return;
  } catch (error) {
    console.log(error);

    const toSend = {
      status: "error"
    };

    return res.status(500).json(toSend);
  }
});


//GET MQTT CREDENTIALS FOR RECONNECTION
router.post("/getmqttcredentialsforreconnection", checkAuth, async (req, res) => {

  const userId = req.userData._id;
  const credentials = await getWebUserMqttCredentialsForReconnection(userId);

  const toSend = {
    status: "success",
    username: credentials.username,
    password: credentials.password
  }

  console.log(toSend);
  res.json(toSend);

  setTimeout(() => {
    getWebUserMqttCredentials(userId);
  }, 15000);


});




//**********************
//**** FUNCTIONS *******
//********************** 

// mqtt credential types: "user", "device", "superuser"
async function getWebUserMqttCredentials(userId) {
  try {
    var rule = await EmqxAuthRule.find({ type: "user", userId: userId });

    if (rule.length == 0) {
      const newRule = {
        userId: userId,
        username: makeid(10),
        password: makeid(10),
        publish: [userId + "/#"],
        subscribe: [userId + "/#"],
        type: "user",
        time: Date.now(),
        updatedTime: Date.now()
      };

      const result = await EmqxAuthRule.create(newRule);

      const toReturn = {
        username: result.username,
        password: result.password
      };

      return toReturn;
    }

    const newUserName = makeid(10);
    const newPassword = makeid(10);

    const result = await EmqxAuthRule.updateOne(
      { type: "user", userId: userId },
      {
        $set: {
          username: newUserName,
          password: newPassword,
          updatedTime: Date.now()
        }
      }
    );

    // update response example
    //{ n: 1, nModified: 1, ok: 1 }

    if (result.n == 1 && result.ok == 1) {
      return {
        username: newUserName,
        password: newPassword
      };
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getWebUserMqttCredentialsForReconnection(userId){

  try{
    const rule = await EmqxAuthRule.find({type: "user", userId: userId});

    if (rule.length == 1){
      const toReturn = {
        username: rule[0].username,
        password: rule[0].password
      }
      return toReturn;
    }

  }
  catch(error){
    console.log(error);
    return false;
  }

}



function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = router;
