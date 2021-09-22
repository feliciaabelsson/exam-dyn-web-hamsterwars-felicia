const express = require("express");
const router = express.Router();
const database = require("../database.js");
const connect = database.connect;
const db = connect();
const HAMSTERS = "hamsters";

const isHamsterObject = require("../validations/validation");


// GET ENDPOINTS
router.get("/", async (req, res) => {
  let array = await getAllHamsters();
  console.log(array); //skriver ut alla objekt i arrayen korrekt
  res.status(200).send(array);
});

router.get("/:id", async (req, res) => {
  // Funktion som hämtar ett element om det finns
  const maybeHamster = await getOneHamster(req.params.id);

  if (!maybeHamster) {
    res.sendStatus(404);
    return;
  } else {
    console.log("The hamster object from get id" , maybeHamster);
    res.status(200).send(maybeHamster);
  }
});

router.get("/random", async (req, res) => {
  let array = await getRandomHamster()

  let randomHamster =
  array[Math.floor(Math.random() * array.length)]
  res.status(200).send(randomHamster)
});

// PUT ENDPOINTS
// Uppdaterar ett dokument
// router.put("/:id", async (req, res) => {
//   const maybeBody = req.body;
//   // kontrollera att bodyn är ok - om ok skicka ändringar till databas och returnera en statuskod
//   // Body måste innehålla dessa värden
//   if (!isHamsterObject(maybeBody)) {
//     res.status(400).send("Must send a correct hamster object");
//     return;
//   }
//   // skickar ändringar till databasen
//   await updateOneHamster(req.params.id, maybeBody);
//   res.sendStatus(200);
// });


//POST ENDPOINTS
router.post("/", async (req, res) => {
  const maybeBody = req.body;
  //om objektet som skickas in inte stämmer överens med valideringen
  if (!isHamsterObject(maybeBody)) {
    res.status(400).send("Bad request");
    return;
  }
  //korrekt objekt skickas in genom 
  let addHamster = await addOneHamster(maybeBody);
  res.status(200).send(addHamster);
});

//DELETE ENDPOINTS
// router.delete("/:id", (req, res) => {});
// FUNCTIONS

// async function getRandomHamster() {
//   //Hämtar alla hamstrar
//   const hamstersRef = db.collection(HAMSTERS);
//   const hamstersSnapshot = await hamstersRef.get();

//   // Om det inte finns några hamstrar, skicka tillbaka en tom lista
//   if (hamstersSnapshot.empty) {
//     return [];
//   }

//   const array = [];

//   // Loopar igenom alla hamstrar och väntar till loopen är klar
//   await hamstersSnapshot.forEach(async (docRef) => {
//     // Väntar på att data ska hämtas
//     const data = await docRef.data();
//     // Plockar ut varje id
//     data.id = docRef.id;
//     // pushar data till arrayen
//     array.push(data);
//   });
//   return array;
// }

async function addOneHamster(object) {
  const docRef = await db.collection(HAMSTERS).add(object);
  const hamster = { id: docRef.id }
  return hamster
  // docRef.set(object);
}

//GET ALL function
async function getAllHamsters() {
  const docRef = db.collection(HAMSTERS);
  const docSnapshot = await docRef.get();

  // Om det inte finns några hamstrar, skicka tillbaka en tom lista
  if (docSnapshot.empty) {
    return [];
  }
  
  const array = [];
  await docSnapshot.forEach(async docRef => {
    const data = await docRef.data();
    data.id = docRef.id;
    array.push(data);
  });
  return array;
}

//GET ONE function
async function getOneHamster(id) {
  const docRef = db.collection(HAMSTERS).doc(id);
  const docSnapshot = await docRef.get();

  // Kollar om jag har ett dokument eller inte
  if (docSnapshot.exists) {
    const hamster = await docSnapshot.data();
    console.log('The hamster that i requested:', hamster)
    return hamster;
  } else {
    return null;
  }
}

// async function updateOneHamster(id, object) {
//   const docRef = db.collection(HAMSTERS).doc(id);
//   docRef.set(object);
// }






// async function updateOneHamster(id, object) {
//   const docRef = db.collection(HAMSTERS).doc(id);
//   docRef.set(object);
// }

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

//Object.
//value.
//includes
//kolla att valuet är number på objekten som ska ändras
