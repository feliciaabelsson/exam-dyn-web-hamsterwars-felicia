const express = require("express");
const router = express.Router();

const database = require("../database.js");
const connect = database.connect;
const db = connect();
const HAMSTERS = "hamsters";

const isHamsterObject = require("../validations/validation");

// GET ENDPOINTS
router.get("/", async (req, res) => {
  // Eftersom det är en asynkron funktion måste vi lägga till await
  let array = await getAllHamsters();
  res.send(array);
});

// Hämtar ett dokument med ett specifikt id
router.get("/:id", async (req, res) => {
  // Funktion som hämtar ett element om det finns
  const maybeHamster = await getOneHamster(req.params.id);
  // om maybeHamster finns
  res.send(maybeHamster);
});

router.get("/random", (req, res) => {
  //   const docRef = db.collection(HAMSTERS).doc(id);
  //   const docSnapshot = await docRef.get();
  // const index = Math.floor(Math.random() * 2);
  // const random = random[index];
  //   let item = await getRandomHamster();
  //   //   const item = items[Math.floor(Math.random() * items.lenght)];
  //   res.send(item);
  res.send("Randomizer for hamsta");
});

// PUT ENDPOINTS
// Uppdaterar ett dokument
router.put("/:id", async (req, res) => {
  const maybeBody = req.body;
  // kontrollera att bodyn är ok - om ok skicka ändringar till databas och returnera en statuskod
  // Body måste innehålla dessa värden
  if (!isHamsterObject(maybeBody)) {
    res.status(400).send("Must send a correct hamster object");
    return;
  }
  // skickar ändringar till databasen
  await updateOneHamster(req.params.id, maybeBody);
  res.sendStatus(200);
});

//POST ENDPOINTS
router.post("/", async (req, res) => {
  const maybeBody = req.body;
  if (!isHamsterObject(maybeBody)) {
    res.status(400).send("Bad request");
    return;
  }

  let addHamster = await addOneHamster(maybeBody);
  res.status(200).send(addHamster);
});

//DELETE ENDPOINTS
router.delete("/:id", (req, res) => {});
// FUNCTIONS

async function getRandomHamster() {
  //Hämtar alla hamstrar
  const hamstersRef = db.collection(HAMSTERS);
  const hamstersSnapshot = await hamstersRef.get();

  // Om det inte finns några hamstrar, skicka tillbaka en tom lista
  if (hamstersSnapshot.empty) {
    return [];
  }

  const array = [];

  // Loopar igenom alla hamstrar och väntar till loopen är klar
  await hamstersSnapshot.forEach(async (docRef) => {
    // Väntar på att data ska hämtas
    const data = await docRef.data();
    // Plockar ut varje id
    data.id = docRef.id;
    // pushar data till arrayen
    array.push(data);
  });
  return array;
}

async function addOneHamster(object) {
  const docRef = await db.collection(HAMSTERS).add(object);
  docRef.set(object);
}

//Get all
// Funktion som hämtar alla hamstrar från databasen
async function getAllHamsters() {
  const hamstersRef = db.collection(HAMSTERS);
  const hamstersSnapshot = await hamstersRef.get();

  // Om det inte finns några hamstrar, skicka tillbaka en tom lista
  if (hamstersSnapshot.empty) {
    return [];
  }

  const array = [];
  // Loopar igenom alla hamstrar och väntar till loopen är klar
  await hamstersSnapshot.forEach(async (docRef) => {
    // Väntar på att data ska hämtas
    const data = await docRef.data();
    // Plockar ut varje id
    data.id = docRef.id;
    // pushar data till arrayen
    array.push(data);
  });
  return array;
}

//Get one
//async eftersom vi kommunicerar med databasen som kommer ta tid
async function getOneHamster(id) {
  const docRef = db.collection(HAMSTERS).doc(id);
  const docSnapshot = await docRef.get();

  // Kollar om jag har ett dokument eller inte
  if (docSnapshot.exists) {
    const hamster = await docSnapshot.data();
    return hamster;
  } else {
    return null;
  }
}

async function updateOneHamster(id, object) {
  const docRef = db.collection(HAMSTERS).doc(id);
  docRef.set(object);
}

module.exports = router;

// WHAT TO ADD - G-nivå
//1. GET - /hamsters/random
//3. DELETE - /hamsters/:id
//4. GET - /hamsters/cutest - array med hamstrar som vunnit flest gånger
//gå igenom alla hamstrar,
//räkna ut enligt räknetabellen
//PUBLIC mapp? Där ska bilderna renderas

// const months = ["jan", "feb", "mar", "april"];
// const random = Math.floor(Math.random() * months.length);
// console.log(random, months[random]);
