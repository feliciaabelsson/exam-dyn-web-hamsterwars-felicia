const express = require('express')
const router = express.Router()

const database = require('../database.js')
const connect = database.connect
const db = connect()
const HAMSTERS = 'hamsters'


// GET
// '/' räknas som /hamsters 
// async används eftersom koden som ligger inuti använder await 
router.get('/', async (req, res) => {
    // Eftersom det är en asynkron funktion måste vi lägga til await 
	let array = await getAllHamsters()
	res.send(array)
})

// Hämtar ett dokument med ett specifikt id 
router.get('/:id', async (req, res) => {
    // Funktion som hämtar ett element om det finns 
    const maybeHamster = await getOneHamster(req.params.id)
    // om maybeHamster finns 
    res.send(maybeHamster)
   
})

// PUT
// Uppdaterar ett dokument 
router.put('/:id', async (req, res) => {
    const maybeBody = req.body
    // kontrollera att bodyn är ok - om ok skicka ändringar till databas och returnera en statuskod
    // Body måste innehålla dessa värden
    if (!isHamsterObject(maybeBody)) {
        res.status(400).send('Must send a correct hamster object')
        return
    } 

    // skickar ändringar till databasen
    await updateOneHamster(req.params.id, maybeBody)
    res.sendStatus(200)
}) 


// WHAT TO ADD - G-nivå
//1. GET - /hamsters/random
//2. POST - /hamsters
//3. DELETE - /hamsters/:id
//4. GET - /hamsters/cutest - array med hamstrar som vunnit flest gånger
           //gå igenom alla hamstrar, 
           //räkna ut enligt räknetabellen
//PUBLIC mapp? Där ska bilderna renderas



// FUNCTIONS

// valideringsfunktion
function isHamsterObject(maybe) {
    //om maybe inte är ett objekt
    if ( (typeof maybe) !== 'object') {
        return false
    } 
    // får en lista på egenskaperna
    let keys = Object.keys(maybe)
    // om någon av dessa egenskaperna saknas är det inte ett hamster-objekt
    if ( !keys.includes('name') || !keys.includes('loves') || !keys.includes('games') || !keys.includes('wins') || !keys.includes('age') || !keys.includes('favFood') || !keys.includes('imgName') || !keys.includes('defeats') ) {
		return false
	}
    // om  objekt finns med alla egenskaperna
	return true
}


// Funktion som hämtar alla hamstrar från databasen
async function getAllHamsters() {
	const hamstersRef = db.collection(HAMSTERS)
	const hamstersSnapshot = await hamstersRef.get()

    // Om det inte finns några hamstrar, skicka tillbaka en tom lista
	if( hamstersSnapshot.empty ) {
		return []
	}

	const array = []
    // Loopar igenom alla hamstrar och väntar till loopen är klar
	await hamstersSnapshot.forEach(async docRef => {
        // Väntar på att data ska hämtas 
		const data = await docRef.data()
        // Plockar ut varje id
		data.id = docRef.id
        // pushar data till arrayen
		array.push(data)
	})
	return array
}

//async eftersom vi kommunicerar med databasen som kommer ta tid
async function getOneHamster(id) {
    const docRef = db.collection(HAMSTERS).doc(id)
    const docSnapshot = await docRef.get()

    // Kollar om jag har ett dokument eller inte
    if( docSnapshot.exists ) {
        const hamster = await docSnapshot.data()
        return hamster
    } else {
        return null
    }
}

async function updateOneHamster(id, object) {
    const docRef = db.collection(HAMSTERS).doc(id)
    docRef.set(object)
}

module.exports = router