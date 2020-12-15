const express = require("express");
const router = express.Router();


router.get("/test", (req, res) => {

  //console.log(req.query.dId);

  var toReturn = {
    status: "success",
    data: "HELLO FROM GET"
  }

  res.json(toReturn);

});


router.post("/test", (req, res) => {

  console.log(req.body);

  var toReturn = {
    status: "success",
    data: "HELLO FRON POST"  
  }

  res.json(toReturn);

});





router.get("/device", (req, res) => {
  
});

router.post("/device", (req, res) => {
  
});

router.delete("/device", (req, res) => {
  
});

router.put("/device", (req, res) => {
  
});











module.exports = router;
