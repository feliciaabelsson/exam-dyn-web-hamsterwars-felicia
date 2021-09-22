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


//POST ENDPOINTS
router.post("/", async (req, res) => {
  const maybeBody = req.body;
  //om objektet som skickas in inte stämmer överens med valideringen
  if (!isHamsterObject(maybeBody)) {
    res.status(400).send("Bad request");
    return;
  }
  //korrekt objekt skickas in genom 
  const addHamster = await addOneHamster(maybeBody);
  res.status(200).send(addHamster);
});


// PUT ENDPOINTS
router.put("/:id", async (req, res) => {
  //den har fångat id och body
  const maybeBody = req.body
  let maybeHamsterId = req.params.id;
  //hämtar snapshot från collection
  // const hamstersSnapshot = db.collection(HAMSTERS).doc(maybeHamster).get()
  //om snapshot (Data finns)


  // if(!)
  //   // await db.collection(HAMSTERS).doc(maybeHamster).set(maybeBody)
  //   // res.sendStatus(200)

  // skicka ändringar till databasen
	await updateOne(req.params.id, maybeBody)
	res.sendStatus(200)

});






//DELETE ENDPOINTS
router.delete("/:id", async (req, res) => {
  const maybeHamster = await deleteOneHamster(req.params.id)
  // res.status(200).send('Deleted')

  if (!maybeHamster) {
    res.sendStatus(404);
    return;
  } else {
    console.log("The hamster is deleted");
    res.sendStatus(200);
  }



  // let index = Number(req.params.index)
	// if( !isProperIndex(index, tools.length) ) {
	// 	res.status(400).send('Bad tool index')
	// } else {
	// 	tools.splice(index, 1)
	// 	res.sendStatus(200)
	// }
});
// FUNCTIONS

//GET ALL function
async function getAllHamsters() {
  const docRef = db.collection(HAMSTERS);
  const docSnapshot = await docRef.get();
  //Om det inte finns några hamstrar, skicka tillbaka en tom lista
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

//UPDATE ONE function
async function updateOne(id, object) {
	const docRef = db.collection(HAMSTERS).doc(id)
	docRef.set(object)
}

//DELETE function
async function deleteOneHamster(id) {
  const docRef =  db.collection(HAMSTERS).doc(id);
  const docSnapshot = await docRef.get();

  if (docSnapshot.exists) {
    const hamster = await docSnapshot.data();
    console.log('The hamster that i requested:', hamster)
    return await docRef.delete;
  }
}

//ADD ONE function
async function addOneHamster(object) {
  const docRef = await db.collection(HAMSTERS).add(object);
  const hamster = { id: docRef.id }
  return hamster
  // docRef.set(object);
}






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



// async function getRandomHamster() {
//   //Hämtar alla hamstrar
//   const hamstersRef = db.collection(HAMSTERS);
//   const hamstersSnapshot = await hamstersRef.get();

//   // // Om det inte finns några hamstrar, skicka tillbaka en tom lista
//   // if (hamstersSnapshot.empty) {
//   //   return [];
//   // }

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
//   console.log("random array list" , array)
//   return array;
// }

router.get("/random", async (req, res) => {

  let array = await getAllHamsters();
  console.log(array); //skriver ut alla objekt i arrayen korrekt
  res.status(200).send(array);


  // let array = await getRandomHamster()
  // console.log(array)
  // res.send("array")

  // let randomHamster =
  // array[Math.floor(Math.random() * array.length)]
  // res.status(200).send(randomHamster)
});