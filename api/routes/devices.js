const express = require("express");
const router = express.Router();

const { checkAuth } = require('../middlewares/authentication.js')


router.get("/device", checkAuth ,(req, res) => {

  console.log(req.userData); 

  req.userData.userId

  const toSend = {
    status: "success",
    data: "[2 , 3 , 4 , 5 ]"
  };

  return res.status(200).json(toSend);

});

router.post("/device", (req, res) => {
  
});

router.delete("/device", (req, res) => {
  
});

router.put("/device", (req, res) => {
  
});











module.exports = router;
