const express = require('express')
const router = express.Router()

const database = require('../database.js')
const connect = database.connect
const db = connect()
const HAMSTERS = 'hamsters'

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

// Uppdaterar ett dokument 
router.put('/:id', async (req, res) => {
    const maybeBody = req.body
    // kontrollera att bodyn är ok - om ok skicka ändringar till databas och returnera en statuskod
    // Body måste innehålla dessa värden
    if (!isHamsterObject(maybeHamster)) {
        res.status(400).send('Must send a correct hamster object')
    }
})

// valideringsfunktion
function isHamsterObject(maybe) {
    //om maybe inte är ett objekt
    if ( (typeof maybe) !== 'object') {
        return false
    } 
    // får en lista på egenskaperna
    let keys = Object.keys(maybe)
    const allowed = ['name', 'loves', 'games', 'wins', 'age', 'favFood', 'imgName', 'defeats']
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

module.exports = router