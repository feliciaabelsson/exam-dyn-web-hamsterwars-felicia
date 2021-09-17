const express = require("express");
const app = express();

//If heroku gives us a PORT the the environmental variable will run, if not run port 1337
//environmental variables is good for sercrets
//Heroku skapar en env. variabel som heter PORT
const PORT = process.env.PORT || 1337;

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  console.log("Web root");
  res.send("The server is deployed");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});
