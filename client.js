const express = require('express')
const path = require('path')

// create the express app
const app = express()

// create middleware to handle the serving the app
app.use("/", express.static(__dirname + '/dist'))

// Create default port to serve the app on
const port = process.env.PORT || 3130
app.listen(port)

// Log a feedback that this is actually running
console.log('Server started on port ' + port)