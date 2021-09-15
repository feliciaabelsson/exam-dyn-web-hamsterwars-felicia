const express = require('express')
const app = express()

//first run environmental variable, if not run port 1337
//environmental variables is good for sercrets
const PORT = process.env.PORT || 1337


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`)
})

