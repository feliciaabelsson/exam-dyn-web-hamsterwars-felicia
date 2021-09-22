// const { urlencoded } = require("express");
const express = require("express");
const app = express();
const hamsterRouter = require("./routes/hamsters");
const cors = require('cors')

// first run environmental variable, if not run port 1337
// environmental variables is good for sercrets
const PORT = process.env.PORT || 1337;

app.use(cors())


// MIDDLEWARES
// middleware för body
// urlencoded = om man vill skicka ett formulär
app.use(express.urlencoded({ extended: true }));
// för att skicka data i json format
app.use(express.json());
// Logger för att kunna se vad för requests som kommer in
app.use((req, res, next) => {
  console.log(` ${req.method}  ${req.url}`, req.body);
  next();
});
// app.use("/web", express.static(__dirname + "/../public"));

// Routes
// talar om att hamstersRouter middleware ska användas för alla routes som börjar med /hamsters
app.use("/hamsters", hamsterRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});
