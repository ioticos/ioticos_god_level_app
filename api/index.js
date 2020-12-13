//requires
const express = require("express");

//instances
const app = express();

//listener
app.listen(3001, () => {
  console.log("API server listening on port 3001");
});

//endpoint test
app.get("/testing", (req, res) => {
  res.send("Hello IoT GL API");
});
