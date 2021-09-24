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
  console.log(array);
  res.status(200).send(array);
});

router.get("/random", async (req, res) => {
  let array = await getAllHamsters();
  console.log(array);

  let randomHamster =
  array[Math.floor(Math.random() * array.length)]
  res.status(200).send(randomHamster)
});

router.get("/:id", async (req, res) => {
  // Funktion som hämtar ett element om det finns
  const maybeHamster = await getOneHamster(req.params.id);

  if (!maybeHamster) { //Denna borde funka när delete är klar
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
  let addHamster = await addOneHamster(maybeBody);
  res.status(200).send(addHamster);
});

async function updateOneHamster(id, object) {
  const docRef = db.collection(HAMSTERS).doc(id);
  docRef.set(object);
}

// PUT ENDPOINTS
router.put("/:id", async (req, res) => {
  const maybeBody = req.body;
  const id = req.params.id
  const data = maybeBody
  
  const maybeHamster = req.params.id
// const maybeHamster = await getOneHamster(id)
  
  //1. kontrollera om id finns i db
  if(!maybeHamster) { //om inte id finns 
    console.log('1st if')
    res.sendStatus(404);
    return;
  //  }  else if (data !== {merge: true}) { //om inget ändrats i body
  //   console.log('2nd if')
  //     res.sendStatus(400)
     }
   else {
    console.log('3d if')
    await db.collection(HAMSTERS).doc(id).set(data, {merge: true})
    res.sendStatus(200)



    // if(maybeHamster) { //om id finns 
  //   console.log('1st if')
  //   await db.collection(HAMSTERS).doc(id).set(data, {merge: true})
  //   res.sendStatus(200)
  //  }  
  //  else if (!maybeHamster){
  //   console.log('2st if')
  //   res.status(404).send('Not found id');
  //   return;
  // }
  //   else if (data !== {merge: true}) { //om inget ändrats i body
  //     console.log('3d if')
  //     res.status(400).send('No change in body')
  //  }


    // await updateOneHamster(req.params.id, maybeBody)
    // await db.collection(HAMSTERS).doc(maybeHamster).set(updates, settings)
    //  let updateHamster = 
    // console.log("The hamster object from get id" , maybeHamster); //här har du idt 
    //res.status(200).send(maybeHamster);//denna hämtar id - SKA ändra till att objektet inuti idt ändras till ny data
    //  docSnapshot[maybeHamster] = req.body
    // let updateHamster =  maybeHamster[req.body]
    //  res.status(200).send(updateHamster)


  //  } else if (!isHamsterObject(maybeBody)) { //jag kollar om det är ett objekt, ska inte göra det ska kolla bara id
  //   console.log('2nd if')
  //   res.status(400).send("Bad request");
  //   return;
    

    // let addHamster = await addOneHamster(maybeBody);
    // res.status(200).send(addHamster);
  
  }




  //ändringar i body ska skriva över nuvarande body 
  // let index = Number(req.params.index)
	// if( !isProperIndex(index, tools.length) ) {
	// 	res.status(400).send('Bad tool index')
	// }
	// else if( !isToolsObject(req.body) ) {
	// 	res.status(400).send('Bad tool object')
	// }
	// else {
	// 	tools[index] = req.body
	// 	res.sendStatus(200)
	// }


  //  if(maybeHamster.exists) {
  //    res.status(200).send('id exists')
  //  } else {
  //    res.status(404).send('Not found id')
  //  }
  
  // else {
  //   res.sendStatus(200)
  // }
  //2. kontrollera om det är någon ändring i body

  // if (!isHamsterObject(maybeBody)) { //ska inte kolla om body stämmer, utan om body gör några ändringar
  //   res.status(404).send("Must send a correct hamster object");
  //   return;
  // }
  // //3. Pusha ihop ändringar i body till det rätta idt 
  // await updateOneHamster(req.params.id, maybeBody);
  // res.sendStatus(200);

});

function isProperIndex(index, maxIndex) {
	return index >= 0 && index < maxIndex
}


//DELETE ENDPOINTS
router.delete("/:id", async (req, res) => {
  let array = await getAllHamsters();
  const id = req.params
  const index = array.findIndex(h => h.id == id)
  let indexHamster = Number(req.params.index)
  //goes into the database and into collection hamsters and then into doucment and the looks for the chosen id
	// const docRef = db.collection(HAMSTERS).doc(id)
  // //gest the status if the id is true or false
  // const docSnapshot = await docRef.get()
 
 

  if(index) {
    array.splice(index, 1)
    // const result = await docRef.delete()
     res.sendStatus(200)
     return
  } else {
    res.status(404).send('Not found id');
    return;
  }
 

// const docId = await getOneHamster(req.params.id);
// const docRef = db.collection(HAMSTERS).doc(docId)
// const docSnapshot = await docRef.get()

// if (docSnapshot.exists) {
// 	const result = await docRef.delete()
//   res.status(200).send(result)
// } else {
//   res.status(404).send('Doc does not exists')
// }



  // console.log('Document exists? ', docSnapshot.exists);
    //if the document reference exists then delete


  

  //1. hämta id från databas 
  //2. (Kolla om id finns)
  //3. 
  // const docRef = db.collection(HAMSTERS);
  // const docSnapshot = await docRef.get();
  // let array = await getAllHamsters();
  // const getIndex = (id) => array.findIndex(u => u.id == parseInt(id))
  // const hamsterIndex = getIndex(req.params.id)


  // if (hamsterIndex === -1) return res.sendStatus(404)

  // array.splice(userIndex, 1)
  // res.send(array)


  // let index = req.params.index
	// if( !isProperIndex(index, array.length) ) {
	// 	res.status(404).send('Bad hamster index')
	// } else {
	// 	array.splice(index, 1)
	// 	res.sendStatus(200)
	// }

});


// FUNCTIONS

//ADD ONE function 
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






module.exports = router;

// WHAT TO ADD - G-nivå
//3. DELETE - /hamsters/:id
//4. GET - /hamsters/cutest - array med hamstrar som vunnit flest gånger
//gå igenom alla hamstrar,
//räkna ut enligt räknetabellen
//PUBLIC mapp? Där ska bilderna renderas



//Object.
//value.
//includes
//kolla att valuet är number på objekten som ska ändras
