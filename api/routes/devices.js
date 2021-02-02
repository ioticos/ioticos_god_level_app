const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/authentication.js");
const axios = require("axios");

import Device from "../models/device.js";
import SaverRule from "../models/emqx_saver_rule.js";
import Template from "../models/template.js";
import AlarmRule from "../models/emqx_alarm_rule.js";
import EmqxAuthRule from "../models/emqx_auth.js";



//******************
//**** A P I *******
//****************** 

const auth = {
  auth: {
    username: "admin",
    password: "emqxsecret"
  }
};

//GET DEVICES
router.get("/device", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;

    //get devices
    var devices = await Device.find({ userId: userId });

    //mongoose array to js array
    devices = JSON.parse(JSON.stringify(devices));

    //get saver rules
    const saverRules = await getSaverRules(userId);

    //get templates
    const templates = await getTemplates(userId);

    //get alarm rules
    const alarmRules = await getAlarmRules(userId);

    //saver rules to -> devices
    devices.forEach((device, index) => {
      devices[index].saverRule = saverRules.filter(
        saverRule => saverRule.dId == device.dId
      )[0];
      devices[index].template = templates.filter(
        template => template._id == device.templateId
      )[0];
      devices[index].alarmRules = alarmRules.filter(
        alarmRule => alarmRule.dId == device.dId
      );
    });

    const response = {
      status: "success",
      data: devices
    };

    res.json(response);
  } catch (error) {
    console.log("ERROR GETTING DEVICES");
    console.log(error);

    const response = {
      status: "error",
      error: error
    };

    return res.status(500).json(response);
  }
});

//NEW DEVICE
router.post("/device", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;

    var newDevice = req.body.newDevice;

    newDevice.userId = userId;

    newDevice.createdTime = Date.now();

    newDevice.password = makeid(10);

    await createSaverRule(userId, newDevice.dId, true);

    const device = await Device.create(newDevice);

    await selectDevice(userId, newDevice.dId);

    const response = {
      status: "success"
    };

    return res.json(response);
  } catch (error) {
    console.log("ERROR CREATING NEW DEVICE");
    console.log(error);

    const response = {
      status: "error",
      error: error
    };

    return res.status(500).json(response);
  }
});

//DELETE DEVICE
router.delete("/device", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const dId = req.query.dId;

    //deleting saver rule.
    await deleteSaverRule(dId);

    //deleting all posible alarm rules
    await deleteAllAlarmRules(userId, dId);

    //deleting all posible mqtt device credentials
    await deleteMqttDeviceCredentials(dId);

    //deleting device
    const result = await Device.deleteOne({ userId: userId, dId: dId });

    //devices after deletion
    const devices = await Device.find({ userId: userId });

    if (devices.length >= 1) {
      //any selected?
      var found = false;
      devices.forEach(devices => {
        if (devices.selected == true) {
          found = true;
        }
      });

      //if no selected...
      //we need to selet the first
      if (!found) {
        await Device.updateMany({ userId: userId }, { selected: false });
        await Device.updateOne(
          { userId: userId, dId: devices[0].dId },
          { selected: true }
        );
      }
    }

    const response = {
      status: "success",
      data: result
    };

    return res.json(response);
  } catch (error) {
    console.log("ERROR DELETING DEVICE");
    console.log(error);

    const response = {
      status: "error",
      error: error
    };

    return res.status(500).json(response);
  }
});

//UPDATE DEVICE (SELECTOR)
router.put("/device", checkAuth, async (req, res) => {
  try {
    const dId = req.body.dId;
    const userId = req.userData._id;

    if (await selectDevice(userId, dId)) {
      const response = {
        status: "success"
      };

      return res.json(response);
    } else {
      const response = {
        status: "error"
      };

      return res.json(response);
    }
  } catch (error) {
    console.log(error);
  }
});

//SAVER-RULE STATUS UPDATER
router.put("/saver-rule", checkAuth, async (req, res) => {
  try {
    const rule = req.body.rule;

    console.log(rule);

    await updateSaverRuleStatus(rule.emqxRuleId, rule.status);

    const response = {
      status: "success"
    };

    res.json(response);
  } catch (error) {
    console.log(error);
  }
});



