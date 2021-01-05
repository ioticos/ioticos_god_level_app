const express = require("express");
const router = express.Router();
const axios = require("axios");
const colors = require("colors");
var mqtt = require('mqtt');


import Data from "../models/data.js";
import Device from "../models/device.js";
import Notification from "../models/notifications.js";
import AlarmRule from "../models/emqx_alarm_rule.js";

var client;


//SAVER WEBHOOK
router.post("/saver-webhook", async (req, res) => {

    try {
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
        
        
    } catch (error) {
        console.log(error);
        res.sendStatus(200);
    }

});


router.post("/alarm-webhook", async (req, res) => {

    try {
        
        if (req.headers.token != "121212") {
            req.sendStatus(404);
            return;
          }

          res.sendStatus(200);

        
          const incomingAlarm = req.body;

          updateAlarmCounter(incomingAlarm.emqxRuleId);
          
          const lastNotif = await Notification.find({ dId: incomingAlarm.dId, emqxRuleId: incomingAlarm.emqxRuleId }).sort({ time: -1 }).limit(1);

          if (lastNotif == 0){

            console.log("FIRST TIME ALARM");
            saveNotifToMongo(incomingAlarm);
            sendMqttNotif(incomingAlarm);
            

          }else{

            const lastNotifToNowMins = ( Date.now() - lastNotif[0].time ) / 1000 / 60;

            if (lastNotifToNowMins > incomingAlarm.triggerTime){
                console.log("TRIGGERED");
                saveNotifToMongo(incomingAlarm);
                sendMqttNotif(incomingAlarm);
            }

          }     
          
          
        
    } catch (error) {
        console.log(error);
        res.sendStatus(200);
    }

});


function startMqttClient(){

    const options = {
        port: 1883,
        host: 'localhost',
        clientId: 'webhook_superuser' + Math.round(Math.random() * (0 - 10000) * -1),
        username: 'superuser',
        password: 'superuser',
        keepalive: 60,
        reconnectPeriod: 5000,
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        clean: true,
        encoding: 'utf8'
    }

    client = mqtt.connect ('mqtt://' + 'localhost', options);

    client.on('connect', function () {
        console.log("MQTT CONNECTION -> SUCCESS;".green);
        console.log("\n");
    });

    client.on('reconnect', (error) => {
        console.log('RECONNECTING MQTT');
        console.log(error)
    });

    client.on('error', (error) => {
        console.log("MQTT CONNECIONT FAIL -> ");
        console.log(error)
    });


}


function sendMqttNotif(notif){
    const topic = notif.userId + '/dummy-did/dummy-var/notif';
    const msg = 'The rule: when the ' + notif.variableFullName + ' is ' + notif.condition + ' than ' + notif.value;
    client.publish(topic, msg);
}


function saveNotifToMongo(incomingAlarm) {

    try {
        var newNotif = incomingAlarm;
        newNotif.time = Date.now();
        newNotif.readed = false;
        Notification.create(newNotif); 
    } catch (error) {
        console.log(error)
    }

}

async function updateAlarmCounter(emqxRuleId) {
  
    try {
       await AlarmRule.update({ emqxRuleId: emqxRuleId }, { $inc: { counter: 1 } });
    } catch (error) {
        console.log(error)
    }
}

setTimeout(() => {
    startMqttClient();
}, 3000);


module.exports = router;
