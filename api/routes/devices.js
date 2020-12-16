const express = require("express");
const router = express.Router();

const { checkAuth } = require('../middlewares/authentication.js')


/*
 ___  ______________ _____ _      _____ 
|  \/  |  _  |  _  \  ___| |    /  ___|
| .  . | | | | | | | |__ | |    \ `--. 
| |\/| | | | | | | |  __|| |     `--. \
| |  | \ \_/ / |/ /| |___| |____/\__/ /
\_|  |_/\___/|___/ \____/\_____/\____/  
*/
import Device from '../models/device.js';



/* 
  ___  ______ _____ 
 / _ \ | ___ \_   _|
/ /_\ \| |_/ / | |  
|  _  ||  __/  | |  
| | | || |    _| |_ 
\_| |_/\_|    \___/ 
*/

router.get("/device", checkAuth ,(req, res) => {

 

});


/* 
{
   "newDevice":{
      "dId":"121212",
      "name":"HOME",
      "templateName":"esp32 template",
      "templateId":"ababab"
   }
}
*/

router.post("/device", checkAuth , async (req, res) => {

  try {
    const userId = req.userData._id;
    var newDevice = req.body.newDevice;
  
    newDevice.userId = userId;
    newDevice.createdTime = Date.now();
  
    const device = await Device.create(newDevice);
  
    const toSend = {
      status: "success"
    }
  
    return res.json(toSend);

  } catch (error) {
    console.log("ERROR CREATING NEW DEVICE");
    console.log(error);

    const toSend = {
      status: "error",
      error: error
    }
  
    return res.status(500).json(toSend);

  }


  
});

router.delete("/device", (req, res) => {
  
});

router.put("/device", (req, res) => {
  
});


/* 
______ _   _ _   _ _____ _____ _____ _____ _   _  _____ 
|  ___| | | | \ | /  __ \_   _|_   _|  _  | \ | |/  ___|
| |_  | | | |  \| | /  \/ | |   | | | | | |  \| |\ `--. 
|  _| | | | | . ` | |     | |   | | | | | | . ` | `--. \
| |   | |_| | |\  | \__/\ | |  _| |_\ \_/ / |\  |/\__/ /
\_|    \___/\_| \_/\____/ \_/  \___/ \___/\_| \_/\____/  
*/




module.exports = router;
