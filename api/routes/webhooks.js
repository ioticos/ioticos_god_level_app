const express = require('express');
const router = express.Router();
const axios = require('axios');
const colors = require('colors');



router.post('/saver-webhook', async (req, res) => {

    const data = req.body;
    console.log(data);

    res.json("{}");

});


module.exports = router;