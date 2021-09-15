const database = require('../database')
//gets connect object from database file
const connect = database.connect
//calls connect function
const db = connect()

console.log('Retrieving all document from databse')

