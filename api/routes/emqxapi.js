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

    console.log(res.data.data);

    console.log(res.data.data.length)


}

setTimeout(() => {
    listResources();
}, 1000);






module.exports = router;