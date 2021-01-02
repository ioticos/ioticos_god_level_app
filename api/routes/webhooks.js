const express = require("express");
const router = express.Router();
const axios = require("axios");
const colors = require("colors");

import Data from "../models/data.js";
import Device from "../models/device.js";

router.post("/saver-webhook", async (req, res) => {

  if (req.headers.token != "121212") {
    req.sendStatus(404);
    return;
  }

  const data = req.body;

  const splittedTopic = data.topic.split("/");
  const dId = splittedTopic[1];
  const variable = splittedTopic[2];
    
  var result = await Device.find({dId: dId, userId: data.userId});

  if (result.length == 1){
      Data.create({
        userId: data.userId,
        dId: dId,
        variable: variable,
        value: data.payload.value,
        time: Date.now()
      })
      console.log("Data created");
  }

  res.sendStatus(200);

  console.log(data);


});

module.exports = router;
