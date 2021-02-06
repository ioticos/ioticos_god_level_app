const express = require("express");
const router = express.Router();
const axios = require("axios");
const colors = require("colors");

const auth = {
  auth: {
    username: "admin",
    password: process.env.EMQX_DEFAULT_APPLICATION_SECRET
  }
};

global.saverResource = null;
global.alarmResource = null;

// ****************************************
// ******** EMQX RESOURCES MANAGER ********
// ****************************************

/* This manager corroborates that there are 2 resources,
If there are none, then create them.
If there are one or more than two, issue a warning.
To manually delete the resources and restart node */

/* Este administrador corrobora que existan 2 recursos,
Si no hay ninguno, entonces los crea.
Si hay uno o más de dos, lanza advertencia. 
Para borrar manualmente los recursos y reiniciemos node */

//https://docs.emqx.io/en/broker/v4.1/advanced/http-api.html#response-code

//list resources
async function listResources() {

try {
    const url = "http://localhost:8085/api/v4/resources/";

    const res = await axios.get(url, auth);
  
    const size = res.data.data.length;
  
    if (res.status === 200) {
  
      if (size == 0) {
        console.log("***** Creating emqx webhook resources *****".green);
  
        createResources();
      } else if (size == 2) {
        res.data.data.forEach(resource => {
          if (resource.description == "alarm-webhook") {
            global.alarmResource = resource;
  
            console.log("▼ ▼ ▼ ALARM RESOURCE FOUND ▼ ▼ ▼ ".bgMagenta);
            console.log(global.alarmResource);
            console.log("▲ ▲ ▲ ALARM RESOURCE FOUND ▲ ▲ ▲ ".bgMagenta);
            console.log("\n");
            console.log("\n");
          }
  
          if (resource.description == "saver-webhook") {
            global.saverResource = resource;
  
            console.log("▼ ▼ ▼ SAVER RESOURCE FOUND ▼ ▼ ▼ ".bgMagenta);
            console.log(global.saverResource);
            console.log("▲ ▲ ▲ SAVER RESOURCE FOUND ▲ ▲ ▲ ".bgMagenta);
            console.log("\n");
            console.log("\n");
          }
        });
      } else {
        function printWarning() {
          console.log(
            "DELETE ALL WEBHOOK EMQX RESOURCES AND RESTART NODE - youremqxdomain:8085/#/resources"
              .red
          );
          setTimeout(() => {
            printWarning();
          }, 1000);
        }
  
        printWarning();
      }
    }else{
        console.log("Error in emqx api");
    }
} catch (error) {
    console.log("Error listing emqx resources");
    console.log(error);
}



 
}

//create resources
async function createResources() {

    try {
        const url = "http://localhost:8085/api/v4/resources";

        const data1 = {
            "type": "web_hook",
            "config": {
                url: "http://localhost:3001/api/saver-webhook",
                headers: {
                    token: process.env.EMQX_API_TOKEN
                },
                method: "POST"
            },
            description: "saver-webhook"
        }
    
        const data2 = {
            "type": "web_hook",
            "config": {
                url: "http://localhost:3001/api/alarm-webhook",
                headers: {
                    token: process.env.EMQX_API_TOKEN
                },
                method: "POST"
            },
            description: "alarm-webhook"
        }
    
        const res1 = await axios.post(url, data1, auth);
    
        if (res1.status === 200){
            console.log("Saver resource created!".green);
        }
    
        const res2 = await axios.post(url, data2, auth);
    
        if (res2.status === 200){
            console.log("Alarm resource created!".green);
        }
    
        setTimeout(() => {
            console.log("***** Emqx WH resources created! :) *****".green);
            listResources();
        }, 1000);
    } catch (error) {
        console.log("Error creating resources");
        console.log(error);
    }

   

}


setTimeout(() => {
  listResources();
}, 1000);

module.exports = router;
