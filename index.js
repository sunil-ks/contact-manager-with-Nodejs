const express = require('express')
const { mongoose } = require('./config/database')
const { routes } = require('./config/routes')

const app = express() 
const port = 3000

// configure express to use json data 
app.use(express.json())

// route matching 
app.use('/', routes )


app.listen(port, function(){
    console.log('listening on port', port)
})