//**********************
//**** FUNCTIONS *******
//********************** 

async function getAlarmRules(userId) {
  try {
    const rules = await AlarmRule.find({ userId: userId });
    return rules;
  } catch (error) {
    return "error";
  }
}

async function selectDevice(userId, dId) {
  try {
    const result = await Device.updateMany(
      { userId: userId },
      { selected: false }
    );

    const result2 = await Device.updateOne(
      { dId: dId, userId: userId },
      { selected: true }
    );

    return true;
  } catch (error) {
    console.log("ERROR IN 'selectDevice' FUNCTION ");
    console.log(error);
    return false;
  }
}

/*
 SAVER RULES FUNCTIONS
*/

//get templates
async function getTemplates(userId) {
  try {
    const templates = await Template.find({ userId: userId });
    return templates;
  } catch (error) {
    return false;
  }
}

//get saver rules
async function getSaverRules(userId) {
  try {
    const rules = await SaverRule.find({ userId: userId });
    return rules;
  } catch (error) {
    return false;
  }
}

//create saver rule
async function createSaverRule(userId, dId, status) {


  try {
    const url = "http://localhost:8085/api/v4/rules";

    const topic = userId + "/" + dId + "/+/sdata";

    const rawsql =
      'SELECT topic, payload FROM "' + topic + '" WHERE payload.save = 1';

    var newRule = {
      rawsql: rawsql,
      actions: [
        {
          name: "data_to_webserver",
          params: {
            $resource: global.saverResource.id,
            payload_tmpl:
              '{"userId":"' +
              userId +
              '","payload":${payload},"topic":"${topic}"}'
          }
        }
      ],
      description: "SAVER-RULE",
      enabled: status
    };

    //save rule in emqx - grabamos la regla en emqx
    const res = await axios.post(url, newRule, auth);


    if (res.status === 200 && res.data.data) {
      await SaverRule.create({
        userId: userId,
        dId: dId,
        emqxRuleId: res.data.data.id,
        status: status
      });

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error creating saver rule");
    console.log(error);
    return false;
  }
}

//update saver rule
async function updateSaverRuleStatus(emqxRuleId, status) {
  try {
    const url = "http://localhost:8085/api/v4/rules/" + emqxRuleId;

    const newRule = {
      enabled: status
    };

    const res = await axios.put(url, newRule, auth);

    if (res.status === 200 && res.data.data) {
      await SaverRule.updateOne({ emqxRuleId: emqxRuleId }, { status: status });
      console.log("Saver Rule Status Updated...".green);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

//delete saver rule
async function deleteSaverRule(dId) {
  try {
    const mongoRule = await SaverRule.findOne({ dId: dId });

    const url = "http://localhost:8085/api/v4/rules/" + mongoRule.emqxRuleId;

    const emqxRule = await axios.delete(url, auth);

    const deleted = await SaverRule.deleteOne({ dId: dId });

    return true;
  } catch (error) {
    console.log("Error deleting saver rule");
    console.log(error);
    return false;
  }
}

//delete ALL alarm Rules...
async function deleteAllAlarmRules(userId, dId) {
  try {
    const rules = await AlarmRule.find({ userId: userId, dId: dId });

    if (rules.length > 0) {
      asyncForEach(rules, async rule => {
        const url = "http://localhost:8085/api/v4/rules/" + rule.emqxRuleId;
        const res = await axios.delete(url, auth);
      });

      await AlarmRule.deleteMany({ userId: userId, dId: dId });
    }

    return true;
  } catch (error) {
    console.log(error);
    return "error";
  }
}

// We can solve this by creating our own asyncForEach() method:
// thanks to Sebastien Chopin - Nuxt Creator :)
// https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

//delete ALL emqx device  auth rules
async function deleteMqttDeviceCredentials(dId) {
  try {
    await EmqxAuthRule.deleteMany({ dId: dId, type: "device" });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function makeid(length) {

  try {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  } catch (error) {
    console.log(error);
  }

}

module.exports = router;

/*
userId/dId/temperature -> 
{
  value: 21,
  save: 1
}
*/
