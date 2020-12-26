const express = require('express');
const router = express.Router();
const axios = require('axios');
const colors = require('colors');


const auth = {
    auth: {
        username: 'admin',
        password: 'emqxsecret'
    }
};

global.saverResource = null;
global.alarmResource = null;


// ****************************************
// ******** EMQX RESOURCES MANAGER ********
// ****************************************

async function listResources() {

    const url = "http://localhost:8085/api/v4/resources/";

    const res = await axios.get(url, auth);

    const size = res.data.data.length;

    if (size == 0){
        console.log("***** Creating emqx webhook resources *****".green)
        
        //createResources();
    }else if (size == 2){

        res.data.data.forEach(resource => {

            if(resource.description == "alarm-webhook"){
                global.alarmResource = resource;

                console.log("▼ ▼ ▼ ALARM RESOURCE FOUND ▼ ▼ ▼ ".bgMagenta);
                console.log(global.alarmResource);
                console.log("▲ ▲ ▲ ALARM RESOURCE FOUND ▲ ▲ ▲ ".bgMagenta);
                console.log("\n");
                console.log("\n");
            }

            if(resource.description == "saver-webhook"){
                global.saverResource = resource;

                console.log("▼ ▼ ▼ SAVER RESOURCE FOUND ▼ ▼ ▼ ".bgMagenta);
                console.log(global.saverResource);
                console.log("▲ ▲ ▲ SAVER RESOURCE FOUND ▲ ▲ ▲ ".bgMagenta);
                console.log("\n");
                console.log("\n");
            }

        });
    }else{

        function printWarning() {
            console.log("DELETE ALL WEBHOOK EMQX RESOURCES AND RESTART NODE - youremqxdomain:8085/#/resources".red);
            setTimeout(() => {
                printWarning();
            }, 1000);
        }

        printWarning();
    }



}

setTimeout(() => {
    listResources();
}, 1000);






module.exports = router;